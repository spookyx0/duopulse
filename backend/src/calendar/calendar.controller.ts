import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { CreateCalendarScheduleDto, UpdateCalendarScheduleDto } from './calendar.dto';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get()
  async findAll(@Request() req) {
    return this.calendarService.findAll(req.user.userId);
  }

  @Get('upcoming')
  async getUpcoming(@Request() req, @Query('days') days: string) {
    return this.calendarService.getUpcoming(req.user.userId, days ? parseInt(days) : 7);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.calendarService.findOne(+id, req.user.userId);
  }

  @Post()
  async create(@Body() createCalendarDto: CreateCalendarScheduleDto, @Request() req) {
    return this.calendarService.create(createCalendarDto, req.user.userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCalendarDto: UpdateCalendarScheduleDto, @Request() req) {
    return this.calendarService.update(+id, updateCalendarDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.calendarService.remove(+id, req.user.userId);
  }
}