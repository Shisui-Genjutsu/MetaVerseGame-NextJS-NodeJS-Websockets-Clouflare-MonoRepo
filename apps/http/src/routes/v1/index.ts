import { Router } from "express";
import { SignupSchema, SigninSchema } from "../../types/index.js";
import { client } from '@repo/db/client';
import jwt from "jsonwebtoken";
import { hash, compare } from '../../scrypt.js';
import { JWT_PASSWORD } from "../../config.js";

export const router = Router();

router.post("/sign-up", async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" })
        return;
    }

    const hashedPassword = await hash(parsedData.data.password)

    try {
        await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User"
            }
        })
        res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.error("sign-up failed", error);
        res.status(500).json({ message: "Internal server error" })
    }
});

router.post("/sign-in", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body)

    if (!parsedData.success) {
        res.status(403).json({ message: "Validation failed" })
        return;
    }


    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })

        if (!user) {
            res.status(404).json({ message: "User not found" })
            return;
        }

        const isValid = await compare(parsedData.data.password, user.password)

        if (!isValid) {
            res.status(401).json({ message: "Invalid credentials" })
            return;
        }

        const token = jwt.sign({
            userId: user?.id,
            role: user?.role
        }, JWT_PASSWORD)

        res.status(200).json({ token, message: "User signed in successfully" })
    } catch (error) {
        console.error("sign-in failed", error);
        res.status(500).json({ message: "Internal server error" })
    }
});