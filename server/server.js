import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser";
import { initDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { handleClerkWebhook } from "./Controllers/webhookController.js";
import meetingRouter from "./routes/meetingRoutes.js";

const app = express();

// Connect to Neon & initialize tables
await initDB()

const allowedOrigins = process.env.ORIGINS.split(",")
app.use(cors({origin: "", credentials: true}))
app.use(cookieParser())


app.use("/api/clerk", express.raw({type: "application/json"}), handleClerkWebhook)
app.use(express.json())
app.use(clerkMiddleware())

app.get("/", (req, res)=> res.send("API is live!"))
app.use("/api/meetings", meetingRouter)

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})