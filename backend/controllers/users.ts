import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { checkHeader } from "../middlewares/verifyToken";

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

    if (!user) {
      return res.status(404).json({
        message: "User not found in database",
      });
    }

    res.status(200).json({
      data: user,
    });
    console.log(user);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, img, phone, desc, country, isClient } = req.body;

  const userIdFromToken = req.user?.id.id;
  
  if (!userIdFromToken) {
    return res.status(401).json({
      error: "Authentication requried",
    });
  }

  // Ensure the user can only update their own info
  if (Number(id) !== Number(userIdFromToken)) {
    return res.status(403).json({
      error: "You are not authorized to update this user",
    });
  }

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
        role,
        img,
        phone,
        desc,
        country,
        isClient,
      },
    });
    res.status(200).json({
      message: "Updated successfully",
      data: user,
    });
    // console.log(user);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error,
    });
  }
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
      });
    }

    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Deleted successfully",
      data: user,
    });
    console.log(user);
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error,
    });
  }
};
