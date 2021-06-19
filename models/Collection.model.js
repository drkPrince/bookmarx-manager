import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.models.Collection ||
  mongoose.model("Collection", CollectionSchema);
