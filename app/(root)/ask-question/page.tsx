import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

async function Page() {
  // const { userId } = auth()
  const userId = "clerk12345"
  if (!userId) return redirect("/sign-in")

  const mongoUser = await getUserById({ userId })
  console.log(mongoUser)
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a public quesiton</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  )
}

export default Page;
