import type { Request, Response } from "express";
import { pool } from "../db.js";
import type { TestContext } from "node:test";

export function createMockRequest<Params>(
    params: Params,
    body: unknown,
): Request<Params> {
    return { params, body } as Request<Params>;
}

type MockResponse = Response & {
    body: unknown;
    statusCode: number;
    status(code: number): MockResponse;
    json(body: unknown): MockResponse;
};

export function createMockResponse(): MockResponse {
    return {
        statusCode: 0,
        body: undefined,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(body: unknown) {
            this.body = body;
            return this;
        },
    } as MockResponse;
}

interface RunControllerProps<ReqParams extends Request["params"]> {
    testContext: TestContext;
    requestParams: ReqParams;
    requestBody?: unknown;
    controller: (
        req: Request<ReqParams>,
        res: Response,
    ) => Promise<Response | undefined>;
    result: { rows: unknown[]; rowCount?: number } | Error;
}

export const runController = async <ReqParams extends Request["params"]>({
    testContext,
    controller,
    requestParams,
    requestBody,
    result,
}: RunControllerProps<ReqParams>): Promise<MockResponse> => {
    testContext.mock.method(pool, "query", () => {
        if (result instanceof Error) throw result;
        return result;
    });
    const request = createMockRequest(requestParams, requestBody);
    const response = createMockResponse();

    await controller(request, response);

    return response;
};
