"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.expensesController = void 0;
const User_1 = require("../models/User");
const authorization_1 = require("../middleware/authorization");
const Record_1 = require("../models/Record");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ExpensesController {
  register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, email, password } = req.body;
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
          const createUser = yield User_1.User.create({
            name,
            email,
            password,
          });
          return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { email },
          });
        } else {
          return res
            .status(409)
            .json({ error: "Conflict", message: "Email already exists" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
  login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
          return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid email or password",
          });
        }
        const decryptedPassword = yield bcryptjs_1.default.compare(
          password,
          user.password
        );
        if (!decryptedPassword) {
          return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid email or password",
          });
        }
        const accessToken = (0, authorization_1.generateToken)(user.id);
        const refreshToken = (0, authorization_1.generateToken)(user.id, "7d");
        if (accessToken) {
          res.status(200).json({
            success: true,
            user,
            token: { accessToken, refreshToken },
          });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
  createRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { date, value, description, category } = req.body;
        const token = req.headers.authorization;
        const decode = (0, authorization_1.decodeToken)(token);
        const user = yield User_1.User.findOne({
          where: { id: decode.userId },
        });
        if (user) {
          const newRecord = yield Record_1.Record.create({
            date,
            value,
            description,
            category,
            userId: decode.userId,
          });
          return res
            .status(201)
            .json({ success: true, data: { record: newRecord } });
        } else {
          return res
            .status(401)
            .json({ error: "Unauthorized", message: "Invalid token" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
  readRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const token = req.headers.authorization;
        const decode = (0, authorization_1.decodeToken)(token);
        const records = yield Record_1.Record.findAll({
          where: { userId: decode.userId },
        });
        if (records && records.length > 0) {
          return res.status(200).json({ success: true, records });
        } else {
          return res
            .status(404)
            .json({ error: "Not Found", message: "User records not found" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
  updateRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { date, value, description, category } = req.body;
        const { id } = req.params;
        const token = req.headers.authorization;
        const decode = (0, authorization_1.decodeToken)(token);
        const existingRecord = yield Record_1.Record.findOne({
          where: { userId: decode.userId, id: id },
        });
        if (!existingRecord) {
          return res
            .status(404)
            .json({ error: "Not Found", message: "Record not found" });
        }
        const updatedRecord = yield existingRecord.update({
          date,
          value,
          description,
          category,
        });
        return res
          .status(200)
          .json({ success: true, data: { record: updatedRecord } });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
  deleteRecord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const token = req.headers.authorization;
        const decode = (0, authorization_1.decodeToken)(token);
        const deletedRecordsCount = yield Record_1.Record.destroy({
          where: { userId: decode.userId, id: id },
        });
        if (deletedRecordsCount) {
          return res
            .status(200)
            .json({ success: true, message: `Record ID - ${id} - DELETED` });
        } else {
          return res
            .status(404)
            .json({ error: "Not Found", message: "Record doesn't exist" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
  refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken)
        res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      const decode = (0, authorization_1.decodeToken)(refreshToken);
      const accessToken = (0, authorization_1.generateToken)(decode.userId);
      return res
        .status(200)
        .json({ success: true, token: { accessToken, refreshToken } });
    });
  }
}
exports.expensesController = new ExpensesController();
//# sourceMappingURL=ExpensesController.js.map
