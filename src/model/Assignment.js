import mongoose from "mongoose";

const date = new Date();
date.setDate(date.getDate() + 1);

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    assignmentAttachments: [
      {
        type: String,
      },
    ],
    team: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Team",
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    }, //quem fez
    dateLimit: {
      type: Date,
      required: true,
      default: date,
    },
    users: {
      type: mongoose.Types.ObjectId,
      ref: "UserAssignment",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Assignment", schema);
