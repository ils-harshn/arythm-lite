import { useInfiniteQuery } from "react-query";
import { getSongs } from "./queryFunctions";
import COMMON_CONFIG from "../common_config";
import QUERY_KEYS from "../query_keys";

export const useGetSongs = (payload = {}, config = {}) =>
  useInfiniteQuery({
    queryFn: ({ pageParam = 0 }) => {
      return getSongs(payload, pageParam);
    },
    queryKey: [QUERY_KEYS.GET_SONGS, payload],
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0
        ? pages.reduce((sum, arr) => sum + arr.length, 0)
        : undefined;
    },
    ...COMMON_CONFIG,
    ...config,
  });
