import Link from "next/link"
import Metric from "../shared/Metric"
import RenderTag from "../shared/RenderTag"

interface Props {
    _id: number
    title: string
    tags: { _id: number, name: string }[]
    author: {
        _id: number
        name: string
        picture: string
    }
    views: number
    answers: Array<object>
    upvotes: number
    createdAt: Date
}


function QuestionCard({ _id, title, tags, author, views, answers, upvotes, createdAt }: Props) {
    console.log(author)
    return (
        <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div>
                    <span className="subtle-regular text-dark400_light700">{String(createdAt)}</span>
                    <Link href={`/question/${_id}`}>
                        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">{title}</h3>
                    </Link>
                </div>
                {/* If signed in add edit and delete actions */}
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2">
                {tags.map(tag => (
                    <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
            </div>

            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                <Metric
                    imgUrl="/assets/icons/avatar.svg"
                    alt="user"
                    value={author.name}
                    title="| asked 2 mins ago"
                    href={`/profile/${author._id}`}
                    isAuthor
                    textStyles="body-medium text-dark400_light700"
                />
                <Metric
                    imgUrl="/assets/icons/like.svg"
                    alt="upvotes"
                    value={upvotes}
                    title="Votes"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/message.svg"
                    alt="message"
                    value={answers.length}
                    title="Answers"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={views}
                    title="Views"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>

        </div>
    )
}

export default QuestionCard
