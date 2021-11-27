import useSWR from "swr";
import axios from "axios";
import { useSession } from "next-auth/client";

const getCollections = async (url) => {
  const { data } = await axios.get(url);
  return data.data;
};

const useCollections = (userID) => {
  const [session, loading] = useSession();
  const { data, error } = useSWR(
    `/api/collection?user=${userID}`,
    getCollections
  );
  return data;
};

export default useCollections;
