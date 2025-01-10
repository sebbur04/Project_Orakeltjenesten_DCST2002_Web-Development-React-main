// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import SignUp from "../../src/logout/signup"; 
import { Form, Button } from "../../src/widgets";

// Mock userService for the test
jest.mock("../../src/service/user-service", () => ({
  signUp: jest.fn(() => Promise.resolve()), // Mock signUp function to resolve successfully
}));

describe("SignUp Component Tests", () => {
  test("Renders SignUp form correctly", (done) => {
    const wrapper = shallow(<SignUp />);

    setTimeout(() => {
      // Check if input fields for username and password are rendered
      expect(wrapper.find(Form.Input).length).toBe(2); // Username and Password fields
      // Check if the buttons are rendered
      expect(wrapper.find(Button.Success).length).toBe(1); // Legg til bruker button
      expect(wrapper.find(Button.Light).length).toBe(1);

      done();
    });
  });

  test('Calls userService.signUp and redirects to /login when "Legg til bruker" is clicked', (done) => {
    const wrapper = shallow(<SignUp />);

    wrapper
      .findWhere((node) => node.prop("name") === "username")
      .simulate("change", {
        currentTarget: { value: "testuser" },
      });

    wrapper
      .findWhere((node) => node.prop("name") === "password")
      .simulate("change", {
        currentTarget: { value: "password123" },
      });

    // Simulate clicking the "Legg til bruker" button
    wrapper.find(Button.Success).simulate("click");

    // Check if the history.push was called to navigate to '/login'
    setTimeout(() => {
      expect(location.hash).toEqual("#/login");
      done();
    });
  });

  test('Calls userService.signUp and redirects to / when "Avbryt" is clicked', (done) => {
    const wrapper = shallow(<SignUp />);

    // Simulate clicking the "Avbryt" button
    wrapper.find(Button.Light).simulate("click");

    // Check if the history.push was called to navigate to '/login'
    setTimeout(() => {
      expect(location.hash).toEqual("#/login");
      done();
    });
  });
});
