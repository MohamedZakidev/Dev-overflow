"use client";
import { toast } from "@/hooks/use-toast";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
    downvoteQuestion,
    upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface Props {
    type: string;
    itemId: string;
    userId: string;
    upvotes: number;
    hasUpvoted: boolean;
    downvotes: number;
    hasDownvoted: boolean;
    hasSaved?: boolean;
}

function Votes({ type, itemId, userId, upvotes, hasUpvoted, downvotes, hasDownvoted, hasSaved }: Props) {
    const pathname = usePathname();

    async function handleSave() {
        await toggleSaveQuestion({
            userId: JSON.parse(userId),
            questionId: JSON.parse(itemId),
            path: pathname
        })
        return toast({
            title: `Question ${!hasSaved ? "Saved in" : "Removed from"} your collection`,
            duration: 2000,
            className: `${!hasSaved ? "bg-primary-500 text-white p-4 rounded-lg" : "bg-red-500 text-white p-4 rounded-lg"} shadow-lg`

        })
    }

    async function handleVote(action: string) {
        if (!userId) {
            return toast({
                title: "Please Log in",
                description: "You must be Logged in to perform this action"
            })
        }

        if (action === "upvote") {
            if (type === "Question") {
                await upvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            } else if (type === "Answer") {
                await upvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            }
            return toast({
                title: `Upvote ${!hasUpvoted ? "Successful" : "Removed"}`,
                duration: 2000,
                className: `${!hasUpvoted ? "bg-green-500 text-white p-4 rounded-lg" : "bg-red-500 text-white p-4 rounded-lg"} shadow-lg`
            })
        }


        if (action === "downvote") {
            if (type === "Question") {
                await downvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            } else if (type === "Answer") {
                await downvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasUpvoted,
                    hasDownvoted,
                    path: pathname,
                });
            }
            return toast({
                title: `Downvote ${!hasDownvoted ? "Successful" : "Removed"}`,
                duration: 2000,
                className: `${!hasDownvoted ? "bg-green-500 text-white p-4 rounded-lg" : "bg-red-500 text-white p-4 rounded-lg"} shadow-lg`
            })
        }
    }

    useEffect(() => {
        viewQuestion({
            questionId: JSON.parse(itemId),
            userId: userId ? JSON.parse(userId) : undefined,
        })
    }, [itemId, userId, pathname])

    return (
        <div className="flex gap-5">
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                    <Image
                        src={
                            hasUpvoted
                                ? "/assets/icons/upvoted.svg"
                                : "/assets/icons/upvote.svg"
                        }
                        alt="upvote icon"
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        onClick={() => handleVote("upvote")}
                    />
                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatAndDivideNumber(upvotes)}
                        </p>
                    </div>
                </div>

                <div className="flex-center gap-1.5">
                    <Image
                        src={
                            hasDownvoted
                                ? "/assets/icons/downvoted.svg"
                                : "/assets/icons/downvote.svg"
                        }
                        alt="downvote icon"
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        onClick={() => handleVote("downvote")}
                    />
                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatAndDivideNumber(downvotes)}
                        </p>
                    </div>
                </div>
            </div>

            {type === "Question" && (
                <Image
                    src={
                        hasSaved
                            ? "/assets/icons/star-filled.svg"
                            : "/assets/icons/star-red.svg"
                    }
                    alt="save icon"
                    width={18}
                    height={18}
                    className="cursor-pointer"
                    onClick={handleSave}
                />
            )}
        </div>
    );
}

export default Votes;
