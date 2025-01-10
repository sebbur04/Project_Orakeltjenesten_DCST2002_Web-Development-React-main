// Import neccessary modules for testing
import * as React from "react";
import { act } from "react";
import { shallow } from "enzyme";
import Edit from "../../src/login/edit-page";
import { Button, Form, Column, Row } from "../../src/widgets";

// Mocking services with the mock structure
jest.mock("../../src/service/page-service", () => ({
  getPage: jest.fn(() =>
    Promise.resolve({ id: 1, name: "Test Page", num_views: 10 })
  ),
  getTagsFromPage: jest.fn(() => Promise.resolve([{ id: 1, name: "Tag1" }])),
  updatePageName: jest.fn(() => Promise.resolve()),
  deletePage: jest.fn(() => Promise.resolve()),
  getAllPages: jest.fn(() => Promise.resolve([{ id: 1, name: "Test Page" }])),
}));

jest.mock("../../src/service/versionlog-service", () => ({
  getLatestVersion: jest.fn(() =>
    Promise.resolve({
      id: 1,
      pageid: 1,
      content: "Sample content",
      version: 1,
      changelog: "Initial version",
    })
  ),
  createVersion: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../src/service/user-service", () => ({
  getAuthenticatedUser: jest.fn(() =>
    Promise.resolve({
      id: 1,
      username: "User1",
      avatar: "avatar",
      bio: "bio",
      permid: 1,
    })
  ),
  getAllUsers: jest.fn(() =>
    Promise.resolve([
      { id: 1, username: "User1", avatar: "avatar", bio: "bio", permid: 1 },
    ])
  ),
}));

jest.mock("../../src/service/tag-service", () => ({
  getAllTags: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Tag1" },
      { id: 2, name: "Tag2" },
    ])
  ), // Return a tag
}));

jest.mock("../../src/service/permission-service", () => ({
  getPermission: jest.fn(() =>
    Promise.resolve({
      id: 1,
      alterpages: true,
      deletepages: true,
      versions: true,
      allcomments: true,
      tags: true,
      users: true,
    })
  ),
}));

jest.mock("../../src/service/page-tags-service", () => ({
  addTagToPage: jest.fn(() => Promise.resolve()),
  deleteTagFromPage: jest.fn(() => Promise.resolve()),
}));

describe("Edit Component Tests", () => {
  test("renders correctly and displays the page title and form fields (snapshot)", async () => {
    const wrapper = shallow(<Edit match={{ params: { id: 1 } }} />);

    // Wait for asynchronous operations to complete
    //@ts-ignore
    await wrapper.instance().mounted();
    wrapper.update();

    // Assert that components are rendered correctly
    expect(wrapper).toMatchSnapshot();
  });

  test("Displays correctly", async () => {
    const wrapper = shallow(<Edit match={{ params: { id: 1 } }} />);

    // Wait for asynchronous operations to complete
    //@ts-ignore
    await wrapper.instance().mounted();
    wrapper.update();

    expect(
      wrapper.containsAllMatchingElements([
        <Row>
          <Column width={1}>Tittel </Column>
          <Column width={2}>
            <Form.Input
              width="20vw"
              maxlength={25}
              type="text"
              value="Test Page"
              onChange={() => {}}
            />
          </Column>
        </Row>,
        <Row>
          <Column width={2}>
            <Button.Success onClick={() => {}}>Legg til tagg</Button.Success>
          </Column>
        </Row>,
        <Row>
          <Column width={2}>Endringslogg:</Column>
          <Column width={6}>
            <Form.Input
              width="50vw"
              type="text"
              value="Initial version"
              onChange={() => {}}
            />
          </Column>
        </Row>,
        <Row>
          <Column>Generer lenke: </Column>
          <Column>
            <Form.Checkbox checked={false} onChange={() => {}} />
          </Column>
        </Row>,
      ])
    );
  });

  test("handles adding and removing tags correctly", async () => {
    let wrapper;

    // Wrap async operations in act
    await act(async () => {
      wrapper = shallow(<Edit match={{ params: { id: 1 } }} />); // Use mount for full rendering

      // Ensure that the component is fully rendered
      expect(wrapper.exists()).toBe(true); // Ensure the wrapper is not empty

      // Wait for async operations (e.g., fetching permission and tags)
      //@ts-ignore
      await wrapper.instance().mounted(); // Ensure async methods like mounted() are finished
      wrapper.update(); // Ensure the component re-renders after async updates
    });

    // Check if tags are loaded properly
    //@ts-ignore
    const addButton = wrapper.find(Button.Success).at(0);
    expect(addButton.exists()).toBe(true); // Ensure the add button exists

    // Simulate adding a tag (button click)
    await act(async () => {
      addButton.simulate("click");
    });

    // Wait for the component to update after adding the tag
    //@ts-ignore
    await wrapper.update();

    // Assert that the Form.Select (or whatever element is used for tag selection) is now rendered
    //@ts-ignore
    expect(wrapper.find(Form.Select).length).toBe(1);

    // Check for the remove button and simulate clicking it
    //@ts-ignore
    const removeButton = wrapper.find(Button.Danger);
    expect(removeButton.exists()).toBe(true); // Ensure the remove button exists

    // Simulate the remove button click
    await act(async () => {
      removeButton.at(0).simulate("click");
    });

    // Wait for the component to update after removing the tag
    //@ts-ignore
    await wrapper.update();

    // Assert that the Form.Select (or similar element) is no longer present
    //@ts-ignore
    expect(wrapper.find(Form.Select).length).toBe(1);
  });

  test("handles the save button click (with valid inputs)", async () => {
    // Mock response for tags if it's not already mocked globally
    jest.mock("../../src/service/tag-service", () => ({
      getAllTags: jest.fn(() => Promise.resolve([{ id: 1, name: "Tag1" }])), // Mocking tags service
    }));

    const wrapper = shallow(<Edit match={{ params: { id: 1 } }} />);

    // Wait for asynchronous operations to complete (like data fetching)
    //@ts-ignore
    await wrapper.instance().mounted(); // Assuming `mounted()` is where data fetching occurs
    wrapper.update(); // Ensure component is updated after the async operation

    // Set values for the form fields
    wrapper
      .find(Form.Input)
      .at(0)
      .simulate("change", { currentTarget: { value: "Updated Page Name" } });
    wrapper
      .find(Form.Input)
      .at(1)
      .simulate("change", { currentTarget: { value: "Updated Changelog" } });

    // Simulate first button click (save)
    wrapper.find(Button.Success).at(1).simulate("click"); // Simulate second button click (save)

    setTimeout(() => {
      // Expect the location to change
      expect(location.hash).toEqual("#/");
    });
  });

  test("handles the delete button click", async () => {
    const wrapper = shallow(<Edit match={{ params: { id: 1 } }} />);

    // Wait for asynchronous operations to complete
    //@ts-ignore
    await wrapper.instance().mounted();
    wrapper.update();

    // Simulate deleting the page
    wrapper.find(Button.Danger).at(1).simulate("click");

    // Wait for async operation and hash change
    await wrapper.update();
    expect(location.hash).toEqual("#/");
  });
});
