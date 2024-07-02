import { Router } from "express";
import { userController } from "../controllers/UserController";
import { authorization } from "../middleware/authorization";
import bodyParser from "body-parser";
import { prismaClient } from "../prisma";
import { ApiRouter } from "./ApiRouter";

const router = Router();
router.use(bodyParser.json());

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh", userController.refreshToken);

// const user = new ApiRouter(
//   router,
//   "user",
//   prismaClient.user,
//   authorization
// );

const account = new ApiRouter(
  router,
  "account",
  prismaClient.account,
  authorization
);
const category = new ApiRouter(
  router,
  "category",
  prismaClient.category,
  authorization
);
const record = new ApiRouter(
  router,
  "record",
  prismaClient.record,
  authorization
);
export default router;
