import { formatAndDivideNumber, getTimestamp } from "@/lib/utils"
import { SignedIn } from "@clerk/nextjs"
import Link from "next/link"
import EditDeleteAction from "../shared/EditDeleteAction"
import Metric from "../shared/Metric"
import RenderTag from "../shared/RenderTag"

interface Props {
    _id: string
    title: string
    tags: { _id: string, name: string }[]
    author: {
        _id: string
        name: string
        picture: string
        clerkId: string
    }
    views: number
    answers: Array<object>
    upvotes: string[]
    createdAt: Date
    clerkId?: string | null
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function QuestionCard({ _id, clerkId, title, tags, author, views, answers, upvotes, createdAt }: Props) {
    const showActionButtons = clerkId && clerkId === author.clerkId

    return (
        <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div>
                    <span className="subtle-regular text-dark400_light700 sm:hidden">{getTimestamp(createdAt)}</span>
                    <Link href={`/question/${_id}`}>
                        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">{title}</h3>
                    </Link>
                </div>
                {/* If signed in add edit and delete actions */}
                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteAction
                            type="Question"
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2">
                {tags.map(tag => (
                    <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
            </div>

            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                <Metric
                    imgUrl={author.picture}
                    alt="user"
                    value={author.name}
                    title={`• asked ${getTimestamp(createdAt)}`}
                    href={`/profile/${author._id}`}
                    isAuthor
                    textStyles="body-medium text-dark400_light700"
                />
                <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
                    <Metric
                        imgUrl="/assets/icons/like.svg"
                        alt="upvotes"
                        value={formatAndDivideNumber(upvotes.length)}
                        title="Votes"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/message.svg"
                        alt="message"
                        value={formatAndDivideNumber(answers.length)}
                        title="Answers"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/eye.svg"
                        alt="eye"
                        value={formatAndDivideNumber(views)}
                        title="Views"
                        textStyles="small-medium text-dark400_light800"
                    />
                </div>
            </div>

        </div>
    )
}

export default QuestionCard
