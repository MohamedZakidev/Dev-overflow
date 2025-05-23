import { Document, Schema, model, models } from "mongoose";

export interface IInteraction extends Document {
    user: Schema.Types.ObjectId
    question: Schema.Types.ObjectId
    action: string
    answers: Schema.Types.ObjectId
    tags: Schema.Types.ObjectId[]
    createdAt: Date
}

const InteractionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    action: { type: String, required: true },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    createdAt: { type: Date, default: Date.now }
});

const Interaction = models.Interaction || model("Interaction", InteractionSchema)

export default Interaction