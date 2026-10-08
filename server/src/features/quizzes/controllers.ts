import type { Request, Response } from "express";
import { pool } from "../../../db.js";
import type {
    CreateQuizRequestBody,
    Quiz,
    RequestQuizParams,
} from "./types.ts";
import type { APIResponse } from "../../types.ts";

export async function getQuizzes(_req: Request, res: APIResponse<Quiz[]>) {
    const query = `SELECT * FROM quizzes`;

    try {
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Failed to fetch quizzes", error);
        return res.status(500).json({ error: "Failed to fetch quizzes" });
    }
}

export async function getQuiz(
    req: Request<RequestQuizParams>,
    res: APIResponse<Quiz>,
) {
    const query = `SELECT * FROM quizzes WHERE id = $1`;
    const values = [Number(req.params.id)];

    try {
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Quiz not found",
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Failed to fetch quiz", error);
        return res.status(500).json({ error: "Failed to fetch quiz" });
    }
}

export async function createQuiz(
    req: Request<{}, any, CreateQuizRequestBody>,
    res: APIResponse<Quiz>,
) {
    const query = `INSERT INTO quizzes (title, description) VALUES ($1, $2) RETURNING *`;
    const { title, description } = req.body;
    const values = [title, description];

    try {
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Failed to create quiz", error);
        return res.status(500).json({ error: "Failed to create quiz" });
    }
}

export async function updateQuiz(
    req: Request<RequestQuizParams, any, CreateQuizRequestBody>,
    res: APIResponse<Quiz>,
) {
    const query = `
        UPDATE quizzes
        SET title = $1, description = $2
        WHERE ID = $3
        RETURNING *
    `;
    const { title, description } = req.body;
    const values = [title, description, Number(req.params.id)];

    try {
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Quiz not found",
            });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Failed to update quiz", error);
        return res.status(500).json({ error: "Failed to update quiz" });
    }
}

export async function deleteQuiz(
    req: Request<RequestQuizParams>,
    res: APIResponse<Quiz>,
) {
    const query = `DELETE FROM quizzes WHERE id = $1 RETURNING *`;
    const values = [Number(req.params.id)];
    try {
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Quiz not found",
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Failed to delete quiz", error);
        return res.status(500).json({ error: "Failed to delete quiz" });
    }
}
