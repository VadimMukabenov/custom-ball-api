import { Request, Response } from "express";
import UploadService from "../services/UploadService"

type requestBodyInput = {
    full_name: string;
    email: string;
    phone: string;
    address: string;
}

class UploadController {
    uploadService: UploadService;
    constructor(uploadService: UploadService) {
        this.uploadService = uploadService;
    }

    async run(req: Request, res: Response) {
        try {
            const files = req.files;
            const body: requestBodyInput = req?.body;

            const result = await this.uploadService.run(files, body);
            
            res.json({ 
                status: true, 
                data: {
                    cloud_dir_name: result.cloudDirName,
                }
            });
        } catch (err) {
            console.error(err);
            res.json({ status: false, mes: err });
        }
    }
}

export default UploadController;