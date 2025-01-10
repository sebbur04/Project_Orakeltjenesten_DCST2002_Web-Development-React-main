//Express import
import express from "express";

//Service import
import userService from "../service/user-service";

/**
 * Express router containing task methods.
 */
const userRouter = express.Router();

// Check if the user is authenticated
userRouter.get("/auth", (req, res) => {
  //@ts-ignore
  if (req.isAuthenticated()) {
    // Check if the user is authenticated
    //@ts-ignore
    return res.send({ user: req.user }); // Send the user's data
  } else {
    return res.status(401).send({ message: "User not authenticated" }); // Not logged in
  }
});

//Gets all users
userRouter.get("/", async (_request, response) => {
  try {
    const users = await userService.getAllUsers();

    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update username for a user with specific id
userRouter.patch("/:userid/edit/username", async (request, response) => {
  const userId = Number(request.params.userid);
  const username = request.body.username;

  try {
    const existingUser = await userService.getUsername(username);
    if (existingUser) {
      response.status(400).send(new Error("Username already exists"));
    }
    const user = await userService.updateUsername(userId, username);
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update password for a user with specific id
userRouter.patch("/:userid/edit/password", async (request, response) => {
  const userId = Number(request.params.userid);
  const password = request.body.password;

  try {
    const user = await userService.updatePassword(userId, password);
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update avatar for a user with specific id
userRouter.patch("/:userid/edit/avatar", async (request, response) => {
  const userId = Number(request.params.userid);
  const avatar = request.body.avatar;

  try {
    const user = await userService.updateUserAvatar(userId, avatar);
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update bio for a user with specific id
userRouter.patch("/:userid/edit/bio", async (request, response) => {
  const userId = Number(request.params.userid);
  const bio = request.body.bio;

  try {
    const data = await userService.updateUserBio(userId, bio);
    response.send({ id: data });
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update permission id for a user with specific id
userRouter.patch("/:userid/edit/permid", async (request, response) => {
  const user = request.body.user;

  try {
    const result = await userService.updateUserPermId(user);
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update user with specific id
userRouter.get("/:userid", async (request, response) => {
  const userId = Number(request.params.userid);
  try {
    const data = await userService.getUser(userId);

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Delete user with specific id
userRouter.delete("/:userid", async (request, response) => {
  const userId = Number(request.params.userid);

  try {
    await userService.deleteUser(userId);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Delete all comments made by a specific user
userRouter.delete("/:userid/comments", async (request, response) => {
  const userId = Number(request.params.userid);

  try {
    await userService.deleteUserComments(userId);

    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(500).send(error);
  }
});

export default userRouter;
