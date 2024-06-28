import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";


export const checkHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authToken.split(" ")[1];

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decodedToken) => {
      if (err) {
        console.log("Token verification error:", err.message);
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      if (typeof decodedToken === "object" && "id" in decodedToken) {
        req.user = { id: decodedToken }
        next();
      } else {
        return res.status(401).json({
          message: "Invalid token payload",
        });
      }

      // console.log("User Request:", req.user);
    });
  } catch (error) {
    return res.status(403).send("Invalid token");
  }
};
