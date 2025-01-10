// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Profile from "../../src/login/profile";
import userService, { User } from "../../src/service/user-service";

jest.mock("../../src/service/user-service", () => {
  return {
    getAllUsers: jest.fn(),
    getAuthenticatedUser: jest.fn(),
    deleteUserComments: jest.fn(),
    deleteUser: jest.fn(),
    logout: jest.fn(),
  };
});

describe("Profile component tests", () => {
  beforeEach(() => {
    const users: User[] = [
      {
        id: 1,
        username: "testuser",
        avatar: "avatar.png",
        bio: "Test bio",
        permid: 1,
      },
      {
        id: 1,
        username: "testuser",
        avatar: "avatar.png",
        bio: "Test bio",
        permid: 1,
      },
    ];
    (userService.getAllUsers as jest.Mock).mockResolvedValue(users);
    (userService.getAuthenticatedUser as jest.Mock).mockResolvedValue(users[0]);
  });

  test("Profile renders user information correctly", (done) => {
    const wrapper = shallow(<Profile />);
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find("img").prop("src")).toEqual("avatar.png");
      expect(wrapper.find("h1").text()).toContain("testuser");
      expect(wrapper.find("p").text()).toEqual("Test bio");
      expect(wrapper.find("img").prop("src")).toEqual("avatar.png");
      expect(wrapper.find("h1").text()).toContain("testuser");
      expect(wrapper.find("p").text()).toEqual("Test bio");
      done();
    });
  });
});
