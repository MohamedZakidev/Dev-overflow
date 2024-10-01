import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";


const questions = [
  {
    _id: 1,
    title: "An HTML table where specific cells come from values in a Google Sheet identified by their neighboring cell",
    tags: [{ _id: 1, name: "javascript" }],
    author: { _id: 1, name: "John Doe", picture: "https://example.com/john.jpg" },
    views: 100000,
    answers: [], // Assuming no answers or you can add objects with relevant data
    upvotes: 3000000,
    createdAt: new Date("2024-09-29")
  },
  {
    _id: 2,
    title: "An HTML table where specific cells come from values in a Google Sheet identified by their neighboring cell",
    tags: [{ _id: 1, name: "javascript" }],
    author: { _id: 2, name: "Jane Doe", picture: "https://example.com/jane.jpg" },
    views: 10,
    answers: [],
    upvotes: 3,
    createdAt: new Date("2023-09-29")
  },
  {
    _id: 3,
    title: "An HTML table where specific cells come from values in a Google Sheet identified by their neighboring cell",
    tags: [{ _id: 1, name: "javascript" }],
    author: { _id: 3, name: "Jake Smith", picture: "https://example.com/jake.jpg" },
    views: 10,
    answers: [],
    upvotes: 3,
    createdAt: new Date("2023-09-29")
  },
  {
    _id: 4,
    title: "An HTML table where specific cells come from values in a Google Sheet identified by their neighboring cell",
    tags: [{ _id: 1, name: "javascript" }],
    author: { _id: 4, name: "Emily Johnson", picture: "https://example.com/emily.jpg" },
    views: 10,
    answers: [],
    upvotes: 3,
    createdAt: new Date("2023-09-29")
  },
];


export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link
          href="/ask-question"
        >
          <Button className="primary-gradient paragraph-medium min-h-[46px] px-4 py-3 !text-light-900">
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
        {questions.length > 0 ?
          questions.map(question => (
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
    </>
  );
}
