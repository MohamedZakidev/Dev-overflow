/* eslint-disable @typescript-eslint/no-explicit-any */
import AnswerForm from "@/components/forms/AnswerForm"
import AllAnswers from "@/components/shared/AllAnswers"
import Metric from "@/components/shared/Metric"
import ParseHTML from "@/components/shared/ParseHTML"
import RenderTag from "@/components/shared/RenderTag"
import Votes from "@/components/shared/Votes"
import { getQuestionById } from "@/lib/actions/question.action"
import { getUserById } from "@/lib/actions/user.action"
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function QuestionDetails({ params }: any) {
    const { userId: clerkId } = auth();

    if (!clerkId) return redirect("/sign-in")

    const mongoUser = await getUserById({ userId: clerkId })

    const question = await getQuestionById({ questionId: params.id })

    return (
        <>
            <div className="flex-start w-full flex-col">

                <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                    <Link
                        href={`profile/${question.author.clerkId}`}
                        className="flex items-center justify-start gap-1"
                    >
                        <Image
                            src={question.author.picture}
                            alt="profile picture"
                            width={22}
                            height={22}
                            className="rounded-full"
                        />
                        <p className="paragraph-semibold text-dark300_light700">{question.author.name}</p>
                    </Link>

                    <div className="flex justify-end">
                        <Votes
                            type="Question"
                            itemId={JSON.stringify(question._id)}
                            userId={JSON.stringify(mongoUser._id)}
                            upvotes={question.upvotes.length}
                            hasUpvoted={question.upvotes.includes(mongoUser._id)}
                            downvotes={question.downvotes.length}
                            hasDownvoted={question.downvotes.includes(mongoUser._id)}
                            hasSaved={mongoUser?.saved.includes(question._id)}
                        />
                    </div>

                </div>

                <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">{question.title}</h2>
            </div>

            <div className="mb-8 mt-5 flex flex-wrap gap-4">
                <Metric
                    imgUrl="/assets/icons/clock.svg"
                    alt="clock icon"
                    value={`asked ${getTimestamp(question.createdAt)}`}
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/message.svg"
                    alt="Answers icon"
                    value={formatAndDivideNumber(question.answers.length)}
                    title="Answers"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={formatAndDivideNumber(question.views)}
                    title="Views"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>

            <ParseHTML data={question.content} />

            <div className="mt-8 flex flex-wrap gap-2">
                {question.tags.map((tag: any) => (
                    <RenderTag
                        key={tag._id}
                        _id={tag._id}
                        name={tag.name}
                    />
                ))}
            </div>

            <AllAnswers
                userId={mongoUser._id}
                questionId={question._id}
                totalAnswers={question.answers.length}
            />

            <AnswerForm
                authorId={JSON.stringify(mongoUser._id)}
                question={question.content}
                questionId={JSON.stringify(question._id)}
            />
        </>
    )
}

export default QuestionDetails
