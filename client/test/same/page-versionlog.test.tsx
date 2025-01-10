// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import VersionLog from "../../src/same/page-versionlog";

jest.mock("../../src/service/versionlog-service", () => ({
  getAllPageVersions: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        version: 1,
        pageid: 123,
        userid: 1,
        date: "2024-11-16T10:00:00Z",
        changelog: "Initial creation",
      },
      {
        id: 2,
        version: 2,
        pageid: 123,
        userid: 2,
        date: "2024-11-16T12:00:00Z",
        changelog: "Updated content",
      },
    ])
  ),
}));

jest.mock("../../src/service/page-service", () => ({
  getPage: jest.fn(() =>
    Promise.resolve({ id: 123, name: "Test Page", num_views: 100 })
  ),
}));

jest.mock("../../src/service/user-service", () => ({
  getAllUsers: jest.fn(() =>
    Promise.resolve([
      { id: 1, username: "user1", avatar: "", bio: "", permid: 0 },
      { id: 2, username: "user2", avatar: "", bio: "", permid: 0 },
    ])
  ),
}));

describe("VersionLog Component Tests", () => {
  test("Renders version logs correctly", (done) => {
    const match = { params: { id: 123 } };
    const wrapper = shallow(<VersionLog match={match} />);

    setTimeout(() => {
      // Check that the Card title renders correctly
      expect(wrapper).toMatchSnapshot();

      done();
    });
  });
});
