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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calendar_schedule_entity_1 = require("./calendar-schedule.entity");
let CalendarService = class CalendarService {
    constructor(calendarRepository) {
        this.calendarRepository = calendarRepository;
    }
    async findAll(userId) {
        return this.calendarRepository.find({
            where: { created_by: { id: userId } },
            relations: ['created_by', 'updated_by'],
            order: { start_time: 'ASC' },
        });
    }
    async findOne(id, userId) {
        const schedule = await this.calendarRepository.findOne({
            where: { id, created_by: { id: userId } },
            relations: ['created_by', 'updated_by'],
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Calendar schedule not found');
        }
        return schedule;
    }
    async create(createCalendarDto, userId) {
        const schedule = this.calendarRepository.create({
            ...createCalendarDto,
            created_by: { id: userId },
            updated_by: { id: userId },
        });
        return await this.calendarRepository.save(schedule);
    }
    async update(id, updateCalendarDto, userId) {
        const schedule = await this.findOne(id, userId);
        Object.assign(schedule, {
            ...updateCalendarDto,
            updated_by: { id: userId },
        });
        return await this.calendarRepository.save(schedule);
    }
    async remove(id, userId) {
        const schedule = await this.findOne(id, userId);
        await this.calendarRepository.remove(schedule);
    }
    async getUpcoming(userId, days = 7) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + days);
        return this.calendarRepository
            .createQueryBuilder('schedule')
            .leftJoinAndSelect('schedule.created_by', 'created_by')
            .leftJoinAndSelect('schedule.updated_by', 'updated_by')
            .where('schedule.created_by = :userId', { userId })
            .andWhere('schedule.start_time BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .orderBy('schedule.start_time', 'ASC')
            .getMany();
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_schedule_entity_1.CalendarSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map