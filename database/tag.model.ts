/* eslint-disable no-unused-vars */
import { Document, Schema, model, models } from "mongoose";

export interface Itag extends Document {
    name: string
    description: string
    questions: Schema.Types.ObjectId[]
    followers: Schema.Types.ObjectId[]
    createdAt: Date
}

const TagSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // array of ObjectId references to 'Question'
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // array of ObjectId references to 'User'
    createdAt: { type: Date, default: Date.now }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Tag = models.Tag || model("Tag", TagSchema)

export default Tag