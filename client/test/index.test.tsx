// Import neccessary modules for testing
import React from "react";
import { mount } from "enzyme";
import App, { useAuth } from "../src/index";
import { HashRouter } from "react-router-dom";

// Mock the useAuth hook while preserving other exports from '../src/index'
jest.mock("../src/index", () => ({
  __esModule: true,
  ...jest.requireActual("../src/index"), //Help from copilot
  useAuth: jest.fn(),
}));

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render as a non-authenticated user", () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      user: { id: 0, username: "", avatar: "", bio: "", permid: 0 },
    }));
    const wrapper = mount(<App />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(HashRouter).exists()).toBe(true);
    expect(wrapper.find("TopBar").exists()).toBe(true);
    expect(wrapper.find("Sidebar").exists()).toBe(true);
    expect(wrapper.find("Main").exists()).toBe(true);
    expect(wrapper.find("TopBar").exists()).toBe(true);
    expect(wrapper.find("Sidebar").exists()).toBe(true);
    expect(wrapper.find("Main").exists()).toBe(true);
  });
});
