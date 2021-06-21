import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

const Collection = (props) => {
	const router = useRouter();
	const { collectionID } = router.query;
	const [links, setLinks] = useState([]);

	useEffect(() => {
		(async () => {
			if (collectionID) {
				const res = await axios.get(
					`/api/link?collectionID=${collectionID}`
				);
				setLinks(res.data.data);
			}
		})();
	}, [collectionID]);

	const addNewLink = async (e) => {
		e.preventDefault();
		const res = await axios.post("/api/link", {
			title: e.target.elements.title.value,
			url: e.target.elements.url.value,
			collectionID,
		});
		setLinks((links) => [...links, res.data.data]);
		e.target.reset();
	};

	return (
		<>
			<form onSubmit={addNewLink}>
				<input name="title" placeholder="New Link title" type="text" />
				<input name="url" placeholder="URL" type="url" />
				<button type="submit">Add</button>
			</form>
			<p>Collection: {collectionID}</p>
			<div>
				{links.map((l) => (
					<div key={l._id}>
						<h1>{l.title}</h1>
					</div>
				))}
			</div>
		</>
	);
};

export default Collection;
