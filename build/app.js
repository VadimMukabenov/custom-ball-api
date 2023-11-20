"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const api_1 = require("./routes/api");
const DI_1 = require("./core/DI");
const dotenv_1 = __importDefault(require("dotenv"));
//For env File 
dotenv_1.default.config();
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, config_1.getConfig)();
        const app = (0, DI_1.buildApp)(config);
        const router = (0, api_1.buildApi)(app);
        const PORT = config.APP_PORT || 3000;
        const expressApp = (0, express_1.default)();
        expressApp.use(express_1.default.json());
        expressApp.use(router);
        expressApp.listen(PORT, () => {
            console.log(`Server is running on port new ${PORT}`);
        });
    });
}
start();
//# sourceMappingURL=app.js.map