"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExpensesController_1 = require("../controllers/ExpensesController");
const body_parser_1 = __importDefault(require("body-parser"));
const authorization_1 = require("../middleware/authorization");
const router = (0, express_1.Router)();
router.use(body_parser_1.default.json());
router.post("/register", ExpensesController_1.expensesController.register);
router.post("/login", ExpensesController_1.expensesController.login);
router.get("/records", authorization_1.authorization, ExpensesController_1.expensesController.readRecord);
router.post("/records", authorization_1.authorization, ExpensesController_1.expensesController.createRecord);
router.put("/record/:id", authorization_1.authorization, ExpensesController_1.expensesController.updateRecord);
router.delete("/record/:id", authorization_1.authorization, ExpensesController_1.expensesController.deleteRecord);
router.post("/refresh", ExpensesController_1.expensesController.refreshToken);
exports.default = router;
//# sourceMappingURL=expensesRoutes.js.map