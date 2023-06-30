"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexConstants = void 0;
exports.regexConstants = {
    EMAIL: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/,
};
