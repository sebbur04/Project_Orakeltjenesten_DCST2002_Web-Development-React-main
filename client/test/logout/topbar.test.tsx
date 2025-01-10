// Import neccessary modules for testing
import React from "react";
import { shallow } from "enzyme";
import { Button } from "../../src/widgets";
import TopBar from "../../src/logout/topbar";
import DarkModeButton from "../../src/darkmode";
import SearchBar from "../../src/same/searchbar";

jest.mock("../../src/darkmode", () => () => (
  <div className="dark-mode-button" />
));
jest.mock("../../src/same/searchbar", () => () => (
  <div className="search-bar" />
));

describe("TopBar Component", () => {
  test("Renders the title correctly", (done) => {
    const wrapper = shallow(<TopBar />);

    setTimeout(() => {
      //Check if Main title is rendered
      expect(
        wrapper.containsMatchingElement(
          <a className="orakel-title" href="/#/">
            Orakeltjenesten
          </a>
        )
      ).toBe(true);
      done();
    });
  });

  test("Renders the search bar", (done) => {
    const wrapper = shallow(<TopBar />);

    setTimeout(() => {
      // Check if SearchBar is rendered
      expect(wrapper.find(SearchBar).length).toBe(1);
      done();
    });
  });

  test("Renders the DarkModeButton", (done) => {
    const wrapper = shallow(<TopBar />);

    setTimeout(() => {
      // Check if DarkModeButton is rendered
      expect(wrapper.find(DarkModeButton).length).toBe(1);
      done();
    });
  });

  test("Login button is rendered and redirects to login page on click", (done) => {
    const wrapper = shallow(<TopBar />);

    // Check if the login button is rendered
    setTimeout(() => {
      expect(wrapper.find(Button.Light).length).toBe(1);
    });

    // Simulate click event and check if it pushes to '/login' route
    wrapper.find(Button.Light).simulate("click");

    // Make sure that `history.push` was called
    setTimeout(() => {
      expect(location.hash).toEqual("#/login");
      done();
    });
  });
});
