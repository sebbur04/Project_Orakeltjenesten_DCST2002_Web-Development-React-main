// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Users from "../../src/login/users";
import userService from "../../src/service/user-service";
import permissionService from "../../src/service/permission-service";

jest.mock("../../src/service/user-service");
jest.mock("../../src/service/permission-service");

describe("Users component tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Users renders correctly", (done) => {
    (userService.getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: 1,
      username: "testUser",
      permid: 1,
    });
    (permissionService.getPermission as jest.Mock).mockResolvedValue({
      users: true,
    });
    (userService.getAllUsers as jest.Mock).mockResolvedValue([
      { id: 2, username: "user1" },
      { id: 3, username: "user2" },
    ]);

    const wrapper = shallow(<Users />);

    setTimeout(() => {
      wrapper.update();
      expect(
        wrapper.containsMatchingElement(<h3>Mangler rettigheter</h3>)
      ).toEqual(false);
      expect(wrapper).toMatchSnapshot();
      done();
    }, 500);
  });

  test("Users correctly handles missing permissions", (done) => {
    (userService.getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: 1,
      username: "testUser",
      permid: 1,
    });
    (permissionService.getPermission as jest.Mock).mockResolvedValue({
      users: false,
    });

    const wrapper = shallow(<Users />);

    setTimeout(() => {
      wrapper.update();
      expect(
        wrapper.containsMatchingElement(<h3>Mangler rettigheter</h3>)
      ).toEqual(true);
      done();
    }, 500);
  });
});
