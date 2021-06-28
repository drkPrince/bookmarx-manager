import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCtx } from "../../ctx";
//MUI
import {
	IconButton,
	Button,
	TextField,
	Input,
	InputAdornment,
} from "@material-ui/core";

//Icons
import DeleteIcon from "@material-ui/icons/Delete";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";
import SearchIcon from "@material-ui/icons/Search";

import { addNewLink } from "../../utils/helpers";
import LinkCard from "../../components/LinkCard";
import Modal from "../../components/Modal";

const Collection = (props) => {
	const router = useRouter();
	const { collections } = useCtx();
	const { collectionID } = router.query;
	const currentCollection = collections.find((x) => x._id === collectionID);
	console.log(currentCollection);
	const [links, setLinks] = useState([]);
	const [queryResults, setQueryResults] = useState([]);
	const [query, setQuery] = useState("");
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

	useEffect(() => {
		if (query !== "") {
			const filtered = links.filter(
				(link) =>
					link.metadata.title
						.toLowerCase()
						.includes(query.toLowerCase()) ||
					link.metadata.description
						.toLowerCase()
						.includes(query.toLowerCase())
			);
			setQueryResults(filtered);
		}
	}, [links, query]);

	return (
		<div className="px-8 py-4 w-full">
			<Head>
				<title>{currentCollection?.name} | BookmarX</title>
			</Head>
			<Modal setModal={setModal} modal={modal}>
				<form
					onSubmit={(e) =>
						addNewLink(e, setModal, collectionID, setLinks)
					}
				>
					<h2 className="text-2xl text-gray-800">Add a new Link</h2>
					<Input
						className="w-full  pb-1 my-7 text-sm py-1 px-1"
						fullWidth
						placeholder="http://"
						type="url"
						name="url"
					/>

					<div className="flex space-x-4">
						<Button
							variant="contained"
							type="submit"
							color="primary"
							endIcon={<ArrowRightAltOutlinedIcon />}
						>
							Add link
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							onClick={() => setModal(false)}
						>
							Cancel
						</Button>
					</div>
				</form>
			</Modal>
			<div className="flex justify-between">
				<input
					className="text-gray-700 text-2xl font-semibold outline-none focus:border-gray-700 focus:border-b"
					defaultValue={currentCollection?.name}
				/>
				<div className="flex space-x-4">
					<Input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="text-sm py-1 px-1"
						placeholder="Search"
						type="search"
						startAdornment={
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						}
					/>
					<Button
						onClick={() => setModal(true)}
						variant="contained"
						color="primary"
						size="small"
						startIcon={<AddOutlinedIcon fontSize="small" />}
					>
						Add new
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 w-full my-8">
				{query.length > 0
					? queryResults.map((link) => (
							<LinkCard
								key={link._id}
								link={link}
								setLinks={setLinks}
							/>
					  ))
					: links.map((link) => (
							<LinkCard
								key={link._id}
								link={link}
								setLinks={setLinks}
							/>
					  ))}
			</div>
		</div>
	);
};

export default Collection;
