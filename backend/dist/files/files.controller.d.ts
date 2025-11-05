import { FilesService } from './files.service';
export declare class FilesController {
    private filesService;
    constructor(filesService: FilesService);
    findAll(req: any): Promise<import("./file.entity").File[]>;
    findOne(id: string, req: any): Promise<import("./file.entity").File>;
    uploadFile(file: Express.Multer.File, req: any, description: string): Promise<import("./file.entity").File>;
    remove(id: string, req: any): Promise<void>;
}
