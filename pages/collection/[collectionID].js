import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import NProgress from "nprogress";
import { useCtx } from "../../ctx";

//MUI
import {
  IconButton,
  Button,
  TextField,
  Input,
  InputAdornment,
} from "@material-ui/core";

//Icons
import DeleteIcon from "@material-ui/icons/Delete";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";
import SearchIcon from "@material-ui/icons/Search";

import { addNewLink } from "../../utils/helpers";
import LinkCard from "../../components/LinkCard";
import Modal from "../../components/Modal";

const Collection = (props) => {
  const router = useRouter();
  const [addingLink, setAddingLink] = useState(false);
  const { collections } = useCtx();
  const { collectionID } = router.query;
  const collectionName = collections?.find((c) => c._id === collectionID)?.name;
  const [links, setLinks] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (collectionID) {
        setBusy(true);
        NProgress.start();
        const res = await axios.get(`/api/link?collectionID=${collectionID}`);
        setLinks(res.data.data);
        setBusy(false);
        NProgress.done();
      }
    })();
  }, [collectionID]);

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

  const Grid = () => {
    return query.length > 0
      ? queryResults.map((link) => (
          <LinkCard key={link._id} link={link} setLinks={setLinks} />
        ))
      : links.map((link) => (
          <LinkCard key={link._id} link={link} setLinks={setLinks} />
        ));
  };

  return (
    <div className="w-full px-8 py-7">
      <Head>
        <title>{collectionName} | BookmarX</title>
      </Head>
      <Modal setModal={setModal} modal={modal}>
        <form
          onSubmit={(e) =>
            addNewLink(e, setModal, collectionID, setLinks, setError, setBusy)
          }
        >
          <h2 className="text-2xl text-gray-800">Add a new Link</h2>
          {error && <p className="text-red-600">{error}</p>}
          <Input
            className="w-full px-1 py-1 pb-1 text-sm my-7"
            fullWidth
            error={error}
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
      {busy ? (
        <div className="spin" />
      ) : links.length > 0 ? (
        <div className="grid w-full grid-cols-1 my-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:my-12">
          <Grid />
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
