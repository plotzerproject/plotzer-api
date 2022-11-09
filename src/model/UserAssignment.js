import mongoose from "mongoose";

const userAttachmentSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      format: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      }
    }
  );

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
    userAttachments: [userAttachmentSchema],
    completedAt: {
        type: Date,
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