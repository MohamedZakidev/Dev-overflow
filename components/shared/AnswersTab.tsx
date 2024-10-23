import { getUserAnswers } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"
import AnswerCard from "../cards/AnswerCard"

interface Props extends SearchParamsProps {
    userId: string
    clerkId?: string | null
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function AnswersTab({ userId, clerkId, searchParams }: Props) {
    const result = await getUserAnswers({ userId, page: 1 })
    return (
        <div className="mt-5 flex w-full flex-col gap-6 border-cyan-600">
            {result.answers.map(answer => (
                <AnswerCard
                    key={answer._id}
                    _id={answer._id}
                    clerkId={clerkId}
                    author={answer.author}
                    question={answer.question}
                    upvotes={answer.upvotes}
                    createdAt={answer.createdAt}
                />
            ))}
        </div>
    )
}

export default AnswersTab