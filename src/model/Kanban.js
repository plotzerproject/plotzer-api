import mongoose from "mongoose";

const topicsSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: String,
    color: String
}, {
    timestamps: true
})

const schema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type: String,
        required: true
    },
    subtitle: String,
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