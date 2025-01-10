// Import express from express
import express from "express";

// Import commentService from service
import commentService from "../service/comment-service";

/**
 * Express router containing task methods.
 */
const commentRouter = express.Router();

//Retrieve all comments
commentRouter.get("/", async (_request, response) => {
  try {
    const result = await commentService.getAllComments();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Gets all comments from a specific page
commentRouter.get("/:pageid", async (request, response) => {
  const pageId = Number(request.params.pageid);
  try {
    const data = await commentService.getAllCommentsFromPage(pageId);

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

/*Makes a new comment, got help from copilot,
  struggled with argument for content not provided on
  await commentServer.createComment();
  */
commentRouter.post("/", async (request, response) => {
  const data = request.body.comment;
  if (!data.content) {
    return response.status(400).send({ error: "Content not provided" });
  }

  try {
    const commentId = await commentService.createComment(data);

    response.send({ id: commentId });
  } catch (error) {
    response.status(500).send(error);
  }
});

//Deletes a comment with specific commentid
commentRouter.delete("/:commentid", async (request, response) => {
  const data = Number(request.params.commentid);

  try {
    await commentService.deleteComment(data);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Updates a comment with specific commentid
commentRouter.patch("/:commentid", async (request, response) => {
  const comment = request.body.comment;

  try {
    await commentService.updateComment(comment);

    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(500).send(error);
  }
});

export default commentRouter;
