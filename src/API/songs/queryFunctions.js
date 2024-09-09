import api from "..";
import ENDPOINTS from "../endpoints";

export const getSongs = async (payload, pageParam) => {
  const response = await api({
    method: "get",
    url: ENDPOINTS.GET_SONGS,
    params: {
      offset: pageParam,
      limit: 10,
    },
  });

  return response.data;
};
