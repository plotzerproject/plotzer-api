import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    tag: {
        type: String,
        default: "Membro"
    },
    userPermissions: {
        type: Number,
        default: 0
    },
    reputation: {
        type: Number,
        default: 100
    },
    member_active: {
        type: Boolean,
        default: false
    },
    type_invite: {
        type: String,
        required: true,
        enum: ['requested', 'invited', 'owner', 'blocked']
    }
}, {
    _id: false
})

const fixedSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: mongoose.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    privacy: {
        type: String,
        default: "open",
        enum: ['open', 'closed', 'only-invites']
    },
    photo: String,
    background: String,
    members: [memberSchema],
    active: {
        type: Boolean,
        default: true
    },
    fixed: [fixedSchema],
    stats: {
        type: Number,
        default: 100
    }
}, {
    toJSON: {
      virtuals: true,
    }
  })

export default mongoose.model("Team", schema)