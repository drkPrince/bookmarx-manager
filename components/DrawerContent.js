import { useState } from "react";
import axios from "axios";
import {
  IconButton,
  Button,
  Input,
  List,
  Divider,
  Avatar,
} from "@material-ui/core";
import Modal from "../components/Modal";
import NavItem from "../components/NavItem";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";

import useCollections from "../utils/useCollections";
import { mutate } from "swr";
import NProgress from "nprogress";

const DrawerContent = ({
  router,
  setMobileOpen,
  signOut,
  session,
  loading,
}) => {
  const [modal, setModal] = useState(false);
  const collections = useCollections(session.user.userID);

  const addNewCollection = async (e) => {
    e.preventDefault();
    NProgress.start();
    setModal(false);
    const res = await axios.post("/api/collection", {
      name: e.target.elements.name.value,
      user: session.user.userID,
    });
    await mutate(`/api/collection?user=${session.user.userID}`);
    NProgress.done();
  };

  return (
    <div className="h-full pt-12 bg-gradient-to-b from-blue-50 to-pink-50">
      <div className="flex justify-center mb-6 text-md">
        <div className="text-center">
          <Avatar className="mx-auto mb-2">{session.user.name[0]}</Avatar>
          <p className="mb-1 text-gray-600">
            Welcome back,{" "}
            <span className="text-blue-600">{session.user.name}</span>{" "}
          </p>
          <Button
            size="small"
            onClick={async () => {
              await signOut({ redirect: false });
              router.replace("/");
            }}
          >
            <span className="text-gray-400">Logout</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4">
        <h1 className="text-xs tracking-wider text-gray-700 uppercase">
          Collections
        </h1>
        <IconButton
          size="small"
          onClick={() => {
            setMobileOpen(false);
            setModal(true);
          }}
          className="text-2xl text-gray-600 rounded"
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
              userID={session.user.userID}
              col={col}
              goToHome={() => router.replace("/")}
              isHighlighted={router.query.collectionID === `${col._id}`}
            />
          ))}
        </List>
      )}

      <Modal className="z-50" setModal={setModal} modal={modal}>
        <form onSubmit={addNewCollection}>
          <label className="text-2xl" htmlFor="name">
            Add a new collection
          </label>
          <Input
            className="w-full px-1 py-1 pb-1 text-sm my-7"
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
