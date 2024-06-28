import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/users";
import { checkHeader } from "../middlewares/verifyToken";

const userRoutes = Router();

userRoutes.get("/users", getUsers);
userRoutes.get("/user/:id", getUser)
userRoutes.put("/user/:id", checkHeader, updateUser)
userRoutes.delete("/user/:id", checkHeader, deleteUser)

export default userRoutes;
