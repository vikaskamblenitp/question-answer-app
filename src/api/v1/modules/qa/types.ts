export interface IQuestionAnswer {
    id: string;
    file_id: string;
    question: string;
    embeddings?: string;
    answer?: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}