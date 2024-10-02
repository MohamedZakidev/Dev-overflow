import { z } from "zod";

export const QuestionsSchema = z.object({
    title: z.string().min(5, { message: "The question title must be at least 5 characters" }).max(130),
    explanation: z.string().min(20, { message: "your explanation must be at least 20 characters" }),
    tags: z.array(z.string().min(1, { message: "Add at least one tag to your question" }).max(15)).min(1).max(3)
})