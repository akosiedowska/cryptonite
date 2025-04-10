"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenDynamicPart = void 0;
const getTokenDynamicPart = (token) => {
    if (!token)
        return;
    const firstDotIndex = token.indexOf('.');
    return token.substring(firstDotIndex + 1);
};
exports.getTokenDynamicPart = getTokenDynamicPart;
