// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import DarkModeButton from "../src/darkmode";

//Tests for DarkModeButton, made with guidance and help from copilot
describe("DarkModeButton Component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove("dark-mode");
  });

  test("render without crashing", () => {
    const wrapper = shallow(<DarkModeButton />);
    expect(wrapper.exists()).toBe(true);
  });

  test("turn dark mode off by default", () => {
    const wrapper = shallow(<DarkModeButton />);
    expect(wrapper.find("img").prop("src")).toBe("/dark-mode-icon.png");
    expect(document.body.classList.contains("dark-mode")).toBe(false);
  });

  test("should toggle dark mode on button click", () => {
    const wrapper = shallow(<DarkModeButton />);
    wrapper.find("button").simulate("click");
    expect(wrapper.find("img").prop("src")).toBe("/light-mode-icon.png");
    expect(document.body.classList.contains("dark-mode")).toBe(true);
  });

  test("should save dark mode state to localStorage", () => {
    const wrapper = shallow(<DarkModeButton />);
    wrapper.find("button").simulate("click");
    expect(localStorage.getItem("darkMode")).toBe("true");
  });
});
