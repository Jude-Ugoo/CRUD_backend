import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { User, UserRole } from "@prisma/client";
import * as argon2 from "argon2";
import Jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role }: User = req.body;

  if (!email || !password)
    return res.status(400).send("Email and password are required");

  try {
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const passwordStr = String(password);

    const hashedPassword = await argon2.hash(passwordStr);
    console.log(hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      message: "User successfully created",
      data: { name, email, role },
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      err,
    });
    console.log(err);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Email and password are required");

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    //* Check if password is correct
    const passwordStr = String(password);
    const isPasswordValid = await argon2.verify(user.password, passwordStr);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    //* Generate cookie token and send to the user
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = Jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: age,
      }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    res.status(500).json({
      message: "Failed to login",
      error: err,
    });
    console.log(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to logout",
      error,
    });
  }
};
