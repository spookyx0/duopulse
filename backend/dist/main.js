"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    await app.listen(process.env.PORT || 3001);
    console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3001}`);
    console.log(`📡 WebSocket gateway ready`);
}
bootstrap();
//# sourceMappingURL=main.js.map