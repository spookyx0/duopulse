import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            avatar_url: any;
        };
    }>;
    register(registerDto: {
        email: string;
        password: string;
        name: string;
    }): Promise<any>;
    getProfile(req: any): any;
}
