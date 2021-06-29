import { useState } from "react";
import Link from "next/link";

import {
	IconButton,
	Button,
	Menu,
	Input,
	MenuItem,
	ListItem,
} from "@material-ui/core";

import Modal from "../components/Modal";

import { deleteCollection } from "../utils/helpers";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";

const NavItem = ({ col, isHighlighted, setCollections, goHome }) => {
	const [renameModal, setRenameModal] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = (e) => setAnchorEl(e.currentTarget);
	const closeMenu = () => setAnchorEl(null);

	const deleteCol = (id) => {
		closeMenu();
		deleteCollection(id, setCollections);
		goHome();
	};

	const openRenameModal = () => {
		closeMenu();
		setRenameModal(true);
	};

	const changeCollectionName = async (e, cid) => {
		e.preventDefault();
		setRenameModal(false);
		setCollections((collections) => {
			const theCol = collections.find((c) => c._id === cid);
			theCol.name = e.target.elements.name.value;
			const rest = collections.filter((c) => c._id !== cid);
			return [...rest, theCol];
		});
		await axios.put("/api/collection", {
			collectionID: cid,
			newName: e.target.elements.name.value,
		});
	};

	return (
		<ListItem
			name={col.name}
			button
			className="flex justify-between"
			selected={isHighlighted}
			key={col._id}
		>
			<Link href={`/collection/${col._id}`}>
				<span className="w-full block text-sm">{col.name}</span>
			</Link>
			<IconButton
				aria-controls="simple-menu"
				aria-haspopup="true"
				onClick={openMenu}
				size="small"
			>
				<MoreVertIcon color="inherit" fontSize="small" />
			</IconButton>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={closeMenu}
			>
				<MenuItem onClick={() => deleteCol(col._id)}>Delete</MenuItem>
				<MenuItem onClick={openRenameModal}>Rename</MenuItem>
			</Menu>
			<Modal
				className="z-50"
				setModal={setRenameModal}
				modal={renameModal}
			>
				<form onSubmit={(e) => changeCollectionName(e, col._id)}>
					<label className="text-2xl" htmlFor="name">
						Rename Collection
					</label>
					<Input
						className="w-full pb-1 my-7 text-sm py-1 px-1"
						fullWidth
						placeholder="New Collection name"
						type="text"
						name="name"
					/>

					<Button
						variant="contained"
						type="submit"
						color="primary"
						endIcon={<ArrowRightAltOutlinedIcon />}
					>
						Rename
					</Button>
				</form>
			</Modal>
		</ListItem>
	);
};

export default NavItem;
