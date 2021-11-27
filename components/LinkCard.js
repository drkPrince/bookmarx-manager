import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Input,
  Button,
  Select,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { deleteLink } from "../utils/helpers";
import axios from "axios";
import Modal from "./Modal";
import { useSWRConfig } from "swr";

const LinkCard = ({ link, collections }) => {
  const { mutate } = useSWRConfig();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modal, setModal] = useState(false);
  const [warnModal, setWarnModal] = useState(false);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const openEditModal = () => {
    handleClose();
    setModal(true);
  };

  const openDeleteModal = () => {
    handleClose();
    setWarnModal(true);
  };

  const deleteLink = async (id) => {
    await axios.delete("/api/link", { data: { linkID: id } });
  };

  const deleteThisLink = async () => {
    await deleteLink(link._id);
    await mutate(`/api/link?collectionID=${link.collectionID}`);
  };

  const updateLink = async (e) => {
    e.preventDefault();
    setModal(false);
    await axios.put("/api/link", {
      title: e.target.elements.title.value,
      description: e.target.elements.description.value,
      collectionID: e.target.elements.collectionID.value,
      linkID: link._id,
    });
    await mutate(`/api/link?collectionID=${link.collectionID}`);
  };

  return (
    <article className="pb-4 transition-all duration-200 transform border shadow-md border-gray-50 hover:shadow-xl">
      {link.metadata.image ? (
        <div className="w-full">
          <a href={link.url} target="_blank">
            <img
              className="object-cover w-full h-[170px] md:h-[150px] overflow-hidden"
              src={link.metadata.image}
              loading="lazy"
              alt={link.metadata.title}
            />
          </a>
        </div>
      ) : (
        <img
          className="hidden sm:block object-cover w-full h-[150px] overflow-hidden"
          src="https://placeimg.com/640/480/tech"
          alt=""
        />
      )}
      <h1 className="px-3 mt-2 text-sm font-semibold truncate">
        {link.metadata.title}
      </h1>
      <div className="flex items-center justify-between">
        <p className="px-3 mt-1 text-sm text-blue-700 ">
          {link.url.split("/")[2]}
        </p>
        <IconButton size="small" onClick={handleOpen}>
          <MoreVertIcon color="primary" fontSize="small" />
        </IconButton>
      </div>
      <p className="px-3 mt-2 text-sm text-gray-600 truncate">
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
        <MenuItem onClick={openDeleteModal}>Delete</MenuItem>
        <MenuItem onClick={openEditModal}>Edit</MenuItem>
      </Menu>
      <Modal modal={modal} setModal={setModal}>
        <form onSubmit={updateLink}>
          <h2 className="text-2xl">Edit link</h2>
          <label className="block text-sm text-blue-600 mt-7" htmlFor="title">
            Title:
          </label>
          <Input
            className="px-1 py-1 pb-1 mt-1 text-sm text-gray-500"
            fullWidth
            type="text"
            defaultValue={link.metadata.title}
            name="title"
          />

          <label
            className="block text-sm text-blue-600 mt-7"
            htmlFor="description"
          >
            Description:
          </label>

          <Input
            label="Description"
            className="px-1 py-1 pb-1 mt-1 text-sm leading-loose text-gray-500"
            fullWidth
            multiline
            type="text"
            defaultValue={link.metadata.description}
            name="description"
          />

          <label
            className="block text-sm text-blue-600 mt-7"
            htmlFor="collectionID"
          >
            Collection
          </label>

          <Select
            className="w-full px-1 py-1 pb-1 mt-1 mb-6 text-sm text-gray-500"
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
      <Modal modal={warnModal} setModal={setWarnModal}>
        <div className="flex items-center mb-6">
          <ErrorOutlineIcon fontSize="large" />
          <h2 className="ml-4 text-2xl text-gray-800">
            Are you sure you want to delete this link?
          </h2>
        </div>
        <Button onClick={deleteThisLink} variant="contained" color="primary">
          Yes, Delete
        </Button>
      </Modal>
    </article>
  );
};

export default LinkCard;
