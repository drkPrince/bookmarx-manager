import axios from "axios";
import useSWR from "swr";

const getLinks = async (url) => {
  const response = await axios.get(url);
  return response.data.data;
};

const useLinks = (collectionID) => {
  const { data, error } = useSWR(
    `/api/link?collectionID=${collectionID}`,
    getLinks
  );

  if (error) {
    return [];
  }
  return data;
};

export default useLinks;
