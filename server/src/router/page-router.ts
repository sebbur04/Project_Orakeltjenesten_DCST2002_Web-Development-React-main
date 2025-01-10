//Express import
import express from "express";

//Service imports
import pageService from "../service/page-service";
import versionlogService from "../service/versionlog-service";
import tagService from "../service/tag-service";
import pageTagsService from "../service/page-tags-service";
import commentService from "../service/comment-service";

/**
 * Express router containing task methods.
 */
const pageRouter = express.Router();

//Checks if there are any empty pages, and deletes them, if for example a user presses new page and regrets it
pageRouter.delete("/empty", async (_request, response) => {
  try {
    await pageService.checkForEmptyPage();

    response.sendStatus(200);
  } catch (error) {
    response.sendStatus(500).send(error);
  }
});

//Get all pages
pageRouter.get("/", async (_request, response) => {
  try {
    const result = await pageService.getAllPages();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Retrieves all pages sorted by number of views
pageRouter.get("/orderedpages", async (_request, response) => {
  try {
    const result = await pageService.getOrderedPages();

    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Shows page with specific id
pageRouter.get("/:pageid", async (request, response) => {
  const pageId = Number(request.params.pageid);
  try {
    const data = await pageService.getPage(pageId);

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Creates a new page
pageRouter.post("/", async (_request, response) => {
  try {
    const pageId = await pageService.createPage();

    //Gets error because in regular send, react interprets it as if you sent status since pageId is a number.
    response.send({ id: pageId });
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update number of views on a page
pageRouter.patch("/:pageid", async (request, response) => {
  const data = Number(request.params.pageid);

  try {
    await pageService.updatePageViews(data);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

//This route uses versionLogService
//Show content of a page
pageRouter.get("/:pageid/latest", (request, response) => {
  const pageId = Number(request.params.pageid);
  versionlogService
    .getLatestVersion(pageId)
    .then((page) =>
      page ? response.send(page) : response.status(404).send("Page not found")
    )
    .catch((error) => response.status(500).send(error));
});

//This route uses tagService
//Get all tags from a page
pageRouter.get("/:pageid/edit", async (request, response) => {
  const data = Number(request.params.pageid);

  try {
    const result = await tagService.getTagsFromPage(data);

    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

//This route uses versionLogService
//To edit content of page
pageRouter.post("/:pageid/newversion", async (request, response) => {
  const data = request.body.version;

  if (
    data.content &&
    data.content.length &&
    data.version &&
    data.pageid &&
    data.userid &&
    data.date != 0
  ) {
    try {
      await versionlogService.createVersion(data);
      await versionlogService.checkVersion(data.pageid);

      response.status(200).send("Success");
    } catch (error) {
      response.status(500).send(error);
    }
  } else response.status(400).send("Missing input or data");
});

//This route uses pageTagsService
//To add tag to page
pageRouter.post("/:pageid/edit/:tagid", async (request, response) => {
  const pageId = Number(request.params.pageid);
  const tagId = Number(request.params.tagid);

  if (pageId != 0 || tagId != 0) {
    try {
      await pageTagsService.addTagToPage(pageId, tagId);

      response.send("Added successfully");
    } catch (error) {
      response.status(500).send(error);
    }
  } else response.status(400).send("Missing pageId or tagId");
});

//This route uses pageTagsService
//To delete tag from page
pageRouter.delete("/:pageid/edit/:tagid", async (request, response) => {
  const params = request.params;

  try {
    await pageTagsService.deleteTagFromPage(
      Number(params.pageid),
      Number(params.tagid)
    );

    response.send("Deleted successfully");
  } catch (error) {
    response.status(500).send(error);
  }
});

//This route uses versionLogService
//Shows extra information about the page, such as versions / number of viewers
pageRouter.get("/:pageid/versionlog", async (request, response) => {
  const pageid = Number(request.params.pageid);

  try {
    const data = await versionlogService.getAllPageVersions(pageid);

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

//This route uses versionLogService
//Shows all versions of a page
pageRouter.get("/versions/getversions", async (_request, response) => {
  try {
    const data = await versionlogService.getAllVersions();

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

//This route uses versionLogService
//Check content of specific version, for maybe deleting or changing a page
pageRouter.get("/:pageid/versionlog/:versionnum", async (request, response) => {
  const pageId = Number(request.params.pageid);
  const versionNum = Number(request.params.versionnum);

  try {
    const data = await versionlogService.getVersion(pageId, versionNum);

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

//This route uses versionLogService
//Delete a specific version of a page
pageRouter.delete(
  "/:pageid/versionlog/:versionnum",
  async (request, response) => {
    const versionNum = Number(request.params.versionnum);
    const pageId = Number(request.params.pageid);

    try {
      await versionlogService.deleteVersion(pageId, versionNum);

      response.sendStatus(200);
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

//This route uses versionLogService, pageService, commentService, pageTagsService
//To delete a page
pageRouter.delete("/:pageid", async (request, response) => {
  const pageId = Number(request.params.pageid);
  try {
    await commentService.deleteAllPageComments(pageId);
    await pageTagsService.deleteAllPageTags(pageId);
    await versionlogService.deletePageVersions(pageId);
    await pageService.deletePage(pageId);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

//To delete a page
pageRouter.delete("/:pageid/page", async (request, response) => {
  const pageId = Number(request.params.pageid);

  try {
    await pageService.deletePage(pageId);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Update name of a page
pageRouter.patch("/:pageid/editname", async (request, response) => {
  const pageid = Number(request.params.pageid);
  const name = request.body.name;

  try {
    const updatedPage = await pageService.updatePageName(pageid, name);
    response.send(updatedPage);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default pageRouter;
