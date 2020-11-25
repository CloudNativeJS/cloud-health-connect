"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logo = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
exports.logo = (() => {
    try {
        return fs_1.readFileSync(path_1.join(__dirname, 'healthcheck.svg'), 'utf-8');
    }
    catch (err) {
        return undefined;
    }
})();
//# sourceMappingURL=HealthLogo.js.map