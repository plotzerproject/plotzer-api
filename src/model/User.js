import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Plan",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String
    },
    about: {
      type: String
    },
    password: {
      type: String,
    },
    plan: planSchema,
    photo: String,
    background: String,
    teams: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Team",
      },
    ],
    applicationPermissions: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

export default mongoose.model("User", schema);
