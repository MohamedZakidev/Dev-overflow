/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
"use server"
import Answer from "@/database/answer.model"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import { FilterQuery } from "mongoose"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.type"


export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase()
        const { searchQuery } = params

        const query: FilterQuery<typeof User> = {}

        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } }
            ]
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
        return { users }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserById(params: GetUserByIdParams) {
    try {
        connectToDatabase()

        const { userId } = params
        const user = await User.findOne({ clerkId: userId })
        return user

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase();

        const newUser = await User.create(userData)
        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase()
        const { clerkId, updateData, path } = params
        await User.findOneAndUpdate({ clerkId }, updateData, { new: true })
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDatabase()
        const { clerkId } = params
        // Delete user from database 
        const deletedUser = await User.findOneAndDelete({ clerkId })
        if (!deletedUser) {
            throw new Error("User not found")
        }

        // const userQuestionsIds = await Question.find({ author: deletedUser._id }).distinct("_id")

        // Let's delete user questions for now
        await Question.deleteMany({ author: deletedUser._id })

        // const deletedUser = await User.findByIdAndDelete(user._id)

        // Todo: delete user answers, comments and more
        return deletedUser
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDatabase()

        const { userId, questionId, path } = params
        // get user collection and push questionId in user saved field
        const user = await User.findById(userId)
        if (!user) {
            return new Error("User not found")
        }

        const isQuestionSaved = user.saved.includes(questionId)
        if (isQuestionSaved) {
            // remove question from saved list
            await User.findByIdAndUpdate(userId, {
                $pull: { saved: questionId }
            }, { new: true })
        } else {
            // add question to saved
            await User.findByIdAndUpdate(userId, {
                $addToSet: { saved: questionId }
            }, { new: true })
        }
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }

}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        connectToDatabase();

        const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

        const query: FilterQuery<typeof Question> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, 'i') } }
            : {};

        const user = await User.findOne({ clerkId }).populate({
            path: 'saved',
            match: query,
            options: {
                sort: { createdAt: -1 },
            },
            populate: [
                { path: 'tags', model: Tag, select: "_id name" },
                { path: 'author', model: User, select: '_id clerkId name picture' }
            ]
        })

        if (!user) {
            throw new Error('User not found');
        }

        const savedQuestions = user.saved;

        return { questions: savedQuestions };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        connectToDatabase()
        const { userId } = params

        const user = await User.findOne({ clerkId: userId })

        if (!user) {
            throw new Error("User not found")
        }

        const totalQuestions = await Question.countDocuments({ author: user._id })
        const totalAnswers = await Answer.countDocuments({ author: user._id })

        return { user, totalQuestions, totalAnswers }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        connectToDatabase()
        const { userId, page = 1, pageSize = 10 } = params

        const totalQuestions = await Question.countDocuments({ author: userId })

        const userQuestions = await Question.find({ author: userId })
            .sort({ view: -1, upvotes: -1 })
            .populate("tags", "_id name")
            .populate("author", "_id clerkId name picture")

        return { questions: userQuestions, totalQuestions }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase()
        const { userId, page = 1, pageSize = 10 } = params

        const totalAnswers = await Answer.countDocuments({ author: userId })

        const userAnswers = await Answer.find({ author: userId })
            .sort({ upvotes: -1 })
            .populate("question", "_id title")
            .populate("author", "_id clerkId name picture")

        return { answers: userAnswers, totalAnswers }

    } catch (error) {
        console.log(error)
        throw error
    }
}