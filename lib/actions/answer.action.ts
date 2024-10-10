"use server"

import Answer from "@/database/answer.model"
import Question from "@/database/question.model"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import { CreateAnswerParams } from "./shared.type"


export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase()

        const { content, author, question, path } = params
        const answer = await Answer.create({
            content, author, question
        })
        console.log({ answer })
        await Question.findByIdAndUpdate(question, {
            $push: { answers: answer._id }
        })

        revalidatePath(path)
        // return answer
    } catch (error) {
        console.log(error)
        throw error
    }
}