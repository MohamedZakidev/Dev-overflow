import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: "/assets/images/site-logo.svg",
  openGraph: {
    url: "https://dev-overflow-mocha.vercel.app/",
    images: [
      {
        url: "/public/assets/images/dark-illustration.png",
        width: 1200,
        height: 630,
        alt: "Dev Overflow platform preview image"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Flow",
    description:
      "A community-driven platform for asking and answering programming questions.",
    images: ["/assets/images/dark-illustration.png"],
  }
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = await auth()

  let result
  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1
      })
    } else {
      result = {
        questions: [],
        isNext: false
      }
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1
    })
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link
          href="/ask-question"
        >
          <Button className="primary-gradient paragraph-medium min-h-[46px] px-4 py-3 !font-semibold !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherclasses={"min-h-[56px] sm:min-w-[170px]"}
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ?
          result.questions.map(question => (
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
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        }
      </div>

      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}
