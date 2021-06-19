import dbConnect from "../../utils/dbConnect";
import Collection from "../../models/Collection.model.js";

export default async function handler(req, res) {
    const { method } = req;
    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const pets = await Collection.find({});
                res.status(200).json({ success: true, data: pets });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const pet = await Collection.create(req.body);
                res.status(201).json({ success: true, data: pet });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
