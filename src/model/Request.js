import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    team: {
        type: mongoose.Types.ObjectId,
        ref: "Team",
    },
    status: {
        type: String,
        required: true,
        enum: ['invited', 'requested', 'friendship', 'blocked', 'removed', 'leave', 'joined']
    },
    active: {
        type: Boolean,
        // default: false
    }
}, {
    timestamps: true
})

export default mongoose.model("Request", schema)