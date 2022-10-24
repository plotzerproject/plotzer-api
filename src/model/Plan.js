import mongoose from "mongoose";

const permissionsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    limit: {
        type: Number,//era pra ser number ou string(unlimited)
        // required: true
    }
})

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