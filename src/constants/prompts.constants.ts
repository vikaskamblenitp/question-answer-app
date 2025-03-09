export const PROMPTS = {
    QAPROMPT: (context: string, question: string) => `
    Context Information:
    ${context}
    
    Question: ${question}
    
    Instructions:
    - If relevant information is present in the context, provide a precise and concise answer based strictly on the given context.
    - If NO relevant information is found in the context, respond ONLY with: "Sorry, I am not able to answer this question."
    - Do NOT generate an answer from your own knowledge if the context doesn't contain relevant information.
    `
}