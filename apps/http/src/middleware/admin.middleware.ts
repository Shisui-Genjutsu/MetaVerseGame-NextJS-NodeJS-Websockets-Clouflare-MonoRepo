import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";

export const adminMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers?.authorization;
    const token = header?.split(" ")?.[1] as string;

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { role: string, userId: string };
        if (decoded.role !== "Admin") {
            res.status(403).json({ message: "Unauthorized" })
            return
        }
        req.userId = decoded.userId;
        req.role = decoded.role as "Admin" | "User";
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
}