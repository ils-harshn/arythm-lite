import api from "..";
import ENDPOINTS from "../endpoints";

export const getStatus = async () => {
  const response = await api({
    method: "get",
    url: ENDPOINTS.STATUS,
  });
  return response.data;
};
