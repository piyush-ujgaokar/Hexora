import redis from "../../../../shared/redis/redis.js";
import projectModel from "../models/project.model.js";

export const createProject = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        message: "UserId is Required",
      });
    }

    const { name, description } = req.body;

    const project = await projectModel.create({
      owner: userId,
      name: name,
      description: description,
    });

    const key=`projects-${userId}`

    await redis.del(key)

    res.status(201).json({
      message: "Project created Successfully",
      project: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in Create project controller ${error}`,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        message: "UserId is Required",
      });
    }

    const key=`projects-${userId}`
    let result=await redis.get(key)
    if(result){
        return   res.status(200).json({
      project: JSON.parse(result),
    });
    }

    const projects = await projectModel
      .find({
        owner: userId,
      })
      .sort({ updatedAt: -1 });

    await redis.set(key,JSON.stringify(projects))

    res.status(200).json({
      project: projects,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Error in get projects controller ${error}`,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await projectModel.findById(id);
    if (!project) {
      return res.status(404).json({
        message: "Project not Found",
      });
    }
    project.lastOpenedAt = new Date();
    await project.save();

    res.status(200).json({
      message: "Project By id fetched Successfully",
      project: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in getProjectById controller ${error}`,
    });
  }
};

export const getStarredProjects = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        message: "userid is Required",
      });
    }

    const key=`starred-projects-${userId}`
    const result=await redis.get(key)

    if(result){
      return res.status(200).json({
        project: JSON.parse(result),
      });
    }

    const projects = await projectModel
      .find({
        owner: userId,
        starred: true,
      })
      .sort({ updatedAt: -1 });

    await redis.set(key,JSON.stringify(projects))

    res.status(200).json({
      project: projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in getStarredProjects controller ${error}`,
    });
  }
};

export const toggleStar = async (req, res) => {
  try {

    const { id } = req.params;
      const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        message: "userid is Required",
      });
    }

    const project = await projectModel.findById(id);
    if (!project) {
      return res.status(404).json({
        message: "Project not Found",
      });
    }
    project.starred = !project.starred;
    await project.save();
  const key=`starred-projects-${userId}`
    await redis.del(key)
    await redis.del(`projects-${userId}`)

    return res.status(200).json({
      message: "Project Starred Toggled Successfully",
      project: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in toggleStar controller ${error}`,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {

    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        message: "userid is Required",
      });
    }

    const project = await projectModel.findByIdAndDelete(id);

    const key=`projects-${userId}`
    await redis.del(key)
    await redis.del(`starred-projects-${userId}`)

    if (!project) {
      return res.status(404).json({
        message: "Project not Found",
      });
    }

    return res.status(200).json({
      message: "Project Deleted Successfully",
      project: project,
    });
  } catch (error) {
     return res.status(500).json({
      message: `Error in deleteProject controller ${error}`,
    });

  }
};
