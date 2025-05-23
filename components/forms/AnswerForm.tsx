"use client"
import { useTheme } from "@/context/ThemeProvider"
import { createAnswer } from "@/lib/actions/answer.action"
import { AnswerSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Editor } from "@tinymce/tinymce-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"

interface Props {
    question: string
    questionId: string
    authorId: string
}

// i deleted the question prop
function AnswerForm({ questionId, authorId }: Props) {
    const pathname = usePathname()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { mode } = useTheme()
    const editorRef = useRef(null);

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: ""
        }
    })

    async function handleSubmitAnwser(values: z.infer<typeof AnswerSchema>) {
        setIsSubmitting(true)

        try {
            await createAnswer({
                content: values.answer,
                author: JSON.parse(authorId),
                question: JSON.parse(questionId),
                path: pathname
            })

            form.reset()
            if (editorRef.current) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const editor = editorRef.current as any
                editor.setContent("")
            }
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    async function generateAIAnswer() {
        // if (!authorId) { return };

        // try {
        //     const response = await
        //         fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
        //             method: "POST",
        //             body: JSON.stringify({ question })
        //         })
        //     const AIAnswer = await response.json()
        //     alert(AIAnswer.reply)
        // } catch (error) {
        //     console.log(error)
        //     throw error
        // }
        alert("OpenAi API is not free anymore :(")
    }

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">Type your answer here</h4>
                <Button
                    className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
                    onClick={generateAIAnswer}
                >
                    <Image
                        src="/assets/icons/stars.svg"
                        alt="star image for Generate Answer with ai button"
                        width={12}
                        height={12}
                        className="object-contain"
                    />
                    Generate AI Answer
                </Button>
            </div>

            <Form {...form}>
                <form
                    className="mt-6 flex w-full flex-col gap-10"
                    onSubmit={form.handleSubmit(handleSubmitAnwser)}
                >
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3">
                                <FormControl className="mt-3.5">
                                    <Editor
                                        apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                                        onInit={(_evt, editor) => {
                                            // @ts-expect-error just ignore
                                            editorRef.current = editor
                                        }}
                                        onBlur={field.onBlur}
                                        onEditorChange={(content) => field.onChange(content)}
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
                                            content_style: 'body { font-family:Inter; font-size:16px }',
                                            skin: mode === "dark" ? 'oxide-dark' : 'oxide',
                                            content_css: mode === "dark" ? 'dark' : 'light'
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="primary-gradient w-fit font-semibold text-light-900"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Post Answer"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AnswerForm
