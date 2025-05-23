"use server"
import Answer from "@/database/answer.model"
import Interaction from "@/database/interaction.model"
import Question from "@/database/question.model"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.type"


export async function getAnswers(params: GetAnswersParams) {
    try {
        connectToDatabase()
        const { questionId, page = 1, pageSize = 10, sortBy } = params

        const skipAmount = (page - 1) * pageSize

        let sortOptions = {}
        switch (sortBy) {
            case "highest_upvotes":
                sortOptions = { upvotes: -1 }
                break;
            case "lowest_upvotes":
                sortOptions = { upvotes: 1 }
                break;
            case "recent":
                sortOptions = { createdAt: -1 }
                break;
            case "old":
                sortOptions = { createdAt: 1 }
                break;
            default:
                break;
        }

        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id clerkId name picture")
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalAnswers = await Answer.countDocuments({ question: questionId })
        const isNext = totalAnswers > skipAmount + answers.length

        return { answers, isNext }

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

        const questionObj = await Question.findByIdAndUpdate(question, {
            $push: { answers: answer._id }
        })

        await Interaction.create({
            user: author,
            question,
            action: "answer",
            answers: answer._id,
            tags: questionObj.tags
        })
        await User.findByIdAndUpdate(author,
            { $inc: { reputation: 10 } }
        )
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
        // Todo: increment user reputation by 10 for upvoting a Answer
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasUpvoted ? -2 : 2 }
        })

        if (JSON.stringify(answer.author) !== JSON.stringify(userId)) {
            await User.findByIdAndUpdate(answer.author, {
                $inc: { reputation: hasUpvoted ? -10 : 10 }
            })
        }

        revalidatePath(path)
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

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasDownvoted ? -2 : 2 }
        })

        await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: hasDownvoted ? -10 : 10 }
        })
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        connectToDatabase()
        const { answerId, path } = params

        const answer = await Answer.findById({ _id: answerId })
        if (!answer) {
            throw new Error("Answer not found")
        }

        await Answer.deleteOne({ _id: answerId })
        // why using many if there is only one unique answer for each question ?
        await Question.updateMany({ _id: answer.question }, {
            $pull: {
                answers: answerId
            }
        })
        // await Interaction.deleteMany({answer: answerId})

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}