// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Version from "../../src/logout/page-version";
import { Card, Form } from "../../src/widgets";
import Markdown from "markdown-to-jsx";

jest.mock("../../src/service/versionlog-service", () => ({
  getVersion: jest.fn(() =>
    Promise.resolve({
      id: 1,
      content: "## Sample Content for Version 1",
      userid: 1,
      date: "2024-01-01T12:00:00Z",
      changelog: "Initial version",
      version: 1,
      pageid: 1,
    })
  ),
  getAllPageVersions: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        content: "## Version 1 Content",
        userid: 1,
        date: "2024-01-01T12:00:00Z",
        changelog: "Initial version",
        version: 1,
        pageid: 1,
      },
      {
        id: 2,
        content: "## Version 2 Content",
        userid: 2,
        date: "2024-02-01T12:00:00Z",
        changelog: "Second version",
        version: 2,
        pageid: 1,
      },
    ])
  ),
}));

jest.mock("../../src/service/page-service", () => ({
  getPage: jest.fn(() =>
    Promise.resolve({
      id: 1,
      name: "Sample Page",
      num_views: 123,
    })
  ),
}));

describe("Version Component Tests", () => {
  test("Renders current version information correctly", (done) => {
    const wrapper = shallow(
      <Version match={{ params: { pageid: 1, versionnum: 1 } }} />
    );

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Card title={'"Sample Page" versjon 1'}></Card>,
          <Markdown>## Sample Content for Version 1</Markdown>,
        ])
      ).toEqual(true);

      done();
    });
  });

  test("Renders select options for comparing versions correctly", (done) => {
    const wrapper = shallow(
      <Version match={{ params: { pageid: 1, versionnum: 1 } }} />
    );

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <option value={1}>versjon 1</option>,
          <option value={2}>versjon 2</option>,
        ])
      ).toEqual(true);

      done();
    });
  });

  test("Compares another version", (done) => {
    const wrapper = shallow(
      <Version match={{ params: { pageid: 1, versionnum: 1 } }} />
    );

    wrapper
      .find(Form.Checkbox)
      .simulate("change", { currentTarget: { checked: true } });

    wrapper
      .find(Form.Select)
      .simulate("change", { currentTarget: { value: "2" } });

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Markdown>## Version 2 Content</Markdown>,
        ])
      ).toBe(true);

      done();
    });
  });
});
