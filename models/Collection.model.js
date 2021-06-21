import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.models.collection ||
  mongoose.model("collection", CollectionSchema);
