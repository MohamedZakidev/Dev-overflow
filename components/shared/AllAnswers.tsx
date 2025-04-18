import { AnswerFilters } from "@/constants/filters"
import { getAnswers } from "@/lib/actions/answer.action"
import { getTimestamp } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import Filter from "./Filter"
import Pagination from "./Pagination"
import ParseHTML from "./ParseHTML"
import Votes from "./Votes"

interface Props {
    questionId: string
    userId: string
    totalAnswers: number
    page?: string
    filter?: string
}


async function AllAnswers({ questionId, userId, totalAnswers, page, filter }: Props) {
    const result = await getAnswers({
        questionId,
        page: page ? +page : 1,
        sortBy: filter
    })

    return (
        <div className="light-border my-11 border-b pb-11">
            <div className="flex items-center justify-between">
                <h3 className="primary-text-gradient">
                    {totalAnswers === 0 ? `No Answers yet` :
                        totalAnswers === 1 ? `${totalAnswers} Answer` :
                            `${totalAnswers} Answers`
                    }
                </h3>
                <Filter
                    filters={AnswerFilters}
                    otherclasses={"min-h-[56px] sm:min-w-[170px]"}
                />
            </div>

            <div>
                {result.answers.length > 0 &&
                    result.answers.map((answer) => (
                        <article
                            key={answer._id}

                            className="mt-6"
                        >
                            <div className="flex items-center justify-between">

                                <div className="mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                                    <Link
                                        href={`/profile/${answer.author.clerkId}`}
                                        className="flex items-start gap-1 sm:items-center"
                                    >
                                        <Image
                                            src={answer.author.picture}
                                            width={18}
                                            height={18}
                                            alt="profile picture to the author of the answer"
                                            className="rounded-full object-cover max-sm:mt-0.5"
                                        />
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                                            <p className="body-semibold text-dark300_light700">{answer.author.name}</p>
                                            <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                                                <span className="max-sm:hidden">
                                                    •{" "}
                                                </span>
                                                answered {" "}
                                                {getTimestamp(answer.createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex justify-end">
                                        <Votes
                                            type="Answer"
                                            itemId={JSON.stringify(answer._id)}
                                            userId={JSON.stringify(userId)}
                                            upvotes={answer.upvotes.length}
                                            hasUpvoted={answer.upvotes.includes(userId)}
                                            downvotes={answer.downvotes.length}
                                            hasDownvoted={answer.downvotes.includes(userId)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <ParseHTML data={answer.content} />
                        </article>
                    ))}
            </div>
            <Pagination
                pageNumber={page ? +page : 1}
                isNext={result.isNext}
            />
        </div>
    )
}

export default AllAnswers
