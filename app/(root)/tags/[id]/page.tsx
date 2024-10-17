import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { getQuestionsByTagId } from "@/lib/actions/tag.action"
import { URLProps } from "@/types"

async function TagDetails({ params, searchParams }: URLProps) {
    const result = await getQuestionsByTagId({
        tagId: params.id,
        page: 1,
        searchQuery: searchParams.q
    })

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">{result.tagTitle.toUpperCase()}</h1>

            <div className="mt-11 w-full">
                <LocalSearchBar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for tags"
                    otherClasses="flex-1"
                />
            </div>

            <section className="mt-10 flex w-full flex-col gap-6">
                {result.questions.length > 0 ?
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    result.questions.map((question: any) => (
                        <QuestionCard
                            key={question._id}
                            _id={question._id}
                            title={question.title}
                            tags={question.tags}
                            author={question.author}
                            views={question.views}
                            answers={question.answers}
                            upvotes={question.upvotes}
                            createdAt={question.createdAt}
                        />
                    )) :
                    <NoResult
                        title="There’s no tags to show"
                        description="Ask a Question❓to see more tags here"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                }
            </section>
        </>
    )
}

export default TagDetails
