// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import UserPermissions from "../../src/login/userperm";
import userService from "../../src/service/user-service";
import permissionService from "../../src/service/permission-service";

jest.mock("../../src/service/user-service", () => ({
  getAuthenticatedUser: jest.fn(() =>
    Promise.resolve({ id: 1, username: "authUser", permid: 1 })
  ),
  getUser: jest.fn(() =>
    Promise.resolve({ id: 2, username: "testUser", permid: 2 })
  ),
  updateUserPermId: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../src/service/permission-service", () => ({
  getPermission: jest.fn((id) =>
    Promise.resolve({
      id,
      alterpages: true,
      deletepages: false,
      versions: true,
      allcomments: false,
      tags: true,
      users: false,
    })
  ),
  updatePermissions: jest.fn(() => Promise.resolve()),
  createPermission: jest.fn(() => Promise.resolve(3)),
}));

describe("UserPermissions component tests", () => {
  test("UserPermissions renders correctly", (done) => {
    const wrapper = shallow(<UserPermissions match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test("UserPermissions correctly handles missing permissions", (done) => {
    (userService.getUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ id: 2, username: "testUser", permid: 0 })
    );

    const wrapper = shallow(<UserPermissions match={{ params: { id: 2 } }} />);

    setTimeout(() => {
      expect(permissionService.createPermission).toHaveBeenCalled();
      expect(userService.updateUserPermId).toHaveBeenCalled();
      done();
    });
  });
});
