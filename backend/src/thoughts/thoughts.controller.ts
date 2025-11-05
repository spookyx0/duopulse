import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThoughtsService } from './thoughts.service';
import { CreateThoughtDto, UpdateThoughtDto } from './thoughts.dto';

@Controller('thoughts')
@UseGuards(JwtAuthGuard)
export class ThoughtsController {
  constructor(private thoughtsService: ThoughtsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.thoughtsService.findAll(req.user.userId);
  }

  @Get('pinned')
  async findPinned(@Request() req) {
    return this.thoughtsService.findPinned(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.thoughtsService.findOne(+id, req.user.userId);
  }

  @Post()
  async create(@Body() createThoughtDto: CreateThoughtDto, @Request() req) {
    return this.thoughtsService.create(createThoughtDto, req.user.userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateThoughtDto: UpdateThoughtDto, @Request() req) {
    return this.thoughtsService.update(+id, updateThoughtDto, req.user.userId);
  }

  @Patch(':id/pin')
  async pinThought(@Param('id') id: string, @Request() req) {
    return this.thoughtsService.pinThought(+id, req.user.userId);
  }

  @Patch(':id/unpin')
  async unpinThought(@Param('id') id: string, @Request() req) {
    return this.thoughtsService.unpinThought(+id, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.thoughtsService.remove(+id, req.user.userId);
  }
}