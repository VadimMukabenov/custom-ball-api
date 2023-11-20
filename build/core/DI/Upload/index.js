"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUploadController = void 0;
const UploadService_1 = __importDefault(require("../../services/UploadService"));
const UploadController_1 = __importDefault(require("../../controllers/UploadController"));
const s3Client_1 = require("../../../libs/s3Client");
function buildUploadController(config) {
    const s3Client = (0, s3Client_1.getS3Client)(config);
    const uploadService = new UploadService_1.default(s3Client);
    const uploadController = new UploadController_1.default(uploadService);
    return uploadController;
}
exports.buildUploadController = buildUploadController;
//# sourceMappingURL=index.js.map