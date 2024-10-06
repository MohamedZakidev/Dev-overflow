"use server"

import Question from "@/database/question.model"
import User from "@/database/user.model"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from "./shared.type"

export async function getUserById(params: GetUserByIdParams) {
    try {
        connectToDatabase()
        const { userId } = params
        console.log(userId)
        const user = await User.findOne({ clerkId: userId })
        return user

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase()

        const newUser = await User.create(userData)
        return newUser

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase()
        const { clerkId, updatedData, path } = params
        await User.findOneAndUpdate({ clerkId }, updatedData, { new: true })
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

        // Let's delete user questions for now
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const userQuestionsIds = await Question.find({ author: deletedUser._id }).distinct("_id")

        await Question.deleteMany({ author: deletedUser._id })

        // const deletedUser = await User.findByIdAndDelete(user._id)

        // Todo: delete user answers, comments and more
        return deletedUser
    } catch (error) {
        console.log(error)
        throw error
    }
}