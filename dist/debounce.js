"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce = (func, wait = 100) => {
    let timeout;
    const debounced = (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
    return debounced;
};
exports.default = debounce;
//# sourceMappingURL=debounce.js.map