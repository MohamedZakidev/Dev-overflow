import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { question } = await request.json()

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a knowlegeable assistant that provides quality information"
                    }, {
                        role: "user",
                        content: `Tell me ${question}`
                    }
                ]
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.log(errorText)
            throw new Error(`API Error: ${errorText}`)
        }

        const responseData = await response.json()
        const reply = responseData.choices[0].message.content
        return NextResponse.json({ reply })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message })
    }
}