import dbConnect from "../../utils/dbConnect";
import Link from "../../models/Link.model.js";
import Metascraper from "metascraper";
import axios from "axios";

export default async function (req, res) {
	const { method, body, query } = req;
	await dbConnect();

	switch (method) {
		case "GET":
			try {
				const links = await Link.find({
					collectionID: query.collectionID,
				});
				res.status(200).json({
					success: true,
					data: links,
				});
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case "POST":
			try {
				const metascraper = Metascraper([
					require("metascraper-description")(),
					require("metascraper-image")(),
					require("metascraper-title")(),
				]);

				const url = body.url;
				const response = await axios.get(url);
				const html = response.data;
				const resource = await metascraper({ html, url });

				const newLink = await Link.create({
					...body,
					metadata: resource,
				});
				res.status(201).json({ success: true, data: newLink });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;

		case "DELETE":
			try {
				const response = await Link.deleteOne({
					_id: body.linkID,
				});
				res.status(200).json({ success: true });
			} catch (e) {
				res.status(400).json({ success: false });
			}
			break;

		case "PUT":
			console.log(body);
			try {
				const response = await Link.findOneAndUpdate(
					{ _id: body.linkID },
					{
						"metadata.title": body.title,
						"metadata.description": body.description,
						collectionID: body.collectionID,
					}
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
