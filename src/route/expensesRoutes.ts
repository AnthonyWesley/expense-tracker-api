import { Router } from "express";
import { expensesController } from "../controllers/ExpensesController";
import bodyParser from "body-parser";
import { authorization } from "../middleware/authorization";
import { error } from "console";

const router = Router();
router.use(bodyParser.json());

router.post("/register", expensesController.register);
router.post("/login", expensesController.login);
router.get("/records", authorization, expensesController.readRecord);
router.post("/records", authorization, expensesController.createRecord);
router.put("/record/:id", authorization, expensesController.updateRecord);
router.delete("/record/:id", authorization, expensesController.deleteRecord);

router.post("/refresh", expensesController.refreshToken);

router.post("/ping", expensesController.pingPong);

export default router;
