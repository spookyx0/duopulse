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
exports.ThoughtsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_thought_entity_1 = require("./daily-thought.entity");
let ThoughtsService = class ThoughtsService {
    constructor(thoughtsRepository) {
        this.thoughtsRepository = thoughtsRepository;
    }
    async findAll(userId) {
        return this.thoughtsRepository.find({
            where: { created_by: { id: userId } },
            relations: ['created_by', 'updated_by', 'pinned_by'],
            order: { created_at: 'DESC' },
        });
    }
    async findPinned(userId) {
        return this.thoughtsRepository.find({
            where: { is_pinned: true },
            relations: ['created_by', 'updated_by', 'pinned_by'],
            order: { pinned_at: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const thought = await this.thoughtsRepository.findOne({
            where: { id, created_by: { id: userId } },
            relations: ['created_by', 'updated_by', 'pinned_by'],
        });
        if (!thought) {
            throw new common_1.NotFoundException('Thought not found');
        }
        return thought;
    }
    async create(createThoughtDto, userId) {
        const thought = this.thoughtsRepository.create({
            ...createThoughtDto,
            created_by: { id: userId },
            updated_by: { id: userId },
        });
        return await this.thoughtsRepository.save(thought);
    }
    async update(id, updateThoughtDto, userId) {
        const thought = await this.findOne(id, userId);
        const updatedThought = {
            ...thought,
            ...updateThoughtDto,
            updated_by: { id: userId },
        };
        return await this.thoughtsRepository.save(updatedThought);
    }
    async pinThought(id, userId) {
        const thought = await this.findOne(id, userId);
        thought.is_pinned = true;
        thought.pinned_by = { id: userId };
        thought.pinned_at = new Date();
        thought.updated_by = { id: userId };
        return await this.thoughtsRepository.save(thought);
    }
    async unpinThought(id, userId) {
        const thought = await this.findOne(id, userId);
        thought.is_pinned = false;
        thought.pinned_by = null;
        thought.pinned_at = null;
        thought.updated_by = { id: userId };
        return await this.thoughtsRepository.save(thought);
    }
    async remove(id, userId) {
        const thought = await this.findOne(id, userId);
        await this.thoughtsRepository.remove(thought);
    }
};
exports.ThoughtsService = ThoughtsService;
exports.ThoughtsService = ThoughtsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_thought_entity_1.DailyThought)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ThoughtsService);
//# sourceMappingURL=thoughts.service.js.map