import { axiosInstance } from "../../utils/axiosInstance";

export const createProject = async ({name,description}) => {
  try {
    const { data } = await axiosInstance.post("/api/project",{
        name,description
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};


export const getProjects = async () => {
  try {
    const { data } = await axiosInstance.get("/api/project");
    return data.project;
  } catch (error) {
    console.log(error);
  }
};

export const getProjectById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/project/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getStarredProjects = async () => {
  try {
    const { data } = await axiosInstance.get("/api/project/starred");
    return data.project;
  } catch (error) {
    console.log(error);
  }
};


export const toggleStar = async (id) => {
  try {
    const { data } = await axiosInstance.patch(`/api/project/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProject = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/api/project/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};