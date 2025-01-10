// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import ProfileEdit from "../../src/login/profile-edit";

// Mock services
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
  updateUserBio: jest.fn(() => Promise.resolve()),
  updateUserAvatar: jest.fn(() => Promise.resolve()),
  updateUsername: jest.fn(() => Promise.resolve()),
  updatePassword: jest.fn(() => Promise.resolve()),
}));

describe("ProfileEdit Component Tests", () => {
  test("Renders ProfileEdit form correctly", (done) => {
    // @ts-ignore
    const wrapper = shallow(<ProfileEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();

      done();
    });
  });
});
