import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    refresh_token: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    expires_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserToken", schema);
