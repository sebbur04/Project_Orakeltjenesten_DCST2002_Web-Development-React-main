// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import TopBar from "../../src/login/topbar";

jest.mock("../../src/service/user-service", () => ({
  logout: jest.fn().mockResolvedValue(undefined),
}));

describe("TopBar component tests", () => {
  test("TopBar renders correctly", (done) => {
    const wrapper = shallow(<TopBar />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test("Orakeltjenesten Button takes you to home", (done) => {
    const wrapper = shallow(<TopBar />);

    wrapper.find("a").at(0).simulate("click");

    setTimeout(() => {
      expect(location.hash).toEqual("#/");
      done();
    });
  });
});
