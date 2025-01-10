// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import AllPages from "../../src/same/all-pages";
import { Column } from "../../src/widgets";

// Mocking the service calls
jest.mock("../../src/service/page-service", () => {
  return {
    getAllPages: () =>
      Promise.resolve([
        { id: 1, name: "Page 1" },
        { id: 2, name: "Page 2" },
        { id: 3, name: "Page 3" },
      ]),
  };
});

jest.mock("../../src/service/versionlog-service", () => {
  return {
    getAllVersions: () =>
      Promise.resolve([
        {
          id: 1,
          version: 1,
          pageid: 1,
          userid: 1,
          date: "2024-11-16T10:00:00Z",
        },
        {
          id: 2,
          version: 2,
          pageid: 2,
          userid: 2,
          date: "2024-11-16T11:00:00Z",
        },
        {
          id: 3,
          version: 3,
          pageid: 3,
          userid: 3,
          date: "2024-11-16T11:00:00Z",
        },
      ]),
  };
});

jest.mock("../../src/service/user-service", () => {
  return {
    getAllUsers: () =>
      Promise.resolve([
        { id: 1, username: "user1", avatar: "", bio: "", permid: 0 },
        { id: 2, username: "user2", avatar: "", bio: "", permid: 0 },
      ]),
  };
});

describe("allPages Component", () => {
  test("renders pages and user data correctly", (done) => {
    const wrapper = shallow(<AllPages />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column width={6}>
            <a className="blue-link" href={"/#/pages/1"}>
              Page 1
            </a>
          </Column>,
          <Column width={3}>{`Sist endret: 2024-11-16 10:00`}</Column>,
          <Column>
            <div>
              <span>Av: &nbsp;</span>
              <a className="blue-link" href={`/#/users/1`}>
                user1
              </a>
            </div>
          </Column>,
          <Column width={6}>
            <a className="blue-link" href={"/#/pages/2"}>
              Page 2
            </a>
          </Column>,
          <Column width={3}>{`Sist endret: 2024-11-16 11:00`}</Column>,
          <Column>
            <div>
              <span>Av: &nbsp;</span>
              <a className="blue-link" href={`/#/users/2`}>
                user2
              </a>
            </div>
          </Column>,
          <Column width={6}>
            <a className="blue-link" href={"/#/pages/3"}>
              Page 3
            </a>
          </Column>,
          <Column width={3}>{`Sist endret: 2024-11-16 11:00`}</Column>,
          <Column>
            <span>Slettet bruker</span>
          </Column>,
        ])
      );

      done();
    });
  });
});
