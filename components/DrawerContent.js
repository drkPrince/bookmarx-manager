import { useState, useEffect } from "react";
import Link from "next/link";
import {
	IconButton,
	Button,
	Menu,
	Input,
	MenuItem,
	List,
	ListItem,
	Divider,
	Avatar,
} from "@material-ui/core";
import Modal from "../components/Modal";

import DeleteIcon from "@material-ui/icons/Delete";
import InboxIcon from "@material-ui/icons/Inbox";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";

import {
	getCollections,
	addNewCollection,
	deleteCollection,
} from "../utils/helpers";

import { useCtx } from "../ctx.js";

const DrawerContent = ({ router, signOut, session, loading }) => {
	const { setCollections, collections } = useCtx();
	const [menu, setMenu] = useState(false);
	const [modal, setModal] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const handleOpen = (event) => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	useEffect(() => {
		if (!loading && session?.user) {
			getCollections(session.user.userID, setCollections);
		}
	}, [session, loading]);

	const deleteCol = (id) => {
		deleteCollection(id, setCollections);
		handleClose();
	};

	const ListItemLink = (props) => {
		return (
			<ListItem {...props} className="flex">
				<Link href={props.href}>
					<ListItemText primary={props.name} />
				</Link>
				<IconButton
					aria-controls="simple-menu"
					aria-haspopup="true"
					onClick={handleOpen}
					size="small"
				>
					<MoreVertIcon color="inherit" fontSize="small" />
				</IconButton>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem onClick={() => deleteCol(col._id)}>
						Delete
					</MenuItem>
				</Menu>
			</ListItem>
		);
	};

	return (
		<div className="pt-12">
			<div className="mb-5">
				<div className=" px-4 flex items-center">
					<AccountCircleRoundedIcon fontSize="large" />
					<h2 className="ml-1">Prince Kumar</h2>
				</div>
			</div>
			<div className="px-4 flex justify-between items-center">
				<h1 className="text-xs tracking-wider uppercase text-gray-700">
					Collections
				</h1>
				<IconButton
					size="small"
					onClick={() => setModal(true)}
					className="text-gray-600 text-2xl rounded"
				>
					<AddOutlinedIcon />
				</IconButton>
			</div>
			<Divider />
			{collections && (
				<List className="">
					{collections.map((col) => (
						<ListItem
							name={col.name}
							button
							className="flex justify-between"
							selected={
								router.query.collectionID === `${col._id}`
							}
							key={col._id}
						>
							<Link href={`/collection/${col._id}`}>
								<span className="w-full block text-sm">
									{col.name}
								</span>
							</Link>
							<IconButton
								aria-controls="simple-menu"
								aria-haspopup="true"
								onClick={handleOpen}
								size="small"
							>
								<MoreVertIcon
									color="inherit"
									fontSize="small"
								/>
							</IconButton>
							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}
							>
								<MenuItem onClick={() => deleteCol(col._id)}>
									Delete
								</MenuItem>
							</Menu>
						</ListItem>
					))}
				</List>
			)}
			<div className="absolute bottom-0 left-0 flex px-4 py-3 items-center">
				<Button className="flex" size="small" variant="outlined">
					<span>Logout</span>
				</Button>
			</div>

			<Modal className="z-50" setModal={setModal} modal={modal}>
				<form
					onSubmit={(e) =>
						addNewCollection(
							e,
							setModal,
							setCollections,
							session.user.userID
						)
					}
				>
					<label className="text-2xl" htmlFor="name">
						Add a new collection
					</label>
					<Input
						className="w-full pb-1 my-7 text-sm py-1 px-1"
						fullWidth
						placeholder="Collection name"
						type="text"
						name="name"
					/>

					<Button
						variant="contained"
						type="submit"
						color="primary"
						endIcon={<ArrowRightAltOutlinedIcon />}
					>
						Add
					</Button>
				</form>
			</Modal>
		</div>
	);
};

export default DrawerContent;

// <Link
// 								href={`/collection/${col._id}?name=${col.name}`}
// 								className="truncate text-xs"
// 							>
// 								{col.name}
// 							</Link>
