import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"

interface Props {
    title: string
    description: string
    link: string
    linkTitle: string
}

function NoResult({ title, description, link, linkTitle }: Props) {
    return (
        <div className="mt-10 flex flex-col items-center justify-center">
            <Image
                src="/assets/images/light-illustration.png"
                alt="no result illustration"
                width={270}
                height={200}
                className="block object-contain dark:hidden"
            />
            <Image
                src="/assets/images/dark-illustration.png"
                alt="no result illustration"
                width={270}
                height={200}
                className="hidden object-contain dark:block"
            />

            <h2 className="h2-bold text-dark200_light900 mt-8 text-center">{title}</h2>
            <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">{description}</p>
            <Link href={link}>
                <Button className="paragraph-medium primary-gradient hover:primary-gradient mt-5 min-h-[46px] rounded-lg px-4 py-3 !font-semibold text-light-900" >
                    {linkTitle}
                </Button>
            </Link>
        </div>
    )
}

export default NoResult
