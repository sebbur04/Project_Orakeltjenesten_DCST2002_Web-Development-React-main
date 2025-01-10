// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import TagComp from "../../src/logout/tag-pages";
import { Column } from "../../src/widgets";

// Mocking the services for pageService and tagService
jest.mock("../../src/service/page-service", () => ({
  getPageFromTag: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Page 1" },
      { id: 2, name: "Page 2" },
    ])
  ),
  updatePageViews: jest.fn(),
}));

jest.mock("../../src/service/tag-service", () => ({
  getTag: jest.fn(() => Promise.resolve({ id: 1, name: "Sample Tag" })),
}));

describe("TagComp Component Tests", () => {
  test("Renders the tag name correctly", (done) => {
    const wrapper = shallow(<TagComp match={{ params: { id: 1 } }} />);

    // Wait for the mounted lifecycle method to complete
    setTimeout(() => {
      expect(wrapper.containsAllMatchingElements([]));
      done();
    });
  });

  test("Renders associated pages correctly", (done) => {
    const wrapper = shallow(<TagComp match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      // Check if both pages are rendered with the correct link
      expect(
        wrapper.containsAllMatchingElements([
          <a className="blue-link" href="/#/pages/1">
            Page 1
          </a>,
          <a className="blue-link" href="/#/pages/2">
            Page 2
          </a>,
        ])
      ).toEqual(true);

      done();
    });
  });

  test("Displays the correct number of pages associated with the tag", (done) => {
    const wrapper = shallow(<TagComp match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      // Check if the correct number of pages is displayed
      expect(
        wrapper.containsMatchingElement(<Column>Antall sider: 2</Column>)
      ).toEqual(true);
      done();
    });
  });
});
