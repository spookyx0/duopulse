import { Repository } from 'typeorm';
import { File } from './file.entity';
export declare class FilesService {
    private filesRepository;
    private readonly uploadPath;
    constructor(filesRepository: Repository<File>);
    private ensureUploadDirectory;
    uploadFile(file: Express.Multer.File, userId: number, description?: string): Promise<File>;
    findAll(userId: number): Promise<File[]>;
    findOne(id: number, userId: number): Promise<File>;
    remove(id: number, userId: number): Promise<void>;
}
