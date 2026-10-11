import redis from "../../../shared/redis/redis.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const result = await redis.get(`session-${sessionId}`);

    if (!sessionId) {
      return res.status(401).json({
        message: "Session Not Found",
      });
    }
    const data = JSON.parse(result);

    req.user = data;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error in AuthMiddleware ${error}` });
  }
};
