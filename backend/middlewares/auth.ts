import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import Jwt from "jsonwebtoken";

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

  const token = authToken && authToken.split(" ")[1];

  try {
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return res.status(401).json({
          message: "Authentication required",
        });
      } else {
        console.log(decodedToken);
        req.user.id = decodedToken;
        next();
      }
    });
  } catch (error) {
    return res.status(403).send("Invalid token");
  }
};
