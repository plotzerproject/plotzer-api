import mongoose from "mongoose";

const teamsSchema = new mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
}, {
    _id: false
})

const planSchema = new mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Plan"
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    _id: false
})

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    plan: planSchema,
    photo: {
        type: String
    },
    teams: [teamsSchema],
    applicationPermissions: {
        type: Number,
        default: 0
    },
})

export default mongoose.model("User", schema)