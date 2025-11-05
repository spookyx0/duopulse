import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getPartner(req: any): Promise<import("./user.entity").User>;
    getProfile(req: any): Promise<import("./user.entity").User>;
}
