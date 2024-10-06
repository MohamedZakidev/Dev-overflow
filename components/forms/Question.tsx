"use client"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createQuestion } from "@/lib/actions/question.action";
import { QuestionsSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from '@tinymce/tinymce-react';
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "../ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const type: any = "create"

interface Props {
    mongoUserId: string
}

function Question({ mongoUserId }: Props) {
    const editorRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    console.log("pathname", pathname)
    const form = useForm<z.infer<typeof QuestionsSchema>>({
        resolver: zodResolver(QuestionsSchema),
        defaultValues: {
            title: "",
            explanation: "",
            tags: []
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
        setIsSubmitting(true)
        try {
            await createQuestion({
                title: values.title,
                content: values.explanation,
                tags: values.tags,
                author: JSON.parse(mongoUserId),
                path: pathname
            })

            router.push("/")

        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleonKeyDown(e: React.KeyboardEvent<HTMLInputElement>, field: any) {
        if (e.key === "Enter" && field.name === "tags") {
            e.preventDefault()
            const tagInput = e.target as HTMLInputElement
            const tagValue = tagInput.value

            if (tagValue !== "") {
                if (tagValue.length > 15) {
                    return form.setError("tags", {
                        type: "required",
                        message: "Tag must be less than 15 characters"
                    })
                }
                if (!field.value.includes(tagValue)) {
                    form.setValue("tags", [...field.value, tagValue])
                    tagInput.value = ""
                    form.clearErrors("tags")
                }
            } else {
                form.trigger()
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleRemoveTag(tag: string, field: any) {
        const newTags = field.value.filter((item: string) => item !== tag)
        form.setValue("tags", newTags)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-10"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800 ">Question Title <span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <Input
                                    className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Be specific and imagine you’re asking a question to another person.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="explanation"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="paragraph-semibold text-dark400_light800 ">Detailed explanation of your problem<span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                                    onInit={(_evt, editor) => {
                                        // @ts-expect-error just ignore
                                        editorRef.current = editor
                                    }}
                                    onBlur={field.onBlur}
                                    onEditorChange={(content) => field.onChange(content)}
                                    initialValue=""
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                                            'insertdatetime', 'media', 'table'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'codesample | bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist',
                                        content_style: 'body { font-family:Inter; font-size:16px }'
                                    }}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800 ">Tags <span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <>
                                    <Input
                                        placeholder="Add tags..."
                                        className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
                                        onKeyDown={(e) => handleonKeyDown(e, field)}
                                    />
                                    {field.value.length > 0 && (
                                        <div className="flex-start mt-2.5 gap-2.5">
                                            {field.value.map(tag => (
                                                <Badge
                                                    key={tag}
                                                    className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                                                >
                                                    {tag}
                                                    <Image
                                                        src="/assets/icons/close.svg"
                                                        alt="delete tag icon"
                                                        width={12}
                                                        height={12}
                                                        className="cursor-pointer object-contain invert-0 dark:invert"
                                                        onClick={() => handleRemoveTag(tag, field)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </>
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="primary-gradient w-fit self-center px-8 py-6 font-semibold text-light-900"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            {type === "edit" ? "Editing..." : "Posting..."}
                        </>
                    ) : (
                        <>
                            {type === "edit" ? "Edit Question" : "Post Question"}
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default Question
