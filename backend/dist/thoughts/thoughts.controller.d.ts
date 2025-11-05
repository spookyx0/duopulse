import { ThoughtsService } from './thoughts.service';
import { CreateThoughtDto, UpdateThoughtDto } from './thoughts.dto';
export declare class ThoughtsController {
    private thoughtsService;
    constructor(thoughtsService: ThoughtsService);
    findAll(req: any): Promise<import("./daily-thought.entity").DailyThought[]>;
    findPinned(req: any): Promise<import("./daily-thought.entity").DailyThought[]>;
    findOne(id: string, req: any): Promise<import("./daily-thought.entity").DailyThought>;
    create(createThoughtDto: CreateThoughtDto, req: any): Promise<import("./daily-thought.entity").DailyThought>;
    update(id: string, updateThoughtDto: UpdateThoughtDto, req: any): Promise<import("./daily-thought.entity").DailyThought>;
    pinThought(id: string, req: any): Promise<import("./daily-thought.entity").DailyThought>;
    unpinThought(id: string, req: any): Promise<import("./daily-thought.entity").DailyThought>;
    remove(id: string, req: any): Promise<void>;
}
