import User from "../../../models/User.model.js";

export default async function signup(req, res) {
	const { body, method } = req;
	switch (method) {
		case "POST":
			const newUser = await User.create(body);
			res.send({ ...newUser });
			break;
	}
}
