import express from "express";
import cors from "cors";
import quizRoutes from "./src/features/quizzes/routes.ts";

const port = 8080;
const host = "http://localhost";

const app = express();

app.use(express.json());
app.use("/quizzes", quizRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
});
