// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Sidebar from "../../src/login/sidebar";
import { Button } from "../../src/widgets";

// Mock services
jest.mock("../../src/service/page-service", () => ({
  createPage: jest.fn().mockResolvedValue(1),
  checkForEmptyPages: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../src/service/tag-service", () => ({
  createTag: jest.fn().mockResolvedValue(1),
  getAllTags: jest.fn().mockResolvedValue([{ id: 1, name: "Tag1" }]),
}));

jest.mock("../../src/service/user-service", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue({
    id: 1,
    username: "testuser",
    avatar: "",
    bio: "",
    permid: 1,
  }),
}));

jest.mock("../../src/service/permission-service", () => ({
  getPermission: jest.fn().mockResolvedValue({
    id: 1,
    alterpages: true,
    deletepages: false,
    versions: false,
    allcomments: false,
    tags: true,
    users: false,
  }),
}));

describe("Sidebar component tests", () => {
  //@ts-ignore
  let wrapper;

  beforeEach(async () => {
    wrapper = shallow(<Sidebar />);
    wrapper.update();
  });

  test("Sidebar renders correctly", () => {
    // @ts-ignore
    expect(wrapper.find(".sidebar").exists()).toBe(true);
  });

  test("Creates new page when alterpages permission is true", async () => {
    const pageService = require("../../src/service/page-service");
    // @ts-ignore
    wrapper.find(Button.Light).at(0).simulate("click");
    expect(pageService.createPage).toHaveBeenCalled();
  });

  test("Creates new tag when tags permission is true", () => {
    //@ts-ignore
    wrapper.find(Button.Light).at(1).simulate("click");
    //@ts-ignore
    expect(wrapper.instance().newTag).toBe(true);
  });
});
