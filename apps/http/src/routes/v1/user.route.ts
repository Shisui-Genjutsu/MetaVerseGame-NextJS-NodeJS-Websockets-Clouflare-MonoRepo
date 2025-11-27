import { Router } from "express";
import { userMiddleWare } from "../../middleware/user.middleware.js";
import { UpdateMetadataSchema } from "../../types/index.js";
import { client } from "@repo/db/client";

const userRouter = Router();

userRouter.post("/metadata", userMiddleWare, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({ message: "Validation failed" })
        return;
    }

    try {
        await client.user.update({
            where: {
                id: req.userId as string
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        })

        res.json({ message: "Metadata updated" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        return;
    }
})

userRouter.get("/metadata/bulk", userMiddleWare, async (req, res) => {
    const userIdStrings = (req.query.ids ?? "[]") as string;
    const userIds = JSON.parse(decodeURIComponent(userIdStrings)) as string[];
    if (userIds.length === 0) {
        res.status(400).json({ message: "No user ids provided" })
        return;
    }

    try {
        const metadata = await client.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            }, select: {
                avatar: true,
                id: true
            }
        })

        res.json({
            avatars: metadata.map((m) => ({
                userId: m.id,
                avatarId: m.avatar?.imageUrl
            }))
        })
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
        return;
    }
})