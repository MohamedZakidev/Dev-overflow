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
import { QuestionsSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";

function Question() {
    const editorRef = useRef(null);

    const form = useForm<z.infer<typeof QuestionsSchema>>({
        resolver: zodResolver(QuestionsSchema),
        defaultValues: {
            title: "",
            explanation: "",
            tags: []
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof QuestionsSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
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
                                Be specific and imagine you’re asking a question to another person.                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="paragraph-semibold text-dark400_light800 ">Detailed explanation of your problem<span className="text-primary-500">*</span></FormLabel>
                            <FormControl className="mt-3.5">
                                <Editor
                                    apiKey='your-api-key'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue="<p>This is the initial content of the editor.</p>"
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
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
                                <Input
                                    placeholder="Add tags..."
                                    className="no-focus paragraph-regular background-light900_dark300 text-dark300_light700 light-border-2 min-h-[56px] border"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default Question
