import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
	title: String,
	url: String,
	user: String,
	metadata: {
		type: Map,
	},
	collectionID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "collection",
	},
});

export default mongoose.models.link || mongoose.model("link", LinkSchema);
