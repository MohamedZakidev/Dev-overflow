"use server"
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.type";

const searchableTypes = ["question", "answer", "user", "tag"]

interface resultsType {
    id: string,
    type: string,
    title: string
}

export async function globalSearch(params: SearchParams) {
    try {
        await connectToDatabase()
        const { query, type } = params
        const regexQuery = { $regex: query, $options: "i" }

        let results: resultsType[] = []

        const modelsAndTypes = [
            { model: Question, searchField: "title", type: "question" },
            { model: Answer, searchField: "content", type: "answer" },
            { model: User, searchField: "name", type: "user" },
            { model: Tag, searchField: "name", type: "tag" }
        ]

        // we start here the tough part
        if (!type || !searchableTypes.includes(type)) {
            // Search across everything using the query
            for (const { model, searchField, type } of modelsAndTypes) {
                const queryResults = await model
                    .find({ [searchField]: regexQuery })
                    .limit(2)

                results.push(
                    ...queryResults.map(item => ({
                        title: type === "answer" ?
                            `Answers containing ${query}` :
                            item[searchField],
                        id: type === "user" ?
                            item.clerkId :
                            type === "answer" ?
                                item.question :
                                item._id, // for questions and tags
                        type
                    }))
                )
            }
        } else {
            // search by the query and specific type

            // 1. we find which model got chose by the user
            const modelInfo = modelsAndTypes.find(item => item.type === type)
            if (!modelInfo) {
                throw new Error("Invalid search type")
            }

            const queryResults = await modelInfo.model
                .find({ [modelInfo.searchField]: regexQuery })
                .limit(8)

            results = queryResults.map(item => ({
                title: type === "answer" ?
                    `Answers containing ${query}` :
                    item[modelInfo.searchField],
                id: type === "user" ?
                    item.clerkId :
                    type === "answer" ?
                        item.question :
                        item._id, // for questions and tags
                type
            }))
        }
        return JSON.stringify(results)
    } catch (error) {
        console.log(`Error fetching global results, ${error}`)
        throw error
    }
}
