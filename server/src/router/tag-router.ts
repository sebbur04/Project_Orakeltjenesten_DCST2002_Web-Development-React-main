//Express import
import express from "express";

//Service imports
import tagService from "../service/tag-service";
import pageService from "../service/page-service";
import pageTagsService from "../service/page-tags-service";

/**
 * Express router containing task methods.
 */
const tagRouter = express.Router();

// Retrieves tag with specific id
tagRouter.get("/:tagid", async (request, response) => {
  const tagid = Number(request.params.tagid);

  try {
    const tag = await tagService.getTag(tagid);

    response.send(tag);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Retrieves all pages with specific tag
tagRouter.get("/:tagid/pages", (request, response) => {
  const tagid = Number(request.params.tagid);

  pageService
    .getPageFromTag(tagid)
    .then((page) =>
      page ? response.send(page) : response.status(404).send("No pages found")
    )
    .catch((error) => response.status(500).send(error));
});

//Creates new tag
//Error handling was with help from copilot
tagRouter.post("/", async (request, response) => {
  const { name } = request.body;

  if (name && name.length) {
    try {
      const tagid = await tagService.createTag(name);

      response.send({ id: tagid });
    } catch (error) {
      response.status(500).send(error);
    }
  } else response.status(400).send("Missing input or data");
});

//To delete a tag with specific id
tagRouter.delete("/:tagid", async (request, response) => {
  const tagid = Number(request.params.tagid);

  try {
    await pageTagsService.deleteAllPagesFromTag(tagid);
    await tagService.deleteTag(tagid);

    response.send();
  } catch (error) {
    response.status(500).send(error);
  }
});

//Retrieves all tags
tagRouter.get("/", async (_request, response) => {
  try {
    const result = await tagService.getAllTags();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Changes the name of a tag
tagRouter.patch("/:tagid/edit", async (request, response) => {
  const tag = request.body.tag;

  try {
    await tagService.updateTag(tag);

    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(500);
  }
});

//Deletes all pages with a specific tag id
tagRouter.delete("/:tagid/pages", async (request, response) => {
  const tagId = Number(request.params.tagid);

  try {
    await pageTagsService.deleteAllPagesFromTag(tagId);

    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(500).send(error);
  }
});

export default tagRouter;
