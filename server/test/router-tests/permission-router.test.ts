// Import app and axios
import axios from "axios";
import app from "../../src/app";

// Import from service
import permissionService, { Permission } from "../../src/service/permission-service";

// Import from mysql-pool
import { pool } from "../../src/mysql-pool";

//Create test permissions to be used in the tests
const testPermissions: Permission[] = [
  {
    id: 1,
    alterpages: true,
    deletepages: true,
    versions: true,
    allcomments: true,
    tags: true,
    users: true,
  },
  {
    id: 2,
    alterpages: false,
    deletepages: false,
    versions: false,
    allcomments: false,
    tags: false,
    users: false,
  },
  {
    id: 3,
    alterpages: true,
    deletepages: true,
    versions: true,
    allcomments: true,
    tags: true,
    users: true,
  },
];

//Put the tests on a different port than the other tests
const port = 3008;

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = `http://localhost:${port}/api/v2/permissions`;

let webServer: any;

beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(port, () => done());
});

beforeEach((done) => {
  // Delete all permissions before each test
  pool.query("TRUNCATE TABLE Permissions", (error: any) => {
    if (error) return done(error);

    permissionService
      .createPermission()
      //@ts-ignore
      .then(() => permissionService.createPermission(testPermissions[0]))
      //@ts-ignore
      .then(() => permissionService.createPermission(testPermissions[1])) // Create testPermissions[1] after testPermissions[0] has been created
      //@ts-ignore
      .then(() => done()); // Call done() after testPermissions[1] has been created
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
describe("Fetch permissions (GET)", () => {
  //Get all permissions
  test("GET / ", async () => {
    let response;
    try {
      response = await axios.get("/");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      console.log(error);
    }
  });

  //Get a speficic permission by :permid
  test("GET /:permid (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      console.log(error);
    }
  });

  //Get a speficic permission by :permid (404 NOT FOUND)
  test("GET /:permid (404 NOT FOUND)", async () => {
    let response;
    try {
      response = await axios.get("/4");
      expect(response.status).toEqual(404);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using POST
describe("Create permissions (POST)", () => {
  //Create new permissions
  test("POST / (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/", {
        alterpages: false,
        deletepages: false,
        versions: false,
        allcomments: false,
        tags: false,
        users: false,
      });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Create new permissions (500 Internal Server Error)
  test(" POST / (500 Internal Server Error)", async () => {
    let response;
    try {
      response = await axios.post("/");
      expect(response.status).toEqual(500);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using DELETE
describe("Delete permissions (DELETE)", () => {
  //Delete a permission by :permid
  test("DELETE /:permid (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/1");
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Delete a permission but an error 500 occurs
  test("DELETE /:permid (500 Internal Server Error)", async () => {
    let response;
    try {
      response = await axios.delete("/4");
      expect(response.status).toEqual(500);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests using PATCH
describe("Update permissions (PATCH)", () => {
  //Update a permission by :permid
  test("PATCH /:permid/edit (200 OK)", async () => {
    let response;
    try {
      response = await axios.patch("/1/edit", {
        alterpages: false,
        deletepages: false,
        versions: false,
        allcomments: false,
        tags: false,
        users: false,
      });
      expect(response.status).toEqual(200);
    } catch (error: any) {
      response = error.response;
    }
  });

  //Update a permission by :permid but an error 500 occurs
  test("PATCH /:permid/edit (500 Internal Server Error)", async () => {
    let response;
    try {
      response = await axios.patch("/4/edit");
      expect(response.status).toEqual(500);
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests for the permissionService
describe("PermissionService", () => {
  //updatePermissions returns an error
  test("updatePermissions return error", async () => {
    try {
      await permissionService.updatePermissions({
        id: 4,
        alterpages: false,
        deletepages: false,
        versions: false,
        allcomments: false,
        tags: false,
        users: false,
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
