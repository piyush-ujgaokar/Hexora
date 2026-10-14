import { axiosInstance } from "../../utils/axiosInstance";

export const createRootFolder = async ({projectId,projectName}) => {
  try {
    const { data } = await axiosInstance.post("/api/file/create-root-folder",{
        projectId,projectName
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createFolder = async ({projectId,parentId,name}) => {
  try {
    const { data } = await axiosInstance.post("/api/file/create-folder",{
        projectId,parentId,name
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createFile = async ({projectId,parentId,name,content="",language="plaintext"}) => {
  try {
    const { data } = await axiosInstance.post("/api/file/create-file",{
        projectId,parentId,name,content,language
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateFile = async ({name,content="",id}) => {
  try {
    const { data } = await axiosInstance.post(`/api/file/update/${id}`,{
        name,content
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/api/file/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getFile = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/file/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getTree = async (projectId) => {
  try {
    const { data } = await axiosInstance.get(`/api/file/tree/${projectId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};


