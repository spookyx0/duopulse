import { Repository } from 'typeorm';
import { DailyThought } from './daily-thought.entity';
import { CreateThoughtDto, UpdateThoughtDto } from './thoughts.dto';
export declare class ThoughtsService {
    private thoughtsRepository;
    constructor(thoughtsRepository: Repository<DailyThought>);
    findAll(userId: number): Promise<DailyThought[]>;
    findPinned(userId: number): Promise<DailyThought[]>;
    findOne(id: number, userId: number): Promise<DailyThought>;
    create(createThoughtDto: CreateThoughtDto, userId: number): Promise<DailyThought>;
    update(id: number, updateThoughtDto: UpdateThoughtDto, userId: number): Promise<DailyThought>;
    pinThought(id: number, userId: number): Promise<DailyThought>;
    unpinThought(id: number, userId: number): Promise<DailyThought>;
    remove(id: number, userId: number): Promise<void>;
}
