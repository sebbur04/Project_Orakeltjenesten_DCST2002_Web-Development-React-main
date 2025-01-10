// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Sidebar from "../../src/logout/sidebar";
import { Row } from "../../src/widgets";
import tagService from "../../src/service/tag-service";

jest.mock("../../src/service/tag-service", () => ({
  getAllTags: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Tag1" },
      { id: 2, name: "Tag2" },
    ])
  ),
}));

jest.mock("../../src/service/page-service", () => ({
  checkForEmptyPages: jest.fn(() => Promise.resolve()),
}));

describe("Sidebar Component Tests", () => {
  test("Renders basic navigation links correctly", (done) => {
    const wrapper = shallow(<Sidebar />);

    setTimeout(() => {
      // Check that the navigation links render correctly
      expect(wrapper).toMatchSnapshot();

      done();
    });
  });

  test("Correctly handles tag fetching error", (done) => {
    // Mock tagService to simulate an error in fetching tags
    tagService.getAllTags = jest.fn(() =>
      Promise.reject("Error fetching tags")
    );

    const wrapper = shallow(<Sidebar />);

    setTimeout(() => {
      // Check if no tags are rendered when fetching fails
      expect(wrapper.find(Row).length).toBe(2); // Only "Hjem" and "Alle sider" links
      done();
    });
  });
});
