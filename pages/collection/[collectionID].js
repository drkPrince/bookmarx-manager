import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import Head from "next/head";

const Collection = (props) => {
	const router = useRouter();
	const { collectionID, name } = router.query;
	const [links, setLinks] = useState([]);
	const [modal, setModal] = useState(false);

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
		setModal(false);
		const res = await axios.post("/api/link", {
			url: e.target.elements.url.value,
			collectionID,
		});
		setLinks((links) => [...links, res.data.data]);
	};

	const deleteLink = async (id) => {
		setLinks((links) => links.filter((x) => x._id !== id));
		await axios.delete("/api/link", { data: { linkID: id } });
	};

	return (
		<div className="px-8 py-12 w-full">
			<Head>
				<title>{name} | BookmarX</title>
			</Head>
			<Dialog
				aria-label="Add a new bookmark"
				isOpen={modal}
				onDismiss={() => setModal(false)}
			>
				<div>
					<form className=" px-7 py-8" onSubmit={addNewLink}>
						<h2 className="text-2xl text-gray-800">
							Add a new Link
						</h2>
						<input
							className="w-full border-b outline-none border-gray-300 focus:ring-2 ring-blue-500 pb-1 my-7 text-sm py-1 px-1"
							name="url"
							placeholder="http://"
							type="url"
						/>
						<div className="flex space-x-4">
							<button
								className="block bg-blue-800 px-2 py-1 rounded text-white"
								type="submit"
							>
								Add link →
							</button>
							<button
								className="block border border-gray-700 px-2 py-0.5 rounded text-gray-800"
								onClick={() => setModal(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</Dialog>
			<div className="flex justify-between">
				<h1 className="text-xl text-gray-800 font-semibold">{name}</h1>
				<button
					className="bg-blue-700 px-2 py-1 text-gray-100 rounded"
					onClick={() => setModal(true)}
				>
					Add new +
				</button>
			</div>
			<div className="grid grid-cols-3 gap-6 grid-flow-col w-full my-8">
				{links.map((link) => (
					<article
						className=" pb-4 shadow-md border border-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
						key={link._id}
					>
						{link.metadata.image ? (
							<div className="w-full">
								<img
									className="object-cover w-full h-[170px] overflow-hidden"
									src={link.metadata.image}
									loading="lazy"
									alt=""
								/>
							</div>
						) : (
							<img
								className="object-cover w-full h-[170px] overflow-hidden"
								src="https://placeimg.com/640/480/tech"
								alt=""
							/>
						)}
						<h1 className="text-sm font-semibold truncate mt-2 px-3">
							{link.metadata.title}
						</h1>
						<p className="px-3 text-sm text-blue-700 mt-1 ">
							{link.url.split("/")[2]}
						</p>
						<p className="px-3 text-sm text-gray-700 mt-2 truncate">
							{link.metadata.description ? (
								link.metadata.description
							) : (
								<span className="italic">No Description</span>
							)}
						</p>
						<button
							className="px-3 flex mt-1 justify-end w-full text-red-400"
							onClick={() => deleteLink(link._id)}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</article>
				))}
			</div>
		</div>
	);
};

export default Collection;
