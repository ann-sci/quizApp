import { Router } from "express";
import {
    createQuiz,
    deleteQuiz,
    getQuiz,
    getQuizzes,
    updateQuiz,
} from "./controllers.ts";
const router = Router();

router.get("/", getQuizzes);
router.get("/:id", getQuiz);
router.post("/", createQuiz);
router.patch("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;
