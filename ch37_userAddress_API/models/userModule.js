import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        phone: { type: String, required: true },
        gender: { type: String, required: true }
    }
)

const userModule = mongoose.model("user", userSchema)

export default userModule