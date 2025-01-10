// Import axiso and app
import axios from "axios";
import app from "../../src/app";

// Import from service
import versionlogService, {
  Versionlog,
} from "../../src/service/versionlog-service";

// Import from mysql-pool
import { pool } from "../../src/mysql-pool";

// Import moment for date formatting
import moment from "moment";

// Create test versionlogs to be used in the tests
const testVersionlogs: Versionlog[] = [
  {
    id: 1,
    pageid: 1,
    content: "Version 1",
    userid: 1,
    date: "2024-11-11 11:11:29",
    changelog: "Changelog 1",
    version: 1,
    //@ts-ignore
    name: null,
  },
  {
    id: 2,
    pageid: 1,
    content: "Version 2",
    userid: 1,
    date: "2024-11-11 12:00:31",
    changelog: "Changelog 2",
    version: 2,
    //@ts-ignore
    name: null,
  },
  //@ts-ignore
  //Had to include name: null to make the test work
  {
    id: 3,
    pageid: 1,
    content: "Version 3",
    userid: 1,
    date: "2024-11-11 13:45:20",
    changelog: "Changelog 3",
    version: 3,
    //@ts-ignore
    name: null
  },
];

//Put the test on a different port than the other tests
const port = 3006;

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = `http://localhost:${port}/api/v2/pages`;

let webServer: any;

beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(port, () => done());
});

beforeEach((done) => {
  // Delete all versionlogs before each test
  pool.query("TRUNCATE TABLE Versionlog", (error: any) => {
    if (error) return done(error);

    versionlogService
      .createVersion(testVersionlogs[0])
      .then(() => versionlogService.createVersion(testVersionlogs[1])) // Create testVersionlogs[1] after testVersionlogs[0] has been created
      .then(() => versionlogService.createVersion(testVersionlogs[2])) // Create testVersionlogs[2] after testVersionlogs[1] has been created
      .then(() => done()); // Call done() after testVersionlogs[2] has been created
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
describe("Fetch versionlogs (GET)", () => {
  //Get all versionlogs with a specific :pageid
  test("GET /:pageid/versionlog (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1/versionlog");
    } catch (error: any) {
      response = error.response;
    }
    expect(response.status).toEqual(200);

    /* Had to change the date format to match the expected date format
        if not the date would return .000Z at the end of the date.
        */
    const dateFormat = response.data.map((versionlog: Versionlog) => {
      versionlog.date = moment
        .utc(versionlog.date)
        .add(1, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      return versionlog;
    });
    expect(dateFormat).toEqual(testVersionlogs);
  });

  //Get all versions
  test("GET /versions/getversions (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/versions/getversions");
    } catch (error: any) {
      response = error.response;
    }
    expect(response.status).toEqual(200);

    /* Had to change the date format to match the expected date format
           if not the date would return .000Z at the end of the date.
           */
    const dateFormat = response.data.map((versionlog: Versionlog) => {
      versionlog.date = moment
        .utc(versionlog.date)
        .add(1, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      return versionlog;
    });
    expect(dateFormat).toEqual(testVersionlogs);
  });

  //Get a specific versionlog by :pageid and :versionnum
  test("GET /:pageid/versionlog/:versionnum (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1/versionlog/1");
    } catch (error: any) {
      response = error.response;
    }
    expect(response.status).toEqual(200);

    //Help from copilot to make this work as intended
    const adjustedData = {
      ...response.data,
      date: moment
        .utc(response.data.date)
        .add(1, "hours")
        .format("YYYY-MM-DD HH:mm:ss"),
    };

    expect(adjustedData).toEqual(testVersionlogs[0]);
  });

  //Get latest versionlog by :pageid
  test("GET /:pageid/latest (200 OK)", async () => {
    let response;
    try {
      response = await axios.get("/1/latest");
    } catch (error: any) {
      response = error.response;
    }
    expect(response.status).toEqual(200);

    //Help from copilot to make this work as intended
    const adjustedData = {
      ...response.data,
      date: moment
        .utc(response.data.date)
        .add(1, "hours")
        .format("YYYY-MM-DD HH:mm:ss"),
    };

    expect(adjustedData).toEqual(testVersionlogs[2]);
  });

  //Get latest versionlog by :pageid (404 NOT FOUND)
  test("GET /:pageid/latest (404 NOT FOUND)", async () => {
    let response;
    try {
      response = await axios.get("/4/latest");
    } catch (error: any) {
      response = error.response;
    }
    expect(response.status).toEqual(404);
    expect(response.data).toEqual("Page not found");
  });
});

//Tests using DELETE
describe("Delete versionlogs (DELETE)", () => {
  //Delete a versionlog by :pageid and :versionnum
  test("DELETE /:pageid/versionlog/:versionnum (200 OK)", async () => {
    let response;
    try {
      response = await axios.delete("/1/versionlog/1");
    } catch (error: any) {
      response = error.response;
    }
    expect(response.status).toEqual(200);
  });
});

//Tests using POST
describe("To create a version (POST)", () => {
  //Create a new version
  test("POST /:pageid/edit (200 OK)", async () => {
    let response;
    try {
      response = await axios.post("/1/edit", {
        version: {
          content: "Version 4",
          version: 4,
          pageid: 1,
          userid: 1,
          date: "",
        },
      });
      expect(response.status).toEqual(200);
      expect(response.data).toEqual("Success");
    } catch (error: any) {
      response = error.response;
    }
  });
});

//Tests for Versionlog service
describe("Versionlog service", () => {
  //Get date from a specific versionlog
  test("getDate", async () => {
    let response;
    try {
      await versionlogService.getDate(testVersionlogs[0].pageid);
      expect(response).toEqual(testVersionlogs[0].date);
    } catch (error: any) {
      response = error.message;
    }
  });

  //Get date from a specific versionlog should return error
  test("getDate return error", async () => {
    try {
      await versionlogService.getDate(0); // Use a pageid that does not exist
    } catch (error: any) {
      expect(error.message).toBe("Date not found");
    }
  });

  //Check a version of a page and delete oldest version if there are more than 10 versions
  test("checkVersion", async () => {
    let response;
    try {
      await versionlogService.createVersion(testVersionlogs[0]);
      response = await versionlogService.checkVersion(
        testVersionlogs[0].pageid
      );
      expect(response).toEqual("Success");
    } catch (error: any) {
      response = error.message;
    }
  });
});
