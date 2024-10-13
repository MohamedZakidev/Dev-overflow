"use server"

import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.type";

export async function viewQuestion(params: ViewQuestionParams) {
    try {
        connectToDatabase()
        const { userId, questionId } = params

        // update view count for the question we view
        await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })

        if (userId) {
            // we check if the user has already viewed that question
            const existingInteraction = await Interaction.findOne({
                user: userId,
                question: questionId,
                action: "view",
            })

            if (existingInteraction) return console.log("User has already viewed that question")

            // if there is no existing interaction we create one!

            await Interaction.create({
                user: userId,
                question: questionId,
                action: "view"
            })
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}