import dbConnect from "../../utils/dbConnect";
import Link from "../../models/Link.model.js";
import metascraper from "metascraper";
import axios from "axios";
import got from "got";
import ogs from "open-graph-scraper";

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
				const options = { url: body.url };
				console.log(options);
				const { result } = await ogs(options);
				console.log(result);
				const newLink = await Link.create({
					...body,
					metadata: result,
				});
				res.status(201).json({ success: true, data: newLink });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
