import { getTopQuestions } from "@/lib/actions/question.action"
import { getPopularTags } from "@/lib/actions/tag.action"
import Image from "next/image"
import Link from "next/link"
import RenderTag from "./RenderTag"

async function RightSidebar() {
    const topQuestions = await getTopQuestions()
    const popularTags = await getPopularTags()
    return (
        <aside className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                <div className="mt-7 flex flex-col gap-[30px]">
                    {topQuestions.map(question => (
                        <Link
                            key={question._id}
                            href={`/question/${question._id}`}
                            className="flex cursor-pointer items-center justify-between gap-7"
                        >
                            <p className="body-medium text-dark500_light700">{question.title}</p>
                            <Image
                                src="/assets/icons/chevron-right.svg"
                                width={20}
                                height={20}
                                alt="chevron right"
                                className="invert-colors"
                            />
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-16">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                <div className="mt-7 flex flex-col gap-4">
                    {popularTags.map(tag => (
                        <RenderTag
                            key={tag._id}
                            _id={tag._id}
                            name={tag.name}
                            totalQuestions={tag.numberofQuestions}
                            showCount
                        />
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default RightSidebar
// i delted w-full