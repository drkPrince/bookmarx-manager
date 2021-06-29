import dbConnect from "../../utils/dbConnect";
import Collection from "../../models/Collection.model.js";
import Link from "../../models/Link.model.js";

export default async function handler(req, res) {
    const { method, body, query } = req;
    await dbConnect();

    switch (method) {
        case "GET":
            try {
                const collections = await Collection.find({ user: query.user });
                res.status(200).json({ success: true, data: collections });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const newCollection = await Collection.create(body);
                res.status(201).json({ success: true, data: newCollection });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                await Collection.deleteOne({
                    _id: body.collectionID,
                });
                await Link.deleteMany({ collectionID: body.collectionID });
                res.status(200).json({ success: true });
            } catch (e) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                await Collection.findOneAndUpdate(
                    { _id: body.collectionID },
                    { name: body.newName }
                );
                res.status(200).json({ success: true });
            } catch (e) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
