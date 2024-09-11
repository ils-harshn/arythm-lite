import { useQuery } from "react-query";
import { getStatus } from "./queryFunctions";
import COMMON_CONFIG from "../common_config";
import QUERY_KEYS from "../query_keys";

export const useGetStatus = (config = {}) =>
  useQuery({
    queryKey: [QUERY_KEYS.STATUS],
    queryFn: getStatus,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...COMMON_CONFIG,
    ...config,
  });
