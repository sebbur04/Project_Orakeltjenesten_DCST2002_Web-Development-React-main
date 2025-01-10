// Import express and crypto
import express from "express";
import crypto from "crypto";

// Import services
import { User } from "../service/user-service";
import permissionService from "../service/permission-service";
import userService from "../service/user-service";

var passport = require("passport");
var LocalStrategy = require("passport-local");

/**
 * Express router containing task methods.
 */
const authRouter = express.Router();

//Passport for local login
passport.use(
  new LocalStrategy(async function verify(
    username: string,
    password: string,
    cb: any
  ) {
    try {
      const user = await userService.getUserFromUsername(username);

      if (!user) {
        return cb(null, false, { message: "Incorrect username or password" });
      }

      //This is a hashed password stored in the database, so we need to check if the hashed input password is the same.
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        (error, hashedPassword) => {
          if (error) return error;

          if (!crypto.timingSafeEqual(user.hashedPassword, hashedPassword)) {
            return cb(null, false, {
              message: "Incorrect username or password",
            });
          } else {
            return cb(null, user);
          }
        }
      );
    } catch (error) {
      return cb(error);
    }
  })
);

//Serializes the user
passport.serializeUser(function (user: User, cb: any) {
  process.nextTick(function () {
    cb(null, {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      permid: user.permid,
    });
  });
});

//Deserializes the user
passport.deserializeUser(function (user: User, cb: any) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Logs in the user with username
authRouter.post("/login/password", (req, res) => {
  passport.authenticate("local", (error: Error, user: User) => {
    if (error) {
      return res.status(500).send({ success: false, error: error });
    }
    if (!user) {
      // Authentication failed; no session should be created
      return res
        .status(401)
        .send({ success: false, message: "Incorrect username or password." });
    }

    // Successful authentication, now log the user in
    //@ts-ignore
    req.logIn(user, (error: Error) => {
      if (error) {
        return res.status(500).send({ success: false, error: error });
      }
      // Now the session is created only after successful login
      return res
        .status(200)
        .send({ success: true, message: "Login successful.", user });
    });
  })(req, res);
});

//Logs out the user
authRouter.post("/logout", function (req, res, next) {
  //@ts-ignore
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err); // handle error, e.g., log it or show an error page
      }
      res.clearCookie("connect.sid"); // Clear the cookie
      res.redirect("/"); // Redirect after logout
    });
  });
});

//Creates a new user
authRouter.post("/signup", async (request, response) => {
  const data = request.body;

  try {
    const checkForUser = await userService.getUsername(data.username);

    if (checkForUser) {
      return response.status(666).send(new Error("User already exists"));
    }

    const permId = await permissionService.createPermission();
    const inputId = await userService.createUser(
      data.username,
      data.password,
      permId
    );

    return response.send({ id: inputId });
  } catch (error) {
    response.status(500).send(error);
  }
});

export default authRouter;
