import mongoose from "mongoose";

const topicsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isAssignment: {
        type: Boolean,
        default: false
    },
    dateLimit: Date,
    color: String
}, {
    timestamps: true
})

const schema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type: String,
        required: true
    },
    topics: [topicsSchema],
    team: {
        type: mongoose.Types.ObjectId,
        ref: "Team"
    },
    tag: String,
    color: String
}, {
    timestamps: true
})

export default mongoose.model("Kanban", schema)