import Question from "@/database/question.model"
import Tag, { ITag } from "@/database/tag.model"
import User from "@/database/user.model"
import { FilterQuery } from "mongoose"
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.type"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase()
        const { userId } = params

        const user = await User.findById(userId)
        if (!user) throw new Error("user not found")

        // Find interactions for the user and group by tags...
        // user interactions
        return ["tag1", "tag2", "tag3"]

    } catch (error) {
        console.log(error)
        throw error
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAllTags(params: GetAllTagsParams) {
    try {
        connectToDatabase()
        const { searchQuery } = params

        const query: FilterQuery<typeof Tag> = {}

        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } }
            ]
        }

        const tags = await Tag.find(query)
        return { tags }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        connectToDatabase()

        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const { tagId, page = 1, pageSize = 10, searchQuery } = params

        const tagFilter: FilterQuery<ITag> = { _id: tagId }

        const tag = await Tag.findOne(tagFilter).populate({
            path: 'questions',
            model: Question,
            match: searchQuery ? { title: { $regex: searchQuery, $options: "i" } } : {},
            options: {
                sort: { createdAt: -1 },
            },
            populate: [
                { path: 'tags', model: Tag, select: "_id name" },
                { path: 'author', model: User, select: '_id clerkId name picture' }
            ]
        })

        if (!tag) {
            throw new Error('Tag not found');
        }

        const questions = tag.questions;

        return { tagTitle: tag.name, questions }

    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function getPopularTags() {
    try {
        connectToDatabase()
        const popularTags = await Tag.aggregate([
            { $project: { name: 1, numberofQuestions: { $size: "$questions" } } },
            { $sort: { numberofQuestions: -1 } },
            { $limit: 5 }
        ])
        return popularTags

    } catch (error) {
        console.log(error)
        throw error
    }
}