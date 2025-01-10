// Import axios and app
import axios from "axios";
import app from "../../src/app";

// Import from service
import userService, { User } from "../../src/service/user-service";

// Import from mysql-pool
import { pool } from "../../src/mysql-pool";

//Create test users to be used in the tests
/*Got help from Copilot with "Buffer.from()" with both passwords and salt, 
as the tests wouldn't run properly without it
*/
const testUsers: User[] = [
  {
    id: 1,
    username: "user1",
    hashedPassword: Buffer.from("password"),
    salt: Buffer.from("salt"),
    avatar: "Avatar1",
    bio: "Bio1",
    permid: 1,
  },
  {
    id: 2,
    username: "user2",
    hashedPassword: Buffer.from("password"),
    salt: Buffer.from("salt"),
    avatar: "Avatar2",
    bio: "Bio2",
    permid: 2,
  },
  {
    id: 3,
    username: "user3",
    hashedPassword: Buffer.from("password"),
    salt: Buffer.from("salt"),
    avatar: "Avatar3",
    bio: "Bio3",
    permid: 3,
  },
];

//Put the tests on a different port than the other tests
const port = 3004;

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = `http://localhost:${port}/api/v2/users`;

let webServer: any;

beforeAll((done) => {
  // Using separate port for testing
  webServer = app.listen(port, () => done());
});

beforeEach((done) => {
  // Delete all users before each test
  pool.query("TRUNCATE TABLE Users", (error: any) => {
    if (error) return done(error);

    userService
      .createUser(testUsers[0].username, "password", testUsers[0].permid)
      .then(() =>
        userService.createUser(
          testUsers[1].username,
          "password",
          testUsers[1].permid
        )
      ) // Create testUser[1] after testUser[0] has been created
      .then(() =>
        userService.createUser(
          testUsers[2].username,
          "password",
          testUsers[2].permid
        )
      ) // Create testUser[2] after testUser[1] has been created
      .then(() => done()); // Call done() after testUser[2] has been created
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
describe("Fetch users (GET)", () => {
  //Get all users
  test("GET / (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Get a speficic user by :userid
  test("GET /:userid (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1");
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers[0]);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Get a user that doesn't exist by :userid
  test("GET /:userid (404 Not Found)", async () => {
    let response;
    try {
      response = await axios.get("/4");
      expect(response.status).toEqual(404);
      expect(response.data).toEqual("No users found");
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using DELETE
describe("Delete user (DELETE)", () => {
  //Delete a user by :userid
  test("DELETE /:userid (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/2");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Delete a users comments by :userid
  test("DELETE /:userid/comments (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/3/comments");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using PATCH
describe("Update user (PATCH)", () => {
  //Update a users username by :userid
  test("PATCH /:userid/edit/username (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/2/edit/username", { username: "user2" });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a users username by :userid with missing username field
  test("/:userid/edit/username (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.patch("/3/edit/username", {
        password: "password",
      });
      expect(response.status).toEqual(400);
      expect(response.data).toEqual("Missing required fields");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a users password by :userid
  test("/:userid/edit/password (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/2/edit/password", {
        password: "password",
      });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a users avatar by :userid
  test("/:userid/edit/avatar (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/3/edit/avatar", { avatar: "Avatar3" });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a users avatar by :userid with missing avatar field
  test("/:userid/edit/avatar (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.patch("/1/edit/avatar", { username: "user1" });
      expect(response.status).toEqual(400);
      expect(response.data).toEqual("Missing required fields");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a users bio by :userid
  test("/:userid/edit/bio (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/2/edit/bio", { bio: "Bio2" });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a users bio by :userid with missing bio field
  test("PATCH /:userid/edit/bio (400 Bad Request)", async () => {
    let response;
    try {
      response = await axios.patch("/3/edit/bio", { bio: "" });
      expect(response.status).toEqual(400);
      expect(response.data).toEqual("Missing required fields");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a users permid by :userid
  test("PATCH /:userid/edit/permid", async () => {
    let response;
    try {
      response = await axios.patch("/1/edit/permid", { permid: 1 });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });

  //Update a users permid by :userid but with a internal server error
  test("PATCH /:userid/edit/permid (500 Internal Server Error)", async () => {
    let response;
    try {
      response = await axios.patch("/4/edit/permid", { permid: 1 });
      expect(response.status).toEqual(500);
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});
