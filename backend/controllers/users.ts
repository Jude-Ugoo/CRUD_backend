import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { User } from "@prisma/client";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      data: user,
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role }: User = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingUser) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        password,
        role,
      },
    });
    res.status(200).json({
      message: "Updated successfully",
      data: user,
    });
    console.log(user);
  } catch (error) {}
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingUser) {
      return res.status(401).json({
        error: "User not found",
      })
    }
  } catch (error) {}
};