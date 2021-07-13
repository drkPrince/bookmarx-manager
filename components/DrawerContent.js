import { useState, useEffect } from "react";
import axios from "axios";
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
import NavItem from "../components/NavItem";
import DeleteIcon from "@material-ui/icons/Delete";
import InboxIcon from "@material-ui/icons/Inbox";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";

import { getCollections, addNewCollection } from "../utils/helpers";

import { useCtx } from "../ctx.js";

const DrawerContent = ({
	router,
	setMobileOpen,
	signOut,
	session,
	loading,
}) => {
	const { setCollections, collections } = useCtx();
	const [menu, setMenu] = useState(false);
	const [modal, setModal] = useState(false);

	useEffect(() => {
		if (!loading && session?.user) {
			getCollections(session.user.userID, setCollections);
		}
	}, [session, loading]);

	return (
		<div className="pt-12 h-full bg-gradient-to-b from-blue-50  to-pink-50">
			<div className="flex justify-center text-md mb-6">
				<div className="text-center">
					<Avatar className="mx-auto mb-2">
						{session.user.name[0]}
					</Avatar>
					<p className="mb-1 text-gray-600">
						Welcome back,{" "}
						<span className="text-blue-600">
							{session.user.name}
						</span>{" "}
					</p>
					<Button
						size="small"
						onClick={() => {
							router.replace("/");
							signOut({ redirect: false });
						}}
					>
						<span className="text-gray-400">Logout</span>
					</Button>
				</div>
			</div>

			<div className="px-4 flex justify-between items-center">
				<h1 className="text-xs tracking-wider uppercase text-gray-700">
					Collections
				</h1>
				<IconButton
					size="small"
					onClick={() => {
						setMobileOpen(false);
						setModal(true);
					}}
					className="text-gray-600 text-2xl rounded"
				>
					<AddOutlinedIcon />
				</IconButton>
			</div>
			<Divider />
			{collections && (
				<List>
					{collections.map((col) => (
						<NavItem
							key={col._id}
							setMobileOpen={setMobileOpen}
							col={col}
							setCollections={setCollections}
							goToHome={() => router.replace("/")}
							isHighlighted={
								router.query.collectionID === `${col._id}`
							}
						/>
					))}
				</List>
			)}

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
