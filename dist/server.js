"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expensesRoutes_1 = __importDefault(require("./route/expensesRoutes"));
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
// server.use(cors());
server.use((0, cors_1.default)({ origin: "*" }));
server.use(express_1.default.json());
server.use(expensesRoutes_1.default);
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map