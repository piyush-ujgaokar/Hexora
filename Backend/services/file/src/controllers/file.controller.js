import fileModel from "../models/file.model.js";
import { buildTree } from "../utils/buildTree.js";

export const createRootFolder = async (req, res) => {
  try {
    const { projectId, projectName } = req.body;

    const userId = req.headers["x-user-id"];

    if (!projectId || !projectName) {
      res.status(400).json({
        message: "Project name and ProjectId is required !",
      });
    }

    const existingRootFolder = await fileModel.findOne({
      projectId,
      parentId: null,
      isDeleted: false,
    });

    if (existingRootFolder) {
      return res.status(400).json({
        message: "Root Folder Already file",
      });
    }

    const rootFolder = await fileModel.create({
      owner: userId,
      name: projectName,
      projectId,
      type: "folder",
      parentId: null,
    });

    return res.status(201).json({
      message: "Root folder created Successfully",
      rootFolder,
    });
  } catch (error) {
    return res.status(500).json({
      message: `error in CreateRootFolder controller ${error}`,
    });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { projectId, name, parentId } = req.body;

    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(404).json({
        message: "userid not found",
      });
    }

    if (!projectId || !name || !parentId) {
      return res.status(400).json({
        message: "ParentId Or projectId or name are Missing",
      });
    }

    const exists = await fileModel.findOne({
      projectId,
      parentId,
      name,
      isDeleted: false,
    });

    if (exists) {
      return res.status(400).json({
        message: "Folder Already Exists",
      });
    }

    const folder = await fileModel.create({
      owner: userId,
      parentId,
      name,
      projectId,
      type: "folder",
    });

    return res.status(201).json({
      message: "Folder created Successfully",
      folder,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in CreateFolder controller ${error}" });
  }
};

export const createFile = async (req, res) => {
  try {
    const {
      projectId,
      name,
      parentId,
      content = "",
      language = "plaintext",
    } = req.body;

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(404).json({
        message: "userid not found",
      });
    }

    if (!projectId || !name || !parentId) {
      return res.status(400).json({
        message: "ParentId Or projectId or name are Missing",
      });
    }

    const exists = await fileModel.findOne({
      parentId,
      name,
      projectId,
      isDeleted: false,
    });

    if (exists) {
      return res.status(400).json({
        message: "File Already Exists",
      });
    }

    const extension = name.includes(".") ? name.split(".").pop() : "";

    const file = await fileModel.create({
      parentId,
      name,
      type: "file",
      language,
      extension,
      content,
      size: content.length,
      projectId: parentId || null,
    });

    return res.status(201).json({
      message: "File created Successfully",
      file,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in CreateFile controller ${error}" });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { name, content } = req.body;

    const userId = req.headers["x-user-id"];

    const file = await fileModel.findOne({
      owner: userId,
      _id: req.params.id,
      isDeleted: false,
    });

    if (!file) {
      return res.status(404).json({
        message: "File Not found ",
      });
    }

    if (name) {
      file.name = name;
      const extension = name.includes(".") ? name.split(".").pop() : "";
    }

    if (content !== "undefined") {
      ((file.content = content), (file.size = content.length));
    }

    await file.save();

    return res.status(200).json({
      message: "File update Successfully",
      file,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in updateFile controller ${error}" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const file = await fileModel.findByIdAndDelete(req.params.id, {
      isDeleted: true,
    });

    return res.status(200).json({
      message: "File Delete Successfully",
      file,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in deleteFile controller ${error}" });
  }
};

export const getFile = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    const file = await fileModel.findOne({
      owner: userId,
      _id: req.params.id,
      isDeleted: false,
    });

    if (!file) {
      return res.status(404).json({
        message: "File Not found ",
      });
    }

    return res.status(200).json({
      message: "Get File Successfully",
      file,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in GetFile controller ${error}" });
  }
};
export const getTree = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { projectId } = req.params;
    const files = await fileModel
      .findOne({
        projectId,
        owner: userId,
        isDeleted: false,
      })
      .sort({
        name: 1,
        type: -1,
      });

    const tree = await buildTree(files);

    if (!tree) {
      return res.status(404).json({
        message: "tree Not found ",
      });
    }

    return res.status(200).json({
      message: "Get Tree Successfully",
      tree,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in GetTree controller ${error}" });
  }
};
