import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { File } from './file.entity';

@Injectable()
export class FilesService {
  private readonly uploadPath = process.env.UPLOAD_PATH || './uploads/files';

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, userId: number, description?: string): Promise<File> {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed. Only PDF, PPTX, XLSX, DOCX are allowed.');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB.');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = join(this.uploadPath, uniqueFilename);

    // Save file
    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    // Create file record
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

  async findAll(userId: number): Promise<File[]> {
    return this.filesRepository.find({
      where: { created_by: { id: userId } },
      relations: ['created_by', 'updated_by'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<File> {
    const file = await this.filesRepository.findOne({
      where: { id, created_by: { id: userId } },
      relations: ['created_by', 'updated_by'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async remove(id: number, userId: number): Promise<void> {
    const file = await this.findOne(id, userId);
    
    // Delete physical file
    const fs = require('fs');
    if (existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }
    
    await this.filesRepository.remove(file);
  }
}