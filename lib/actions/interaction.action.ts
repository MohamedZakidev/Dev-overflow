"use server"
import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.type";

export async function viewQuestion(params: ViewQuestionParams) {
    try {
        await connectToDatabase();

        const { questionId, userId } = params;

        // Update view count for the question
        await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

        if (userId) {
            const existingInteraction = await Interaction.findOne({
                user: userId,
                action: "view",
                question: questionId,
            })

            if (existingInteraction) return console.log('User has already viewed.')

            // Create interaction
            await Interaction.create({
                user: userId,
                action: "view",
                question: questionId,
            })
        }
        // revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}