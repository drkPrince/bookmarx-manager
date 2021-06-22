import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

const Collection = (props) => {
	const router = useRouter();
	const { collectionID, name } = router.query;
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
			url: e.target.elements.url.value,
			collectionID,
		});
		setLinks((links) => [...links, res.data.data]);
		e.target.reset();
	};

	const deleteLink = async (id) => {
		console.log(id);
		setLinks((links) => links.filter((x) => x._id !== id));
		await axios.delete("/api/link", { data: { linkID: id } });
	};

	return (
		<div className="px-8 py-12 w-full">
			<h1 className="text-xl text-gray-800 font-semibold">{name}</h1>
			<div className="grid grid-cols-3 gap-6 grid-flow-col w-full my-8">
				{links.map((l) => (
					<article
						className=" pb-4 shadow-md border border-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
						key={l._id}
					>
						{!l.metadata.ogImage ? (
							<div className="w-full">
								<img
									className="object-cover w-full h-[170px] overflow-hidden"
									src={l.metadata.image}
									loading="lazy"
									alt=""
								/>
							</div>
						) : (
							<img src="http://lorempixel.com/g/400/200" alt="" />
						)}
						<h1 className="text-sm font-semibold truncate mt-2 px-3">
							{l.metadata.title}
						</h1>
						<p className="px-3 text-sm text-blue-700 mt-1">
							{l.url.split("/")[2]}
						</p>
						<p className="px-3 text-sm text-gray-700 mt-2 truncate">
							{l.metadata.description}
						</p>
						<button onClick={() => deleteLink(l._id)}>
							Delete
						</button>
					</article>
				))}
			</div>
			<form
				className="border border-gray-100 shadow px-7 py-8 hidden"
				onSubmit={addNewLink}
			>
				<input
					className="block w-full border-b outline-none border-gray-300 focus:ring pb-1 mb-5"
					name="url"
					placeholder="URL"
					type="url"
				/>
				<button
					className="block w-full bg-blue-800 px-2 py-1 rounded text-white mt-7"
					type="submit"
				>
					Add link
				</button>
			</form>
		</div>
	);
};

export default Collection;
