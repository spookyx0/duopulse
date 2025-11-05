"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs_1 = require("fs");
const path_1 = require("path");
const file_entity_1 = require("./file.entity");
let FilesService = class FilesService {
    constructor(filesRepository) {
        this.filesRepository = filesRepository;
        this.uploadPath = process.env.UPLOAD_PATH || './uploads/files';
        this.ensureUploadDirectory();
    }
    ensureUploadDirectory() {
        if (!(0, fs_1.existsSync)(this.uploadPath)) {
            (0, fs_1.mkdirSync)(this.uploadPath, { recursive: true });
        }
    }
    async uploadFile(file, userId, description) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('File type not allowed. Only PDF, PPTX, XLSX, DOCX are allowed.');
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size too large. Maximum size is 10MB.');
        }
        const fileExtension = file.originalname.split('.').pop();
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = (0, path_1.join)(this.uploadPath, uniqueFilename);
        const writeStream = (0, fs_1.createWriteStream)(filePath);
        writeStream.write(file.buffer);
        writeStream.end();
        const fileRecord = this.filesRepository.create({
            filename: uniqueFilename,
            original_name: file.originalname,
            file_path: filePath,
            file_size: file.size,
            file_type: fileExtension,
            mime_type: file.mimetype,
            description,
            created_by: { id: userId },
            updated_by: { id: userId },
        });
        return await this.filesRepository.save(fileRecord);
    }
    async findAll(userId) {
        return this.filesRepository.find({
            where: { created_by: { id: userId } },
            relations: ['created_by', 'updated_by'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const file = await this.filesRepository.findOne({
            where: { id, created_by: { id: userId } },
            relations: ['created_by', 'updated_by'],
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        return file;
    }
    async remove(id, userId) {
        const file = await this.findOne(id, userId);
        const fs = require('fs');
        if ((0, fs_1.existsSync)(file.file_path)) {
            fs.unlinkSync(file.file_path);
        }
        await this.filesRepository.remove(file);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_entity_1.File)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FilesService);
//# sourceMappingURL=files.service.js.map