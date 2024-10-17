import QuestionForm from "@/components/forms/QuestionForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
  const { userId } = auth()
  if (!userId) return redirect("/sign-in")

  const mongoUser = await getUserById({ userId })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a public quesiton</h1>
      <div className="mt-9">
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </>
  )
}

export default Page;
