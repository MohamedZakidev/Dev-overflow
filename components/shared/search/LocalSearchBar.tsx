import { Input } from "@/components/ui/input"
import Image from "next/image"

interface CustomInputProps {
    route: string
    iconPosition: string,
    imgSrc: string
    placeholder: string
    otherClasses?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LocalSearchBar({ route, iconPosition, imgSrc, placeholder, otherClasses }: CustomInputProps) {
    return (
        <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            <Image
                src={imgSrc}
                width={24}
                height={24}
                alt="search icon"
                className={`cursor-pointer ${iconPosition === "right" && "order-1"}`}
            />
            <Input
                type="text"
                placeholder={placeholder}
                className="background-light800_darkgradient placeholder no-focus paragraph-regular border-none shadow-none outline-none"
            />
        </div>
    )
}

export default LocalSearchBar
