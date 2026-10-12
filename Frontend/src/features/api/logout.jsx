import { axiosInstance } from "../../utils/axiosInstance";

export const logout = async () => {
  try {
    const { data } = await axiosInstance.get(`/api/auth/logout`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
