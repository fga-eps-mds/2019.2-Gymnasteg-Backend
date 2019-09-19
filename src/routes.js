import { Router } from "express";
import JudgeManagement from "./app/controllers/JudgeManagement";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello Word" });
});

routes.post("/createJudge", JudgeManagement.create);

export default routes;
