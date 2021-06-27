import { IconButton, Menu, MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useState } from "react";
import { deleteLink } from "../utils/helpers";

const LinkCard = ({ link, setLinks }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [menu, setMenu] = useState(false);

	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<article className=" pb-4 shadow-md border border-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
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
				<IconButton size="small">
					<MoreVertIcon
						color="primary"
						fontSize="small"
						onClick={handleOpen}
					/>
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
				<MenuItem onClick={handleClose}>Edit</MenuItem>
			</Menu>
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
