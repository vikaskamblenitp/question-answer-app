export interface IDocument {
    id: string;
    name: string;
    uploaded_by: string;
    is_processed: boolean;
    created_at: Date;
    updated_at: Date;
}