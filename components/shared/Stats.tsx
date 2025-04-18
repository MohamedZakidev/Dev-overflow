import { formatAndDivideNumber } from "@/lib/utils"
import { BadgeCounts } from "@/types"
import Image from "next/image"

interface StatsCardProps {
    imgUrl: string
    value: number
    title: string
}


function StatsCard({ imgUrl, value, title }: StatsCardProps) {
    return (
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
            <Image
                src={imgUrl}
                alt={title}
                width={40}
                height={50}
            />
            <div>
                <p className="paragraph-semibold text-dark200_light900">{value}</p>
                <p className="paragraph-semibold text-dark200_light900">{title}</p>
            </div>
        </div>
    )
}

interface StatsProps {
    totalQuestions: number
    totalAnswers: number,
    badgesCounts: BadgeCounts,
    reputation: number
}
function Stats({ totalQuestions, totalAnswers, badgesCounts, reputation }: StatsProps) {
    return (
        <div className="mt-10">
            <h4 className="h3-semibold text-dark200_light900">Reputation: {reputation}</h4>
            <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
                    <div>
                        <p className="paragraph-semibold text-dark200_light900">{formatAndDivideNumber(totalQuestions)}</p>
                        <p className="body-medium text-dark400_light700">{totalQuestions === 1 ? "Question" : "Questions"}</p>
                    </div>
                    <div>
                        <p className="paragraph-semibold text-dark200_light900">{formatAndDivideNumber(totalAnswers)}</p>
                        <p className="body-medium text-dark400_light700">{totalAnswers === 1 ? "Answer" : "Answers"}</p>
                    </div>
                </div>
                <StatsCard
                    imgUrl="/assets/icons/gold-medal.svg"
                    value={badgesCounts.GOLD}
                    title="Gold Badges"
                />
                <StatsCard
                    imgUrl="/assets/icons/silver-medal.svg"
                    value={badgesCounts.SILVER}
                    title="Silver Badges"
                />
                <StatsCard
                    imgUrl="/assets/icons/bronze-medal.svg"
                    value={badgesCounts.BRONZE}
                    title="Bronze Badges"
                />
            </div>
        </div>
    )
}


export default Stats
