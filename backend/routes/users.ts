import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/users";

const userRoutes = Router();

userRoutes.get("/users", getUsers);
userRoutes.get("/user/:id", getUser)
userRoutes.put("/user/:id", updateUser)
userRoutes.delete("/user/:id", deleteUser)

export default userRoutes;
