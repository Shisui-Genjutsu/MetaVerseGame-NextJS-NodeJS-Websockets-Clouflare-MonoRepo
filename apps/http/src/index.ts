import express from "express";
import { router } from "./routes/v1/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/v1", router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});