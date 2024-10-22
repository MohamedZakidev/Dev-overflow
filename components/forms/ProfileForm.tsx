"use client"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateUser } from "@/lib/actions/user.action"
import { ProfileSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"


interface Props {
    clerkId: string
    user: string
}

function ProfileForm({ clerkId, user }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const parsedUser = JSON.parse(user)
    const pathname = usePathname()
    const router = useRouter()

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: parsedUser.name || "",
            username: parsedUser.username || "",
            portfolioWebsite: parsedUser.portfolioWebsite || "",
            location: parsedUser.location || "",
            bio: parsedUser.bio || ""
        },
    })

    async function onSubmit(values: z.infer<typeof ProfileSchema>) {
        setIsSubmitting(true)
        try {
            await updateUser({
                clerkId,
                updateData: {
                    name: values.name,
                    username: values.username,
                    portfolioWebsite: values.portfolioWebsite,
                    location: values.location,
                    bio: values.bio
                },
                path: pathname
            })
            router.back()
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-9">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-y-2.5">
                            <FormLabel>
                                Full Name
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your Full Name"
                                    {...field}
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="space-y-2.5">
                            <FormLabel>
                                Username
                                <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your username"
                                    {...field}
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="portfolioWebsite"
                    render={({ field }) => (
                        <FormItem className="space-y-2.5">
                            <FormLabel>Portfolio link</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="Your portfolio URL"
                                    {...field}
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="space-y-2.5">
                            <FormLabel>location</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Where are you from?"
                                    {...field}
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="space-y-2.5">
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="What's special about you"
                                    {...field}
                                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="mt-7 flex justify-end">
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="primary-gradient w-fit font-semibold text-light-900"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ProfileForm
