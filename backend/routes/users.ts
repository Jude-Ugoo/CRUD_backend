import { Router } from "express";
import { getUser, getUsers, updateUser } from "../controllers/users";

const userRoutes = Router();

userRoutes.get("/users", getUsers);
userRoutes.get("/user/:id", getUser)
userRoutes.put("/user/:id", updateUser)

export default userRoutes;
