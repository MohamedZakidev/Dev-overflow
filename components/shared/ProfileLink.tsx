import Image from "next/image"
import Link from "next/link"

interface ProfileLinkProps {
    imgUrl: string
    href?: string
    title: string
}

function ProfileLink({ imgUrl, href, title }: ProfileLinkProps) {
    return (
        <div className="flex-center gap-2">
            <Image
                src={imgUrl}
                alt="icon"
                width={20}
                height={20}
                className="mb-1"
            />
            {href ? (
                <Link
                    href={href}
                    target="_blank"
                    className="paragraph-medium text-accent-blue"
                >
                    {title}
                </Link>
            ) : (
                <p className="paragraph-medium text-dark400_light700">{title}</p>
            )
            }
        </div>
    )
}

export default ProfileLink
