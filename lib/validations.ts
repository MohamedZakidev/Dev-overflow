import { z } from "zod";

export const QuestionsSchema = z.object({
    title: z.string().min(5, { message: "The question title must be at least 5 characters" }).max(130),
    explanation: z.string().min(20, { message: "your explanation must be at least 20 characters" }),
    tags: z.array(
        z.string()
            .min(1, { message: "Each tag must have at least 1 character" })
            .max(15, { message: "Each tag must not exceed 15 characters" })
    )
        .min(1, { message: "Add at least one tag to your question" })
        .max(3, { message: "You can only add up to 3 tags" }),
})

export const AnswerSchema = z.object({
    answer: z.string().min(50)
})