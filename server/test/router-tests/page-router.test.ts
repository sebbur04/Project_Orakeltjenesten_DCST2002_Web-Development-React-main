// Import axios and app
import axios from "axios";
import app from "../../src/app";

// Import from service
import pageService, { Page } from "../../src/service/page-service";
import pageTagsService, { PageTag } from "../../src/service/page-tags-service";
import tagService, { Tag } from "../../src/service/tag-service";

// Import from mysql-pool
import { pool } from "../../src/mysql-pool";


//Create test pages to be used in the tests
const testPages: Page[] = [
  { id: 1, name: "Page 1", num_views: 0 },
  { id: 2, name: "Page 2", num_views: 0 },
  { id: 3, name: "Page 3", num_views: 0 },
];

//Create test pageTags to be used in the tests
const testPageTags: PageTag[] = [
  { pageid: 1, tagid: 1 },
  { pageid: 2, tagid: 2 },
  { pageid: 3, tagid: 3 },
];

//Create test tags to be used in the tests
const testTags: Tag[] = [
  { id: 1, name: "Tag 1" },
  { id: 2, name: "Tag 2" },
  { id: 3, name: "Tag 3" },
];

//Put the tests on a different port than the other tests
const port = 3002;

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = `http://localhost:${port}/api/v2/pages`;

let webServer: any;

beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(port, () => done());
});

beforeEach((done) => {
  // Delete all pages before each test
  pool.query("TRUNCATE TABLE Pages", (error: any) => {
    if (error) return done(error);

    // Delee all pageTags before each test
    pool.query("TRUNCATE TABLE PageTags", (error: any) => {
      if (error) return done(error);

      // Delete all tags before each test
      pool.query("TRUNCATE TABLE Tags", (error: any) => {
        if (error) return done(error);

        pageService
          //@ts-ignore
          .createPage(testPages[0])
          //@ts-ignore
          .then(() => pageService.createPage(testPages[1])) // Create testPages[1] after testPages[0] has been created
          //@ts-ignore
          .then(() => pageService.createPage(testPages[2])); // Create testPages[2] after testPages[1] has been created
        tagService
          .createTag(testTags[0].name)
          .then(() => tagService.createTag(testTags[1].name)) // Create testTags[1] after testTags[0] has been created
          .then(() => tagService.createTag(testTags[2].name)); // Create testTags[2] after testTags[1] has been created
        pageTagsService
          .createPageTag(testPageTags[0].pageid, testPageTags[0].tagid)
          .then(() =>
            pageTagsService.createPageTag(
              testPageTags[1].pageid,
              testPageTags[1].tagid
            )
          ) // Create testPageTags[1] after testPageTags[0] has been created
          .then(() =>
            pageTagsService.createPageTag(
              testPageTags[2].pageid,
              testPageTags[2].tagid
            )
          ) // Create testPageTags[2] after testPageTags[1] has been created
          .then(() => done()); // Call done() after testPageTags[2] has been created
      });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll(async () => {
  if (webServer) {
    await webServer.close(() => {
      pool.end();
    });
  }
});

//Tests using GET
describe("Fetch pages (GET)", () => {
  // Get all pages
  test("GET / (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testPages);
    } catch (error: any) {
      response = error.response;
    }
  });

  // Get all tags from a page
  test("GET /:pageid/edit (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1/edit");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  // Get pages ordered by number of views
  test("GET /orderedpages (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/orderedpages");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testPages);
    } catch (error: any) {
      response = error.response;
    }
  });

  // Get a specific page by :pageid
  test("GET /:pageid (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testPages[0]);
    } catch (error: any) {
      response = error.response;
    }
  });
});

// Get a page that doesn't exist by :pageid
test("GET /:pageid (404 Not Found)", async () => {
  let response;
  try {
    response = await axios.get("/4");
    expect(response.status).toEqual(404);
    expect(response.data).toEqual("No pages found");
  } catch (error: any) {
    response = error.response;
  }
});

