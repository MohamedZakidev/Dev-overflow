"use server"
import Answer from "@/database/answer.model"
import Question from "@/database/question.model"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.type"


export async function getAnswers(params: GetAnswersParams) {
    try {
        connectToDatabase()
        const { questionId } = params
        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id clerkId name picture")
            .sort({ createdAt: -1 })
        return { answers }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase()

        const { content, author, question, path } = params
        const answer = await Answer.create({
            content, author, question
        })

        await Question.findByIdAndUpdate(question, {
            $push: { answers: answer._id }
        })
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase()
        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params

        let updateQuery = {}
        if (hasUpvoted) {
            updateQuery = { $pull: { upvotes: userId } }
        } else if (hasDownvoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
        }
        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if (!answer) {
            throw new Error("Answer not found")
        }
        revalidatePath(path)
        // Todo: increment user reputation by 10 for upvoting a Answer
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase()
        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params

        let updateQuery = {}
        if (hasDownvoted) {
            updateQuery = { $pull: { downvotes: userId } }
        } else if (hasUpvoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $push: { downvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { downvotes: userId } }
        }
        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if (!answer) {
            throw new Error("Answer not found")
        }
        revalidatePath(path)
        // Todo: increment user reputation by 10 for upvoting a question
    } catch (error) {
        console.log(error)
        throw error
    }
}