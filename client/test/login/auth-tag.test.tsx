// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import TagComp from "../../src/login/tag";

// Mock services
jest.mock("../../src/service/tag-service", () => ({
  getTag: jest.fn().mockResolvedValue({ id: 1, name: "Test Tag" }),
  updateTag: jest.fn().mockResolvedValue({}),
  deleteTag: jest.fn().mockResolvedValue({}),
  getPageFromTag: jest.fn().mockResolvedValue([{ id: 1, name: "Page 1" }]),
}));

jest.mock("../../src/service/user-service", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue({
    id: 1,
    username: "testuser",
    avatar: "",
    bio: "",
    permid: 1,
  }),
  getAllUsers: jest
    .fn()
    .mockResolvedValue([
      { id: 1, username: "testuser", avatar: "", bio: "", permid: 1 },
    ]),
}));

jest.mock("../../src/service/permission-service", () => ({
  getPermission: jest.fn().mockResolvedValue({ id: 1, tags: true }),
}));

jest.mock("../../src/login/sidebar", () => ({
  instance: () => ({
    mounted: jest.fn(),
  }),
}));

// Test cases
describe("TagComp component tests", () => {
  test("TagComp matches snapshot", (done) => {
    const wrapper = shallow(<TagComp match={{ params: { id: 1 } }} />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
