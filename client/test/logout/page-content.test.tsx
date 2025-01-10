// Import necessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import PageContent from "../../src/logout/page-content";

jest.mock("../../src/service/versionlog-service", () => ({
  getLatestVersion: jest.fn(() =>
    Promise.resolve({
      id: 1,
      content: "## Sample Content",
      userid: 1,
      date: "2024-01-01T12:00:00Z",
      changelog: "Initial version",
      version: 1,
      pageid: 1,
    })
  ),
}));

jest.mock("../../src/service/page-service", () => ({
  getPage: jest.fn(() =>
    Promise.resolve({
      id: 1,
      name: "Sample Page",
      num_views: 123,
    })
  ),
  getTagsFromPage: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Tag1" },
      { id: 2, name: "Tag2" },
    ])
  ),
}));

jest.mock("../../src/service/comment-service", () => ({
  getCommentsFromPage: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        content: "Great post!",
        userid: 1,
        date: "2024-01-01T12:30:00Z",
      },
      {
        id: 2,
        content: "Needs more details.",
        userid: 2,
        date: "2024-01-01T13:00:00Z",
      },
    ])
  ),
}));

jest.mock("../../src/service/user-service", () => ({
  getAllUsers: jest.fn(() =>
    Promise.resolve([
      { id: 1, username: "JohnDoe", avatar: "", bio: "", permid: 1 },
      { id: 2, username: "JaneSmith", avatar: "", bio: "", permid: 1 },
    ])
  ),
}));

describe("PageContent Component Tests", () => {
  test("Renders page information correctly", (done) => {
    const wrapper = shallow(<PageContent match={{ params: { id: 1 } }} />);

    // Wait for the mounted() lifecycle method to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();

      done();
    });
  });

  test("Displays tags correctly", (done) => {
    const wrapper = shallow(<PageContent match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <a className="blue-link" href="/#/tags/1">
            Tag1
          </a>,
          <a className="blue-link" href="/#/tags/2">
            Tag2
          </a>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test("Displays comments correctly", (done) => {
    const wrapper = shallow(<PageContent match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
