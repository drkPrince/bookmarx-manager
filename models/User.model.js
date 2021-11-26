import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//Do this before saving new user
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    this.password = bcrypt.hashSync(this.password, 10);
  } else next();
});

export default mongoose.models.user || mongoose.model("user", UserSchema);
