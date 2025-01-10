// Import express and express-session
import express from "express";
import session from "express-session";

// Import routers
import tagRouter from "./router/tag-router";
import userRouter from "./router/user-router";
import pageRouter from "./router/page-router";
import authRouter from "./router/auth-router";
import commentRouter from "./router/comment-router";
import permissionRouter from "./router/permission-router";


var passport = require("passport");
var path = require("path");

//Used to store session data. Since this should not be sent in plain text to our mysql database.
var SQLiteStore = require("connect-sqlite3")(session);
/**
 * Express application.
 */
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

// Since API is not compatible with v1, API version is increased to v2
// Added routes for all routers based on our setup

app.use("/api/v2/tags", tagRouter);
app.use("/api/v2/users", userRouter);
app.use("/api/v2/pages", pageRouter);
app.use("/api/v2/comments", commentRouter);
app.use("/api/v2/permissions", permissionRouter);
app.use("/api/v2/", authRouter);

export default app;
