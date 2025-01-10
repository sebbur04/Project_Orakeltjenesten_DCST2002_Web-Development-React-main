// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import SearchBar from "../../src/same/searchbar"; 
import { Form } from "../../src/widgets";

// Mock the pageService
jest.mock("../../src/service/page-service", () => ({
  getAllPages: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Page One" },
      { id: 2, name: "Page Two" },
      { id: 3, name: "Another" },
    ])
  ),
}));

describe("SearchBar Component Tests", () => {
  test("Renders the search bar input", (done) => {
    const wrapper = shallow(<SearchBar />);

    setTimeout(() => {
      expect(wrapper.find(Form.Input).length).toBe(1);

      done();
    });
  });

  test("Filters results correctly based on search input", (done) => {
    const wrapper = shallow(<SearchBar />);

    // Simulate input change
    wrapper.find(Form.Input).simulate("change", {
      currentTarget: { value: "Page" },
    });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <li className="search-list" key={1}>
            Page One
          </li>,
          <li className="search-list" key={2}>
            Page Two
          </li>,
        ])
      );
    });

    wrapper.find(Form.Input).simulate("change", {
      currentTarget: { value: "Another" },
    });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <li className="search-list" key={3}>
            Another
          </li>,
        ])
      );
      done();
    });
  });
});
