import mongoose from "mongoose";

const date = new Date();
date.setDays(date.getDays() + 1);

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    myAttachments: [
        {
            type: String
        }
    ],
    assignmentAttachments: [
        {
            type: String
        }
    ],
    team: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Team"
    },
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },//quem fez
    dateLimit: {
        type: Date,
        required: true,
        default: date.getTime()
    }
})

export default mongoose.model("Assignment", schema)