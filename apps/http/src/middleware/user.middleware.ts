import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";

export const userMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers?.authorization;
    const token = header?.split(" ")?.[1] as string;

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { role: string, userId: string };
        req.userId = decoded.userId;
        req.role = decoded.role as "Admin" | "User";
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
}