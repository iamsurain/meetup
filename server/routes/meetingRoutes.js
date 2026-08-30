import express from "express";
import { protect } from "../Middleware/auth.js";
import { createMeeting, getMeeting, getMeetingStats, getSessionDetails, getUsersSessions } from "../Controllers/meetingContoller";

const meetingRouter = express.Router();

meetingRouter.post("/", protect, createMeeting);
meetingRouter.get("/stats", protect, getMeetingStats);
meetingRouter.get("/sessions", protect, getUsersSessions);
meetingRouter.get("/sessions/:id", protect, getSessionDetails);
meetingRouter.get("/:meetingId", protect, getMeeting);

export default meetingRouter;