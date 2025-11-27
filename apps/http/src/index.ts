import express from "express";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes/v1/index.js";
import { swaggerSpec } from "./swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", router);

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal server error" });
});

app.get("/", (req: express.Request, res: express.Response) => {
    res.send(`${process.env.SERVER_URL}/docs`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});