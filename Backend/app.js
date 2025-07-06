import "dotenv/config";
import express from "express";
import { db } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: [
        "POST", "GET", "PUT", "DELETE"
    ]
}));

db()
    .then(() => {
        console.log("DB Connected!");
    })
    .catch((err) => {
        console.error(`Error: DB not connected - ${err.message}`);
        process.exit(1); // exit process if db connection fails
    });

// import routes
import userRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js"

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
