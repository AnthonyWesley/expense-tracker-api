"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middleware/authorization.ts
var authorization_exports = {};
__export(authorization_exports, {
  authorization: () => authorization,
  decodeToken: () => decodeToken,
  generateToken: () => generateToken
});
module.exports = __toCommonJS(authorization_exports);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var authorization = (req, res, next) => {
  const token = req.headers.authorization;
  const secretKey = process.env.SECRET_KEY;
  if (!token) {
    return res.status(404).json({ error: "Not Found", message: "Token not found" });
  }
  try {
    const verify = import_jsonwebtoken.default.verify(token, secretKey);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
  }
};
var decodeToken = (token) => {
  try {
    const decode = import_jsonwebtoken.default.decode(token);
    return decode;
  } catch (error) {
    return null;
  }
};
var generateToken = (id, exp) => {
  const secretKey = process.env.SECRET_KEY;
  try {
    const token = import_jsonwebtoken.default.sign({ userId: id }, secretKey, {
      expiresIn: exp ? exp : "1h"
    });
    return token;
  } catch (error) {
    return null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authorization,
  decodeToken,
  generateToken
});
