import { axiosInstance } from "../../utils/axiosInstance";

export const me = async () => {
  const { data } = await axiosInstance.get("/api/me");
  return data;
};