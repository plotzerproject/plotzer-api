import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    permissions: {
        type: Number,
        required: true
    }
})

export default mongoose.model("Plan", schema)