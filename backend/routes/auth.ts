import { Router } from "express";
import { login, logout, register } from "../controllers/auth";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
