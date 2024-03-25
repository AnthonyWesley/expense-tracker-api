import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  const secretKey = process.env.SECRET_KEY as string;

  if (!token) {
    return res
      .status(404)
      .json({ error: "Not Found", message: "Token not found" });
  }

  try {
    const verify = jwt.verify(token, secretKey);

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid token" });
  }
};

export const decodeToken = (token: string) => {
  try {
    const decode = jwt.decode(token);

    return decode;
  } catch (error) {
    return null;
  }
};

export const generateToken = (id: string, exp?: string | number) => {
  const secretKey = process.env.SECRET_KEY as string;

  try {
    const token = jwt.sign({ userId: id }, secretKey, {
      expiresIn: exp ? exp : "1h",
    });

    return token;
  } catch (error) {
    return null;
  }
};
