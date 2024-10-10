import { AnswerFilters } from "@/constants/filters"
import { getAnswers } from "@/lib/actions/answer.action"
import Filter from "./Filter"

interface Props {
    questionId: string
    userId: string
    totalAnswers: number
    page?: number
    filter?: number
}


async function AllAnswers({ questionId, userId, totalAnswers, page, filter }: Props) {
    const { answers } = await getAnswers({ questionId })
    console.log(answers)
    return (
        <div className="mt-11">
            <div className="flex items-center justify-between">
                <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
                <Filter
                    filters={AnswerFilters}
                />
            </div>
            {/* 
            <div>
                {answers.map((answer) => (
                    <article key={answer._id}>
                        answer
                    </article>
                ))}
            </div> */}
        </div>
    )
}

export default AllAnswers
