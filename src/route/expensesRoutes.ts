import { Router } from "express";
import { recordController } from "../controllers/RecordController";
import { categoryController } from "../controllers/CategoryController";
import { userController } from "../controllers/UserController";
import { authorization } from "../middleware/authorization";
import bodyParser from "body-parser";

const router = Router();
router.use(bodyParser.json());

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh", userController.refreshToken);

router.post("/records", authorization, recordController.create);
router.get("/records", authorization, recordController.read);
router.put("/record/:id", authorization, recordController.update);
router.delete("/record/:id", authorization, recordController.delete);
router.put("/records/update", authorization, recordController.updateManyTitles);

router.post("/categories", authorization, categoryController.create);
router.get("/categories", authorization, categoryController.read);
router.put("/category/:id", authorization, categoryController.update);
router.delete("/category/:id", authorization, categoryController.delete);

export default router;