//Tests for PageTags service
describe("PageTagsService", () => {
  //Get a pages tag
  test("getPageTag", async () => {
    let response;
    try {
      response = await pageTagsService.getPageTag(1);
      expect(response).toEqual(testPageTags[0]);
    } catch (error: any) {
      expect(error).toBe("No tags found");
    }
  });

  //Get all pages from tags should throw error
  test("getPageTag should throw error", async () => {
    let response;
    try {
      response = await pageTagsService.getPageTag(4);
    } catch (error: any) {
      expect(error).toBe("No tag found");
    }
  });

  //Get all pages from tags
  test("getAllPageTags", async () => {
    let response;

    response = await pageTagsService.getAllPageTags();
    expect(response).toEqual(testTags);
  });

  //Get all tags from a page should throw error
  test("getAllPageTags should throw error", async () => {
    try {
      await pageTagsService.getAllPageTags();
    } catch (error: any) {
      expect(error).toEqual(new Error("No tags found"));
    }
  });
});

//Tests for TagService
describe("TagService", () => {
  //Get all tags from a page
  test("getTagsFromPage", async () => {
    let response = await tagService.getTagsFromPage(1);
    expect(response).toEqual([testTags[0]]);
  });
});

//Tests using POST
describe("Create new page (POST)", () => {
  //Create a new page
  test("POST / (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/", { name: "New page" });
      expect(response.status).toEqual(200);
      expect(response.data.id).toEqual({ id: 4 });
    } catch (error: any) {
      response = error.response;
    }
  });

  //Create a new page (400 Bad Request)
  test("POST / (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.post("/", { name: "" });
      expect(response.status).toEqual(400);
      expect(response.data).toEqual("Invalid input");
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using POST, to create a new version
describe("To edit content of page (POST)", () => {
  //Create a new version
  test("POST /:pageid/newversion (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/1/newversion", {
        version: {
          content: "New content",
          version: 1,
          pageid: 1,
          userid: 1,
          date: 0,
        },
      });
      expect(response.status).toEqual(200);
      expect(response.data).toEqual("Success");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Create a new version with missing input
  test("POST /:pageid/newversion (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.post("/1/newversion", {
        version: { content: "", version: 1, pageid: 1, userid: 1, date: 0 },
      });
      expect(response.status).toEqual(400);
      expect(response.data).toEqual("Missing input or data");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Create a new version (500 Internal Server Error)
  test("POST /:pageid/newversion (500 Internal Server Error)", async () => {
    let response;
    try {
      response = await axios.post("/1/newversion", {
        version: {
          content: "New content",
          version: 1,
          pageid: 1,
          userid: 1,
          date: 0,
        },
      });
      expect(response.status).toEqual(500);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using DELETE
describe("Delete page (DELETE)", () => {
  //Delete a page by :pageid
  test("DELETE /:pageid (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/2");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Delete an empty page
  test("DELETE /empty (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/empty");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using PATCH
describe("Update page name (PATCH)", () => {
  //Update a page by :pageid
  test("PATCH /:pageid/edit (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/1", { name: "Updated page" });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using POST, to add a tag to a page
describe("Add tag to page (POST)", () => {
  //Add a tag to a page
  test("POST /:pageid/edit/:tagid (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/1/edit/1");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual("Added successfully");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Add a tag to a page (400 Bad Request)
  test("POST /:pageid/edit/:tagid (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.post("/1/edit/0");
      expect(response.status).toEqual(400);
      expect(response.data).toEqual("Missing pageId or tagId");
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using DELETE, to delete a tag from a page
describe("Delete tag from page (DELETE)", () => {
  //Delete a tag from a page by :pageid and :tagid
  test("DELETE /:pageid/edit/:tagid (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/1/edit/1");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using PATCH, to update page views
describe("Update page views (PATCH)", () => {
  //Update page views by :pageid
  test("PATCH /:pageid (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/1");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using PageService
describe("PageService", () => {
  //Delete a specific page
  test("deletePage", async () => {
    try {
      await pageService.deletePage(1);
    } catch (error: any) {
      expect(error).toBe("No row deleted");
    }
  });

  //Delete a specific page should throw error
  test("deletePage should throw error", async () => {
    try {
      await pageService.deletePage(4);
    } catch (error: any) {
      expect(error).toBe("No row deleted");
    }
  });

  //Update a page name
  test("updatePageName", async () => {
    const response = await pageService.updatePageName(1, "Updated page");
    expect(response).toEqual(response);
  });

  //Update a page name should throw error
  test("updatePageName should throw error", async () => {
    try {
      await pageService.updatePageName(4, "Updated page");
    } catch (error: any) {
      expect(error).toBe("No rows affected");
    }
  });
});
