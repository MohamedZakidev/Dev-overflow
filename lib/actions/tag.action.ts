import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.type"

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
        const tags = await Tag.find({})
        return { tags }
    } catch (error) {
        console.log(error)
        throw error
    }
}