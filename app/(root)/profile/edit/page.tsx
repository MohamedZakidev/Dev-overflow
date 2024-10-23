import { getUserById } from "@/lib/actions/user.action"
import { auth } from "@clerk/nextjs/server"

async function EditProfile() {
    const { userId } = auth()
    if (!userId) {
        console.log("userrr is not FoUnd")
        return null
    }

    const mongoUser = await getUserById({ userId })

    return (
        <div>edite page</div>
        // <>
        //     <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
        //     <div className="mt-9">
        //         <ProfileForm
        //             clerkId={userId}
        //             user={JSON.stringify(mongoUser)}
        //         />
        //     </div>
        // </>
    )
}

export default EditProfile
