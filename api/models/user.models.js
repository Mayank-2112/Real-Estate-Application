import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fman-avatar-profile-picture-vector-illustration_268834-538.jpg&tbnid=DPknMIWk0qJ9zM&vet=12ahUKEwj1z-zh1dmCAxXx5TgGHYsWB-AQMygPegUIARCIAQ..i&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fprofile&docid=WIYPytbMl_8XfM&w=626&h=626&q=profile%20image&ved=2ahUKEwj1z-zh1dmCAxXx5TgGHYsWB-AQMygPegUIARCIAQ",
    }
},
   {timestamps: true}
)

const User = new mongoose.model('User', userSchema);

export default User;