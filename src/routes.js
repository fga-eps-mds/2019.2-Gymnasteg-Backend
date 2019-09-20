import { Router } from "express";
import JudgeManagement from "./app/controllers/JudgeManagement";
import SessionController from "./app/controllers/SessionController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello Word" });
});

routes.post("/createJudge", JudgeManagement.create);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", JudgeManagement.update);

export default routes;
