import { Controller, Get, Post, Delete, Param, UseGuards, Request, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get()
  async findAll(@Request() req) {
    return this.filesService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.filesService.findOne(+id, req.user.userId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body('description') description: string,
  ) {
    return this.filesService.uploadFile(file, req.user.userId, description);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.filesService.remove(+id, req.user.userId);
  }
}