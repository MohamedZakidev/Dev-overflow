/* eslint-disable no-unused-vars */
import { Document, model, models, Schema } from "mongoose";

export interface IUser extends Document {
    clerkId: string
    name: string
    username: string
    email: string
    password?: string
    bio?: string
    picture: string
    location?: string
    portfolioWebsite?: string
    reputation?: number
    saved: Schema.Types.ObjectId[]
}

const UserSchema = new Schema({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional
    bio: { type: String }, // optional
    picture: { type: String, required: true },
    location: { type: String }, // optional
    portfolioWebsite: { type: String }, // optional
    reputation: { type: Number, default: 0 }, // optional with default value
    saved: [{ type: Schema.Types.ObjectId, ref: "Question" }] // array of ObjectId references to 'Question'
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const User = models.User || model("User", UserSchema)

export default User