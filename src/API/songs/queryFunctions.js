import api from "..";
import ENDPOINTS from "../endpoints";

export const getSongs = async (payload, pageParam) => {
  const response = await api({
    method: "get",
    url: ENDPOINTS.GET_SONGS,
    params: {
      offset: pageParam,
      limit: 10,
      original_name: payload?.original_name || "",
      album_title: payload?.album_title || "",
      album_code: payload?.album_code || "",
      genre_name: payload?.genre_name || "",
      artist_name: payload?.artist_name || "",
    },
  });

  return response.data;
};
