import { getTopInteractedTags } from "@/lib/actions/tag.action"
import Image from "next/image"
import Link from "next/link"
import RenderTag from "../shared/RenderTag"
import { Badge } from "../ui/badge"

interface Props {
    user: {
        _id: string
        clerkId: string
        name: string
        username: string
        picture: string
    }
}

async function UserCard({ user }: Props) {
    const interactedTags = await getTopInteractedTags({ userId: user._id })

    return (
        <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
            <div className="background-light900_dark200 light-border flex-center w-full flex-col rounded-2xl border p-8">
                <Link
                    href={`/profile/${user.clerkId}`}
                >
                    <Image
                        src={user.picture}
                        alt="user profile picture"
                        width={100}
                        height={200}
                        className="aspect-square rounded-[50%]"
                    />
                </Link>
                <div className="mt-4 text-center">
                    <Link
                        href={`/profile/${user.clerkId}`}
                    >
                        <h3 className="h3-bold text-dark200_light900 line-clamp-1">{user.name}</h3>
                        <p className="body-regular text-dark500_light500 mt-2">@{user.username}</p>
                    </Link>

                    <div className="mt-5">
                        {interactedTags.length > 0 ? (
                            <div className="flex items-center gap-2">
                                {interactedTags.map(tag => (
                                    <RenderTag key={tag} name={tag} _id={tag} />
                                ))}
                            </div>
                        ) : (
                            <Badge>No Tags yet</Badge>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserCard
