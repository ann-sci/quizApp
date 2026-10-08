export interface RequestQuizParams {
    id: string;
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
}

export type CreateQuizRequestBody = Omit<Quiz, "id">;
