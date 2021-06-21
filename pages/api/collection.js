import dbConnect from "../../utils/dbConnect";
import Collection from "../../models/Collection.model.js";

export default async function handler(req, res) {
    const { method } = req;
    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const collections = await Collection.find({});
                res.status(200).json({ success: true, data: collections });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const newCollection = await Collection.create(req.body);
                res.status(201).json({ success: true, data: newCollection });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
