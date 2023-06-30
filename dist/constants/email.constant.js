"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTemplates = void 0;
const email_enum_1 = require("../enums/email.enum");
exports.allTemplates = {
    [email_enum_1.EEmailActions.REGISTER]: {
        templateName: "register",
        subject: "Register into our school ",
    },
    [email_enum_1.EEmailActions.WELCOME]: {
        templateName: "register",
        subject: "Welcome to our school ",
    },
    [email_enum_1.EEmailActions.ACTIVATED]: {
        templateName: "activated",
        subject: "Please activated your account ",
    },
    [email_enum_1.EEmailActions.FORGOT_PASSWORD]: {
        templateName: "forgot-password",
        subject: "Please restore your password ",
    },
};
