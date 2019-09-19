import { Router } from "express";
import JudgeManagement from "./app/controllers/JudgeManagement";
import SessionController from "./app/controllers/SessionController";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello Word" });
});

routes.post("/createJudge", JudgeManagement.create);
routes.post("/sessions", SessionController.store);

export default routes;
