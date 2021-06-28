import { useState } from "react";
import {
	IconButton,
	Menu,
	MenuItem,
	Input,
	Button,
	TextField,
	Select,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deleteLink } from "../utils/helpers";
import axios from "axios";
import { useCtx } from "../ctx";
import Modal from "./Modal";

const LinkCard = ({ link, setLinks }) => {
	const { collections } = useCtx();
	const [anchorEl, setAnchorEl] = useState(null);
	const [menu, setMenu] = useState(false);
	const [modal, setModal] = useState(false);

	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const openEditModal = () => {
		handleClose();
		setModal(true);
	};

	const updateLink = async (e) => {
		e.preventDefault();
		setModal(false);
		//first, change state
		if (e.target.elements.collectionID.value !== link.collectionID) {
			setLinks((links) => links.filter((l) => l._id !== link._id));
		} else {
			const theNewLink = {
				...link,
				metadata: {
					...link.metadata,
					title: e.target.elements.title.value,
					description: e.target.elements.description.value,
				},
			};
			setLinks((links) => {
				const rest = links.filter((l) => l._id !== link._id);
				return [...rest, theNewLink];
			});
		}
		//then, change DB
		await axios.put("/api/link", {
			title: e.target.elements.title.value,
			description: e.target.elements.description.value,
			collectionID: e.target.elements.collectionID.value,
			linkID: link._id,
		});
	};

	return (
		<article className="pb-4 shadow-md border border-gray-50 hover:shadow-xl transition-all duration-200 transform">
			{link.metadata.image ? (
				<div className="w-full">
					<img
						className="hidden sm:block object-cover w-full h-[150px] overflow-hidden"
						src={link.metadata.image}
						loading="lazy"
						alt=""
					/>
				</div>
			) : (
				<img
					className="hidden sm:block object-cover w-full h-[150px] overflow-hidden"
					src="https://placeimg.com/640/480/tech"
					alt=""
				/>
			)}
			<h1 className="text-sm font-semibold truncate mt-2 px-3">
				{link.metadata.title}
			</h1>
			<div className="flex justify-between items-center">
				<p className="px-3 text-sm text-blue-700 mt-1 ">
					{link.url.split("/")[2]}
				</p>
				<IconButton size="small" onClick={handleOpen}>
					<MoreVertIcon color="primary" fontSize="small" />
				</IconButton>
			</div>
			<p className="px-3 text-sm text-gray-600 mt-2 truncate">
				{link.metadata.description ? (
					link.metadata.description
				) : (
					<span className="italic">No Description</span>
				)}
			</p>

			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose}>Delete</MenuItem>
				<MenuItem onClick={openEditModal}>Edit</MenuItem>
			</Menu>
			<Modal modal={modal} setModal={setModal}>
				<form onSubmit={updateLink}>
					<label className="text-2xl" htmlFor="name">
						Edit link
					</label>

					<label
						className="block mt-7 text-sm text-gray-700"
						htmlFor="title"
					>
						Title:
					</label>
					<Input
						className="w-full pb-1 mt-1 text-sm py-1 px-1 text-gray-500"
						fullWidth
						type="text"
						defaultValue={link.metadata.title}
						name="title"
					/>

					<label
						className="block mt-7 text-sm text-gray-700"
						htmlFor="description"
					>
						Description:
					</label>

					<Input
						label="Description"
						className="w-full pb-1 mt-1 mb-6 text-sm py-1 px-1 text-gray-500 leading-loose"
						fullWidth
						multiline
						type="text"
						defaultValue={link.metadata.description}
						name="description"
					/>

					<Select
						className="w-full pb-1 mt-1 mb-6 text-sm py-1 px-1 text-gray-500"
						name="collectionID"
						defaultValue={link.collectionID}
					>
						{collections &&
							collections.map((x) => (
								<MenuItem key={x._id} value={x._id}>
									{x.name}
								</MenuItem>
							))}
					</Select>

					<Button variant="contained" type="submit" color="primary">
						Update
					</Button>
				</form>
			</Modal>
			{/*<div className="flex justify-end">
				<IconButton
					onClick={() => deleteLink(link._id, setLinks)}
					aria-label="delete"
					color="secondary"
				>
					<DeleteIcon />
				</IconButton>
			</div>*/}
		</article>
	);
};

export default LinkCard;
