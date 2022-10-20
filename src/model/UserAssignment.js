import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId, 
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["sent", "received", "returned"],
        default: "received"
    },
    completedAt: {
        type: Date,
        // default: ()=>{
        //     console.log(this.status)
        //     if(this.status == "sent") {
        //         return Date.now()
        //     } else {
        //         return null
        //     }
        // }
    }
}, {
    _id: false
})

const schema = new mongoose.Schema({
    team: {
        type: mongoose.Types.ObjectId,
        ref: "Team",
        required: true
    },
    assignment: {
        type: mongoose.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    users: [userSchema]
}, {
    timestamps: true
})

export default mongoose.model("UserAssignment", schema)