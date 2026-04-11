import { Router } from "express";
import { answersRouter } from "./answers.js";
import { analyzerRouter } from "./analyzer.js";
import { assessmentRouter } from "./assessment.js";
import { authRouter } from "./auth.js";
import { companiesRouter } from "./companies.js";
import { creditsRouter } from "./credits.js";
import { mentorsRouter } from "./mentors.js";
import { questionsRouter } from "./questions.js";
import { sessionsRouter } from "./sessions.js";
import { usersRouter } from "./users.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "placementos-api" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/assessment", assessmentRouter);
apiRouter.use("/companies", companiesRouter);
apiRouter.use("/questions", questionsRouter);
apiRouter.use("/answers", answersRouter);
apiRouter.use("/mentors", mentorsRouter);
apiRouter.use("/sessions", sessionsRouter);
apiRouter.use("/analyzer", analyzerRouter);
apiRouter.use("/credits", creditsRouter);

