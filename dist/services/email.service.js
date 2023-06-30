"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path = __importStar(require("path"));
const config_1 = require("../configs/config");
const email_constant_1 = require("../constants/email.constant");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            from: "No reply",
            service: "gmail",
            auth: {
                user: config_1.configs.NO_REPLY_EMAIL,
                pass: config_1.configs.NO_REPLY_PASSWORD,
            },
        });
        const hbsOptions = {
            viewEngine: {
                extname: ".hbs",
                defaultLayout: "main",
                layoutsDir: path.join(process.cwd(), "src", "email-templates", "layouts"),
                partialsDir: path.join(process.cwd(), "src", "email-templates", "partials"),
            },
            viewPath: path.join(process.cwd(), "src", "email-templates", "views"),
            extName: ".hbs",
        };
        this.transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(hbsOptions));
    }
    sendMail(email, emailAction, context = {}) {
        const { templateName, subject } = email_constant_1.allTemplates[emailAction];
        context.frontUrl = config_1.configs.FRONT_URL;
        const mailOptions = {
            to: email,
            subject,
            template: templateName,
            context,
        };
        return this.transporter.sendMail(mailOptions);
    }
}
exports.emailService = new EmailService();
