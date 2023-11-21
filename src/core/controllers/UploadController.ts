import { Request, Response } from "express";
import UploadService from "../services/UploadService"

class UploadController {
    uploadService: UploadService;
    constructor(uploadService: UploadService) {
        this.uploadService = uploadService;
    }

    async run(req: Request, res: Response) {
        try {
            const files = req.files;
            const email = req.body.email as string;
            await this.uploadService.run(files, email);
            res.json({ status: true });
        } catch (err) {
            console.error(err);
            res.json({ status: false, mes: err });
        }
    }
}

export default UploadController;