import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collection | Dev Overflow"
}
export default async function collection({ searchParams }: SearchParamsProps) {
    const { userId } = auth()
    if (!userId) return null

    const result = await getSavedQuestions({
        clerkId: userId,
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1
    })

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"
                />
                <Filter
                    filters={QuestionFilters}
                    otherclasses={"min-h-[56px] sm:min-w-[170px]"}
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
                        title="There’s no saved question to show"
                        description="Save questions by clicking the ⭐ icon to add them to your collection"
                        link="/"
                        linkTitle="Explore Questions"
                    />
                }
            </section>
            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
            />
        </>
    );
}
