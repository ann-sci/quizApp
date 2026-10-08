import type { Response } from "express";

export type APIResponse<Data> = Response<Data | { error: string }>;
