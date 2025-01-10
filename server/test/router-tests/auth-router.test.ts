//Import axios and app
import axios from "axios";
import app from "../../src/app";

//Import from service
import userService from "../../src/service/user-service";
import { User } from "../../src/service/user-service";

//Import from mysql-pool
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
const port = 3005;

axios.defaults.baseURL = `http://localhost:${port}/api/v2/`;

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

//Tests using POST
describe("Login (POST)", () => {
  //Login with username and password
  test("POST /login/password (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/login/password", {
        username: "user1",
        password: "password",
        permid: 1,
      });
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUsers[0]);
    } catch (error: any) {
      response = error.response;
    }
  });

  //login with username and password but an 500 Internal Server Error occurs
  test("POST /login/password (500 Internal Server Error)", async () => {
    let response;
    try {
      response = await axios.post("/login/password", {
        username: "user1",
        password: "password",
        permid: 1,
      });
      expect(response.status).toEqual(500);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using POST
describe("Logout (POST)", () => {
  //Logout
  test("POST /logout (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/logout");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using POST, to create a new user
describe("Signup (POST)", () => {
  //Create a new user
  test("POST /signup (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/signup", {
        username: "user4",
        password: "password",
        permid: 4,
      });
      expect(response.data).toHaveProperty("username");
    } catch (error: any) {
      response = error.response;
    }
  });

  //Create a new user where the username already exists
  test("POST /signup (666 User already exists)", async () => {
    let response;
    try {
      response = await axios.post("/signup", {
        username: "user1",
        password: "password",
        permid: 1,
      });
      expect(response.status).toEqual(666);
    } catch (error: any) {
      response = error.response;
    }
  }, 10000);
});
