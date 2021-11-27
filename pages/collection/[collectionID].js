import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

//MUI
import { Button, Input, InputAdornment } from "@material-ui/core";

//Icons
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";
import SearchIcon from "@material-ui/icons/Search";

import LinkCard from "../../components/LinkCard";
import Modal from "../../components/Modal";
import { useSWRConfig } from "swr";
import useCollections from "../../utils/useCollections";
import useLinks from "../../utils/useLinks";

const Collection = (props) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { collectionID } = router.query;

  const collections = useCollections(props.session.user.userID);
  const links = useLinks(collectionID);

  const collectionName =
    collections && collections.find((c) => c._id === collectionID).name;

  const [queryResults, setQueryResults] = useState([]);
  const [query, setQuery] = useState("");
  const [addLinkError, setAddLinkError] = useState(null);
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const addNewLink = async (e) => {
    e.preventDefault();
    setBusy(true);
    setAddLinkError(null);
    try {
      await axios.post("/api/link", {
        url: e.target.elements.url.value,
        collectionID,
      });
      await mutate(`/api/link?collectionID=${collectionID}`);
      setBusy(false);
      setModal(false);
    } catch (e) {
      setBusy(false);
      setAddLinkError("The URL appears to be invalid.");
    }
  };

  useEffect(() => {
    if (query !== "") {
      const filtered = links.filter(
        (link) =>
          link.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
          link.metadata.description.toLowerCase().includes(query.toLowerCase())
      );
      setQueryResults(filtered);
    }
  }, [links, query]);

  const LinkGrid = () => {
    return query.length > 0
      ? queryResults.map((link) => (
          <LinkCard collections={collections} key={link._id} link={link} />
        ))
      : links.map((link) => (
          <LinkCard collections={collections} key={link._id} link={link} />
        ));
  };

  return (
    <div className="w-full px-4 py-7">
      <Head>
        <title> {collectionName} | BookmarX</title>
      </Head>
      <Modal setModal={setModal} modal={modal}>
        <form onSubmit={addNewLink}>
          <h2 className="text-2xl text-gray-800">Add a new Link</h2>
          {addLinkError && (
            <p className="text-sm text-red-600">{addLinkError}</p>
          )}
          <Input
            className="w-full px-1 py-1 pb-1 text-sm my-7"
            fullWidth
            error={Boolean(addLinkError)}
            placeholder="http://"
            type="url"
            name="url"
          />

          <Button
            variant="contained"
            type="submit"
            disabled={busy}
            color="primary"
            endIcon={<ArrowRightAltOutlinedIcon />}
          >
            Add link
          </Button>
        </form>
      </Modal>
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold text-left text-gray-700">
          {collectionName}
        </h2>
        <div className="flex flex-col mt-5 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:mt-0">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-1 py-1 text-sm"
            placeholder="Search"
            type="search"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
          <div className="flex justify-end">
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
      </div>
      {links && links.length > 0 ? (
        <div className="grid w-full grid-cols-1 my-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:my-12">
          <LinkGrid />
        </div>
      ) : (
        <div className="flex justify-center w-full mt-16">
          <div>
            <p className="text-center text-gray-600">
              It's all empty here. Maybe add something?
            </p>
            <div className="w-1/3 mx-auto">
              <img src="/empty.png" alt="its all empty" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
