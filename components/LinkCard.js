import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const LinkCard = ({ link }) => {
	return (
		<article className=" pb-4 shadow-md border border-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
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
			<div className="flex justify-end">
				<IconButton
					onClick={() => deleteLink(link._id, setLinks)}
					aria-label="delete"
					color="secondary"
				>
					<DeleteIcon />
				</IconButton>
			</div>
		</article>
	);
};

export default LinkCard;
