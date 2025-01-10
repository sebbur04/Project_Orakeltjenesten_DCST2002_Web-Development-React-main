// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import PageContent from "../../src/login/page";

// Mock services
jest.mock("../../src/service/versionlog-service", () => ({
  getLatestVersion: jest.fn(() =>
    Promise.resolve({
      id: 1,
      pageid: 1,
      content: "Sample content",
      version: 1,
      changelog: "Initial version",
    })
  ),
  createVersion: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../src/service/page-service", () => ({
  getPage: jest.fn(() =>
    Promise.resolve({ id: 1, name: "Test Page", num_views: 10 })
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
        date: "2023-10-10T10:00:00Z",
        content: "First comment",
        userid: 1,
        pageid: 1,
      },
    ])
  ),
  createComment: jest.fn(() => Promise.resolve(2)),
  updateComment: jest.fn(() => Promise.resolve()),
  deleteComment: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../src/service/user-service", () => ({
  getAuthenticatedUser: jest.fn(() =>
    Promise.resolve({
      id: 1,
      username: "User1",
      avatar: "avatar.png",
      bio: "Bio",
      permid: 1,
    })
  ),
  getAllUsers: jest.fn(() =>
    Promise.resolve([
      { id: 1, username: "User1", avatar: "avatar.png", bio: "Bio", permid: 1 },
      {
        id: 2,
        username: "User2",
        avatar: "avatar2.png",
        bio: "Bio2",
        permid: 2,
      },
    ])
  ),
}));

jest.mock("../../src/service/permission-service", () => ({
  getPermission: jest.fn(() =>
    Promise.resolve({
      id: 1,
      alterpages: true,
      deletepages: true,
      versions: true,
      allcomments: true,
      tags: true,
      users: true,
    })
  ),
}));

jest.mock("../../src/service/tag-service", () => ({
  getAllTags: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Tag1" },
      { id: 2, name: "Tag2" },
    ])
  ),
}));

describe("PageContent Component Tests", () => {
  test("Renders PageContent correctly (snapshot)", async () => {
    const wrapper = shallow(<PageContent match={{ params: { id: 1 } }} />);

    // Wait for asynchronous operations to complete
    // @ts-ignore
    await wrapper.instance().mounted();
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
  });
});
