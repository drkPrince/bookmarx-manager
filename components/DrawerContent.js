import Link from "next/link";
import { IconButton, Button, Menu, MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useState } from "react";

const DrawerContent = ({
	setModal,
	collections,
	setCollections,
	router,
	signOut,
}) => {
	const [menu, setMenu] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className="pt-12 ">
			<Button onClick={signOut}>Sign out</Button>
			<div className="px-2 flex justify-between items-center">
				<h1 className="text-xs tracking-wider uppercase   text-gray-700">
					Collections
				</h1>
				<IconButton
					onClick={() => setModal(true)}
					className="text-gray-600 text-2xl rounded"
				>
					<AddOutlinedIcon />
				</IconButton>
			</div>

			{collections && (
				<div className="mt-5">
					{collections.map((col) => (
						<div
							key={col._id}
							className={
								router.query.collectionID === `${col._id}`
									? "text-blue-50  flex justify-between  items-center bg-blue-600 py-1 pl-2"
									: "text-gray-800 hover:text-blue-800 flex justify-between  items-center py-1 pl-2 hover:bg-blue-50"
							}
						>
							<Link
								href={`/collection/${col._id}?name=${col.name}`}
								className="truncate text-xs"
							>
								{col.name}
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
								<MenuItem onClick={handleClose}>
									Delete
								</MenuItem>
							</Menu>

							{/*<IconButton
								className="hidden"
								size="small"
								color="secondary"
								// onClick={() =>
								//     deleteCollection(col._id, setCollections)
								// }
							>
								<DeleteIcon />
							</IconButton>*/}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default DrawerContent;
