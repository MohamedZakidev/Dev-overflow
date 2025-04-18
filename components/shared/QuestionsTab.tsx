import { getUserQuestions } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"
import QuestionCard from "../cards/QuestionCard"
import Pagination from "./Pagination"

interface Props extends SearchParamsProps {
  userId: string
  clerkId?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function QuestionsTab({ userId, clerkId, searchParams }: Props) {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1
  })

  return (
    <div className="mt-5 flex flex-col gap-6">
      {result.questions.map(question => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          views={question.views}
          answers={question.answers}
          upvotes={question.upvotes}
          createdAt={question.createdAt}
        />
      ))}


      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </div>
  )
}

export default QuestionsTab
