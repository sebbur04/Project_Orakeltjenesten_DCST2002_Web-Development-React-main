// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Version from "../../src/login/version";
import permissionService from "../../src/service/permission-service";
import { Alert } from "../../src/widgets";

jest.mock("../../src/service/versionlog-service");
jest.mock("../../src/service/user-service");
jest.mock("../../src/service/permission-service");
jest.mock("../../src/widgets", () => {
  const originalModule = jest.requireActual("../../src/widgets");
  return {
    __esModule: true, // Use this if your module uses ES6 exports
    ...originalModule,
    Alert: { danger: jest.fn() }, // Mock Alert.danger
  };
});

describe("Version component tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Version renders correctly", (done) => {
    const wrapper = shallow(
      <Version match={{ params: { pageid: 1, versionnum: 1 } }} />
    );

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test("Version correctly handles missing permissions", (done) => {
    (permissionService.getPermission as jest.Mock).mockResolvedValueOnce({
      versions: false,
    });
    const wrapper = shallow(
      <Version match={{ params: { pageid: 1, versionnum: 1 } }} />
    );

    setTimeout(() => {
      expect(Alert.danger).toHaveBeenCalledWith(
        "Du har ikke tillatelse til å gjøre dette."
      );
      done();
    }, 100);
  });
});
