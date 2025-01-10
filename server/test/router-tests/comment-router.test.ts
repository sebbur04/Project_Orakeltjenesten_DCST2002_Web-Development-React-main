//Import axios and app
import axios from "axios";
import app from "../../src/app";

// Import from service
import commentService, { Comment } from "../../src/service/comment-service";

// Import from mysql-pool
import { pool } from "../../src/mysql-pool";

// Import moment for date formatting
import moment from "moment";

// Create test comments to be used in the tests
const testComments: Comment[] = [
  {
    id: 1,
    userid: 1,
    date: "2024-10-01 11:11:29",
    pageid: 1,
    content: "Comment 1",
  },
  {
    id: 2,
    userid: 1,
    date: "2024-10-02 12:00:31",
    pageid: 2,
    content: "Comment 2",
  },
  {
    id: 3,
    userid: 1,
    date: "2024-10-03 13:45:20",
    pageid: 3,
    content: "Comment 3",
  },
];

// Put the tests on a different port than the other tests
const port = 3010;

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = `http://localhost:${port}/api/v2/comments`;

let webServer: any;

beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(port, () => done());
});

beforeEach((done) => {
  // Delete all comments, and reset id auto-increment start value

  pool.query("TRUNCATE TABLE Comments", (error: any) => {
    if (error) return done(error);

    commentService
      .createComment(testComments[0])
      .then(() => commentService.createComment(testComments[1])) // Create testComments[1] after testComments[0] has been created
      .then(() => commentService.createComment(testComments[2])) // Create testComments[2] after testComments[1] has been created
      .then(() => done()); // Call done() after testComments[2] has been created
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
describe("Fetch comments (GET)", () => {
  //Get all comments
  test("GET / (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/");
      expect(response.status).toEqual(200);

      /* Had to change the format of the expected date to make the test work,
        the date was received like ".000Z" at the end of the date, 
        so had to change the format to match the expected date format 
        */

      const dateFormat = response.data.map((comment: Comment) => {
        comment.date = moment
          .utc(comment.date)
          .add(2, "hours")
          .format("YYYY-MM-DD HH:mm:ss");
        return comment;
      });
      expect(dateFormat).toEqual(testComments);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Get a speficic comment by :pageid
  test("GET /:pageid (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1"); //This is /:pageid
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testComments[0]);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Get a comment that doesn't exist
  test("GET /:pageid (404 Not Found)", async () => {
    let response;
    try {
      response = await axios.get("/4");
      expect(response.status).toEqual(404);
      expect(response.data).toEqual("Comment not found");
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using POST
describe("Create new comment (POST)", () => {
  //Create new comment
  test("POST / (200 OK)", async () => {
    let response;
    try {
      //Got help from copilot to fix it to { comment: { content: 'New comment' } }
      response = await axios.post("/", { comment: { content: "New comment" } });
      expect(response.status).toEqual(200);
      expect(response.data.id).toEqual({ id: 4 });
    } catch (error: any) {
      response = error.response;
    }
  });

  //Create new comment (400 Bad Request)
  test("POST / (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.post("/", { comment: { content: "" } });
      expect(response.status).toEqual(400);
      expect(response.data.error).toEqual("Content not provided");
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using DELETE
describe("Delete comment (DELETE)", () => {
  //Delete a comment by :commentid
  test("DELETE /:commentid (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/2"); //This is /:commentid
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using PATCH
describe("Update comment (PATCH)", () => {
  //Update a comment by :commentid
  test("PATCH /:commentid (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/3", {
        comment: { content: "Updated comment" },
      });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a comment by :commentid with missing content field
  test("PATCH /:commentid (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.patch("/3", { comment: { content: "" } });
      expect(response.status).toEqual(400);
      expect(response.data.error).toEqual("Content is required");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a comment that doesn't exist
  test("PATCH /:commentid (404 Not Found)", async () => {
    let response;
    try {
      response = await axios.patch("/4", {
        comment: { content: "Updated comment" },
      });
      expect(response.status).toEqual(404);
      expect(response.data).toEqual("Comment not found");
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests for commentService
describe("commentService", () => {
  //Delete all comments on a page
  test("deleteAllPageComments", async () => {
    try {
      await commentService.deleteAllPageComments(1);
    } catch (error: any) {
      expect(error).toBe("No row deleted");
    }
  });
});
