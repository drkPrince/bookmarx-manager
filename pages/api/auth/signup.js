import User from "../../../models/User.model.js";

export default async function signup(req, res) {
	const { body, method } = req;
	switch (method) {
		case "POST":
			try {
				const exists = await User.findOne({ username: body.username });
				console.log(exists);
				if (exists) {
					res.status(400).json({
						success: false,
						error: "User already exists",
					});
					break;
				}
				const newUser = await User.create(body);
				res.send({ ...newUser._doc });
			} catch (error) {
				res.status(400).json({ success: false });
			}

			break;
	}
}
