// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import NewPage from "../../src/login/new-page";
import { Form, Button } from "../../src/widgets";

// Mock services
jest.mock("../../src/service/page-service", () => ({
  updatePageName: jest.fn(() => Promise.resolve()),
  deleteEmptyPage: jest.fn(() => Promise.resolve()),
  getAllPages: jest.fn(() => Promise.resolve([])),
}));

jest.mock("../../src/service/versionlog-service", () => ({
  createVersion: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../src/service/tag-service", () => ({
  getAllTags: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Tag1" },
      { id: 2, name: "Tag2" },
    ])
  ),
  addTagToPage: jest.fn(() => Promise.resolve()),
  deleteTagFromPage: jest.fn(() => Promise.resolve()),
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

jest.mock("../../src/service/page-tags-service", () => ({
  addTagToPage: jest.fn(() => Promise.resolve()),
  deleteTagFromPage: jest.fn(() => Promise.resolve()),
}));

describe("NewPage Component Tests", () => {
  test("Renders NewPage form correctly", (done) => {
    const wrapper = shallow(<NewPage match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper.find(Form.Input).length).toBe(2); // Page name and changelog fields
      expect(wrapper.find(Button.Success).length).toBe(2); // Add tag and Save buttons
      expect(wrapper.find(Button.Light).length).toBe(1); // Cancel button
      done();
    });
  });

  test("Adds a tag correctly", (done) => {
    const wrapper = shallow(<NewPage match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      // Select a tag to add
      wrapper
        .find(Form.Select)
        .simulate("change", { currentTarget: { value: "2" } });

      // Click the "Legg til tagg" button
      wrapper.find(Button.Success).at(0).simulate("click");

      // Check if the tag is added
      expect((wrapper.instance() as any).tags).toContainEqual({
        id: 2,
        name: "Tag2",
      });
      done();
    });
  });

  test("Removes a tag correctly", (done) => {
    const wrapper = shallow(<NewPage match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      // Add a tag first
      wrapper
        .find(Form.Select)
        .simulate("change", { currentTarget: { value: "1" } });
      wrapper.find(Button.Success).at(0).simulate("click");

      // Now remove the tag
      wrapper.find(Button.Danger).simulate("click");

      // Check if the tag is removed
      expect((wrapper.instance() as any).tags).not.toContainEqual({
        id: 1,
        name: "Tag1",
      });
      done();
    });
  });

  test("Cancels page creation and redirects", (done) => {
    const wrapper = shallow(<NewPage match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      // Simulate clicking the "Avbryt" button
      wrapper.find(Button.Light).simulate("click");

      // Check if the user is redirected
      expect(location.hash).toEqual("#/");
      done();
    });
  });
});
