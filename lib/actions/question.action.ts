"use server"

import Answer from "@/database/answer.model"
import Interaction from "@/database/interaction.model"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import { FilterQuery } from "mongoose"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongoose"
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams, RecommendedParams } from "./shared.type"


export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        connectToDatabase()

        const { questionId } = params

        const question = await Question.findById(questionId)
            .populate({ path: "tags", model: Tag, select: "_id name" })
            .populate({ path: "author", model: User, select: "_id clerkId name picture" })

        return question

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase()

        const { searchQuery, filter, page = 1, pageSize = 10 } = params
        // for pagination
        const skipAmount = (page - 1) * pageSize

        const query: FilterQuery<typeof Question> = {}

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } }
            ]
        }

        let sortOptions = {}
        switch (filter) {
            case "newest":
                sortOptions = { createdAt: - 1 }
                break;
            case "frequent":
                sortOptions = { views: - 1 }
                break;
            case "unanswered":
                query.answers = { $size: 0 }
                break;
            default:
                break;
        }

        const questions = await Question.find(query)
            .populate({ path: "tags", model: Tag })
            .populate({ path: "author", model: User })
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions)

        const totalQuestions = await Question.countDocuments(query)
        const isNext = totalQuestions > skipAmount + questions.length

        return { questions, isNext }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase()
        const { title, content, tags, author, path } = params

        const question = await Question.create({
            title,
            content,
            author
        })

        const tagDocuments = []

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                // should it be questions instead of question, yes it should
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
                // create a tag document in the tags collection
                { upsert: true, new: true }
            )
            tagDocuments.push(existingTag._id)
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } }
        })

        await Interaction.create({
            user: author,
            question: question._id,
            action: "ask-question",
            tags: tagDocuments,
        })
        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } })

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase()
        const { questionId, userId, hasUpvoted, hasDownvoted, path } = params

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
        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

        if (!question) {
            throw new Error("Question not found")
        }

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasUpvoted ? -1 : 1 }
        })

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasUpvoted ? -10 : 10 }
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase()
        const { questionId, userId, hasUpvoted, hasDownvoted, path } = params

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
        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

        if (!question) {
            throw new Error("Question not found")
        }

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasDownvoted ? -1 : 1 }
        })

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasDownvoted ? -10 : 10 }
        })
        revalidatePath(path)
        // Todo: increment user reputation by 10 for upvoting a question
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase()
        const { questionId, path } = params

        await Question.deleteOne({ _id: questionId })
        await Answer.deleteMany({ question: questionId })
        await Interaction.deleteMany({ question: questionId })
        await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } })
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function editQuestion(params: EditQuestionParams) {
    try {
        connectToDatabase()
        const { questionId, title, content, path } = params

        const question = await Question.findById(questionId)

        question.title = title
        question.content = content

        await question.save()

        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getTopQuestions() {
    try {
        connectToDatabase()
        const topQuestions = await Question.find({})
            .sort({ views: -1, upvotes: -1 })
            .limit(5)
        return topQuestions
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
    try {
        await connectToDatabase();

        const { userId, page = 1, pageSize = 10, searchQuery } = params;

        // find user
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error("user not found");
        }

        const skipAmount = (page - 1) * pageSize;

        // Find the user's interactions
        const userInteractions = await Interaction.find({ user: user._id })
            .populate("tags")
            .exec();

        // Extract tags from user's interactions
        const userTags = userInteractions.reduce((tags, interaction) => {
            if (interaction.tags) {
                tags = tags.concat(interaction.tags);
            }
            return tags;
        }, []);

        // Get distinct tag IDs from user's interactions
        const distinctUserTagIds = [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...new Set(userTags.map((tag: any) => tag._id)),
        ];

        const query: FilterQuery<typeof Question> = {
            $and: [
                { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
                { author: { $ne: user._id } }, // Exclude user's own questions
            ],
        };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }

        const totalQuestions = await Question.countDocuments(query);

        const recommendedQuestions = await Question.find(query)
            .populate({
                path: "tags",
                model: Tag,
            })
            .populate({
                path: "author",
                model: User,
            })
            .skip(skipAmount)
            .limit(pageSize);

        const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

        return { questions: recommendedQuestions, isNext };
    } catch (error) {
        console.error("Error getting recommended questions:", error);
        throw error;
    }
}