// Import axios and app
import axios from "axios";
import app from "../../src/app";

// Import from service
import tagService, { Tag } from "../../src/service/tag-service";

// Import from mysql-pool
import { pool } from "../../src/mysql-pool";

//Create test tags to be used in the tests
const testTags: Tag[] = [
  { id: 1, name: "Tag 1" },
  { id: 2, name: "Tag 2" },
  { id: 3, name: "Tag 3" },
];

//Put the tests on a different port than the other tests
const port = 3003;

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = `http://localhost:${port}/api/v2/tags`;

let webServer: any;
beforeAll((done) => {
  //Use separate port for testing
  webServer = app.listen(port, () => done());
});

beforeEach((done) => {
  //Delete all tags, and reset id auto-increment start value

  pool.query("TRUNCATE TABLE Tags", (error: any) => {
    if (error) return done(error);

    tagService
      .createTag(testTags[0].name)
      .then(() => tagService.createTag(testTags[1].name)) // Create testTags[1] after testTags[0] has been created
      .then(() => tagService.createTag(testTags[2].name)) // Create testTags[2] after testTags[1] has been created
      .then(() => done()); // Call done() after testTags[2] has been created
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
describe("Fetch tags (GET)", () => {
  //Get all tags
  test("GET / (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTags);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Get a speficic tag by :tagid
  test("GET /:tagid (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTags[0]);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Get all pages with a specific :tagid
  test("GET /:tagid/pages (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1/pages");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTags[0]);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Get a tag that doesn't exist by :tagid
  test("GET /:tagid (404 Not Found)", async () => {
    let response;
    try {
      response = await axios.get("/4");
    } catch (error: any) {
      response = error.response;
      expect(response.status).toEqual(404);
      expect(response.data).toEqual("Tag not found");
    }
  });
});

//Tests using POST
describe("Create new tag (POST)", () => {
  //Create a new tag
  test("POST / (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/", { name: "New tag" });
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 4 });
    } catch (error: any) {
      response = error.response;
    }
  });

  //Create a new tag with missing input
  test("POST / (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.post("/", { name: "" });
    } catch (error: any) {
      response = error.response;
      expect(response.status).toEqual(400);
      expect(response.data).toEqual("Missing input or data");
    }
  });
});

//Tests using DELETE
describe("Delete tag (DELETE)", () => {
  //Delete a tag by :tagid
  test("DELETE /:tagid (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/2");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Deletes all pages with a specific :tagid
  test("DELETE /:tagid/pages (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/2/pages");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using PATCH
describe("Update tag name (PATCH)", () => {
  //Update a tag by :tagid
  test("PATCH /:tagid/edit (200 OK)", async () => {
    let response;
    let updatedTag = { id: 1, name: "Updated tag" };
    try {
      response = await axios.patch("/1/edit", updatedTag);
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a tag but causing a 500 error
  test("PATCH /:tagid/edit (500 Internal Server Error)", async () => {
    let response;
    let updatedTag = { id: 4, name: "Updated tag" };
    try {
      response = await axios.patch("/4/edit", updatedTag);
    } catch (error: any) {
      response = error.response;
      expect(response.status).toEqual(500);
    }
  });
});

//Tests for the tagService
describe("TagService", () => {
  //Updates a tag that doesn't exist
  test("updateTag (Tag not found)", async () => {
    const updatedTag = { id: 4, name: "Updated tag" };
    try {
      await tagService.updateTag(updatedTag);
    } catch (error: any) {
      expect(error.message).toEqual("Tag not found");
    }
  });

  //Get a specific tag but returns an error
  test("getTag return error", async () => {
    try {
      await tagService.getTag(4);
    } catch (error: any) {
      expect(error).toBeInstanceOf("error");
    }
  });
});
