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
exports.ThoughtsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const thoughts_service_1 = require("./thoughts.service");
const thoughts_dto_1 = require("./thoughts.dto");
let ThoughtsController = class ThoughtsController {
    constructor(thoughtsService) {
        this.thoughtsService = thoughtsService;
    }
    async findAll(req) {
        return this.thoughtsService.findAll(req.user.userId);
    }
    async findPinned(req) {
        return this.thoughtsService.findPinned(req.user.userId);
    }
    async findOne(id, req) {
        return this.thoughtsService.findOne(+id, req.user.userId);
    }
    async create(createThoughtDto, req) {
        return this.thoughtsService.create(createThoughtDto, req.user.userId);
    }
    async update(id, updateThoughtDto, req) {
        return this.thoughtsService.update(+id, updateThoughtDto, req.user.userId);
    }
    async pinThought(id, req) {
        return this.thoughtsService.pinThought(+id, req.user.userId);
    }
    async unpinThought(id, req) {
        return this.thoughtsService.unpinThought(+id, req.user.userId);
    }
    async remove(id, req) {
        return this.thoughtsService.remove(+id, req.user.userId);
    }
};
exports.ThoughtsController = ThoughtsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pinned'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "findPinned", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [thoughts_dto_1.CreateThoughtDto, Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, thoughts_dto_1.UpdateThoughtDto, Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/pin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "pinThought", null);
__decorate([
    (0, common_1.Patch)(':id/unpin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "unpinThought", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThoughtsController.prototype, "remove", null);
exports.ThoughtsController = ThoughtsController = __decorate([
    (0, common_1.Controller)('thoughts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [thoughts_service_1.ThoughtsService])
], ThoughtsController);
//# sourceMappingURL=thoughts.controller.js.map