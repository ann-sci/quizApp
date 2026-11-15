import {
    test,
    describe,
    type TestContext,
    mock,
    before,
    after,
} from "node:test";
import assert from "node:assert/strict";
import type { Quiz } from "./types.ts";
import {
    createQuiz,
    deleteQuiz,
    getQuiz,
    getQuizzes,
    updateQuiz,
} from "./controllers.ts";
import { runController } from "../../../testing/utils.ts";

const quiz: Quiz = { id: 1, title: "Example", description: "An example Quiz" };

describe("quizzes/controllers", () => {
    before(() => {
        mock.method(console, "error", () => {});
    });

    after(() => {
        mock.restoreAll();
    });

    describe("getQuizzes", () => {
        const runGetQuizzes = (
            testContext: TestContext,
            result: { rows: Quiz[]; rowCount?: number } | Error,
        ) =>
            runController({
                testContext,
                controller: getQuizzes,
                requestParams: {},
                result,
            });

        test("returns all quizzes", async (t) => {
            const quizzes = [quiz];
            const response = await runGetQuizzes(t, { rows: quizzes });

            assert.equal(response.statusCode, 200);
            assert.deepEqual(response.body, quizzes);
        });

        test("returns the error 500 when the database query fails", async (t) => {
            const response = await runGetQuizzes(t, new Error());

            assert.equal(response.statusCode, 500);
            assert.deepEqual(response.body, {
                error: "Failed to fetch quizzes",
            });
        });
    });

    describe("getQuiz", () => {
        const runGetQuiz = (
            testContext: TestContext,
            requestParams: { id: string },
            result: { rows: Quiz[]; rowCount?: number } | Error,
        ) =>
            runController({
                testContext,
                controller: getQuiz,
                result,
                requestParams,
            });

        test("returns the quiz with the requested id", async (t) => {
            const response = await runGetQuiz(t, { id: "1" }, { rows: [quiz] });

            assert.equal(response.statusCode, 200);
            assert.deepEqual(response.body, quiz);
        });

        test("returns 404 when the quiz does not exist", async (t) => {
            const response = await runGetQuiz(
                t,
                { id: "1" },
                { rows: [], rowCount: 0 },
            );

            assert.equal(response.statusCode, 404);
            assert.deepEqual(response.body, { error: "Quiz not found" });
        });

        test("returns the error 500 when the database query fails", async (t) => {
            const response = await runGetQuiz(t, { id: "1" }, new Error());

            assert.equal(response.statusCode, 500);
            assert.deepEqual(response.body, { error: "Failed to fetch quiz" });
        });
    });

    describe("createQuiz", () => {
        const runCreateQuiz = (
            testContext: TestContext,
            result: { rows: Quiz[]; rowCount?: number } | Error,
        ) =>
            runController({
                testContext,
                controller: createQuiz,
                requestParams: {},
                requestBody: {
                    title: quiz.title,
                    description: quiz.description,
                },
                result,
            });

        test("creates a quiz and returns the created quiz", async (t) => {
            const response = await runCreateQuiz(t, { rows: [quiz] });

            assert.equal(response.statusCode, 201);
            assert.deepEqual(response.body, quiz);
        });

        test("returns the error 500 when the database query fails", async (t) => {
            const response = await runCreateQuiz(
                t,
                new Error("Request failed"),
            );

            assert.equal(response.statusCode, 500);
            assert.deepEqual(response.body, { error: "Failed to create quiz" });
        });
    });

    describe("updateQuiz", () => {
        const updatedQuiz = { ...quiz, title: "Updated Title" };

        const runUpdateQuiz = (
            testContext: TestContext,
            result: { rows: Quiz[]; rowCount?: number } | Error,
        ) =>
            runController({
                testContext,
                controller: updateQuiz,
                requestParams: { id: "1" },
                result,
                requestBody: {
                    title: updatedQuiz.title,
                    description: updatedQuiz.description,
                },
            });

        test("updates a quiz and returns it", async (t) => {
            const response = await runUpdateQuiz(t, { rows: [updatedQuiz] });

            assert.equal(response.statusCode, 200);
            assert.deepEqual(response.body, updatedQuiz);
        });

        test("returns error 404 when the quiz doesn't exist", async (t) => {
            const response = await runUpdateQuiz(t, { rows: [], rowCount: 0 });

            assert.equal(response.statusCode, 404);
            assert.deepEqual(response.body, { error: "Quiz not found" });
        });

        test("returns the error 500 when the database query fails", async (t) => {
            const response = await runUpdateQuiz(
                t,
                new Error("Request failed"),
            );

            assert.equal(response.statusCode, 500);
            assert.deepEqual(response.body, { error: "Failed to update quiz" });
        });
    });

    describe("deleteQuiz", () => {
        const runDeleteQuiz = (
            testContext: TestContext,
            result: { rows: Quiz[]; rowCount?: number } | Error,
        ) =>
            runController({
                testContext,
                controller: deleteQuiz,
                requestParams: { id: "1" },
                result,
            });

        test("deletes a quiz and returns it", async (t) => {
            const response = await runDeleteQuiz(t, { rows: [quiz] });

            assert.equal(response.statusCode, 200);
            assert.deepEqual(response.body, quiz);
        });

        test("returns error 404 when the quiz doesn't exist", async (t) => {
            const response = await runDeleteQuiz(t, { rows: [], rowCount: 0 });

            assert.equal(response.statusCode, 404);
            assert.deepEqual(response.body, { error: "Quiz not found" });
        });

        test("returns the error 500 when the database query fails", async (t) => {
            const response = await runDeleteQuiz(
                t,
                new Error("Request failed"),
            );

            assert.equal(response.statusCode, 500);
            assert.deepEqual(response.body, { error: "Failed to delete quiz" });
        });
    });
});
