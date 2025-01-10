// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Login from "../../src/logout/login";
import { Form, Button, Alert } from "../../src/widgets";

jest.mock("../../src/service/user-service", () => ({
  login: jest.fn((username, password) => {
    if (username === "validUser" && password === "validPass") {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Invalid credentials"));
    }
  }),
}));

describe("Login component tests", () => {
  test("Login renders correctly", (done) => {
    const wrapper = shallow(<Login />);

    setTimeout(() => {
      expect(
        wrapper.containsMatchingElement(
          <h3>Logg inn for å kommentere, opprette og redigere sider!</h3>
        )
      ).toEqual(true);

      expect(wrapper.find(Form.Input).length).toEqual(2); // Username and password fields
      expect(wrapper.find(Button.Success).length).toEqual(1); // Login button
      expect(wrapper.find(Button.Light).length).toEqual(1); // Signup button
      done();
    });
  });

  test("Displays alert if fields are empty", (done) => {
    const wrapper = shallow(<Login />);
    const alertWrapper = shallow(<Alert />);

    wrapper.find(Button.Success).simulate("click");

    setTimeout(() => {
      expect(
        alertWrapper.containsAllMatchingElements([
          <div>
            <div>
              Vennligst fyll inn brukernavn og passord
              <button />
            </div>
          </div>,
        ])
      ).toBe(true);
      done();
    });
  });

  test("Handles successful login", (done) => {
    const wrapper = shallow(<Login />);

    //Used chatGPT here as we havent been shown how to access one specific widget with wrapper.find() if there are multiple Form.Inputs for example
    wrapper
      .findWhere((node) => node.prop("name") === "username")
      .simulate("change", {
        currentTarget: { value: "validUser" },
      });

    wrapper
      .findWhere((node) => node.prop("name") === "password")
      .simulate("change", {
        currentTarget: { value: "validPass" },
      });

    wrapper.find(Button.Success).simulate("click");

    setTimeout(() => {
      expect(location.hash).toEqual("#/profile");
      done();
    });
  });

  test('Handles "Opprett ny bruker" button click', (done) => {
    const wrapper = shallow(<Login />);

    wrapper.find(Button.Light).simulate("click");
    setTimeout(() => {
      expect(location.hash).toEqual("#/signup");

      done();
    });
  });
});
