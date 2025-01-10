// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Main from "../../src/same/main"; 
import { Row } from "../../src/widgets";
import pageService from "../../src/service/page-service";

jest.mock("../../src/service/page-service", () => ({
  getOrderedPages: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Page 1" },
      { id: 2, name: "Page 2" },
    ])
  ),
}));

jest.mock("../../src/index", () => ({
  history: {
    push: jest.fn(),
  },
}));

describe("Main Component Tests", () => {
  test("Renders welcome text and contact information", () => {
    const wrapper = shallow(<Main />);

    expect(
      wrapper.containsAllMatchingElements([
        <h2>Velkommen til Orakeltjenesten</h2>,
        <p>
          Orakeltjenesten ved NTNU kan hjelpe studenter og ansatte med
          IT-problemstillinger. <br></br>
          Vi kan nås gjennom NTNU Hjelp, ved å ringe oss på telefon, eller ved å
          besøke en av våre fysiske skranker på campus. <br></br>
          Aldri oppgi passord til oss når du tar kontakt med Orakeltjenesten.{" "}
        </p>,
        <b>
          Orakeltjenesten kan også nås for øyeblikelig hjelp ved å ringe tlf: 73
          59 15 00
        </b>,
      ])
    ).toBe(true);
  });

  test("Renders a list of pages fetched from the service", (done) => {
    const wrapper = shallow(<Main />);

    setTimeout(() => {
      wrapper.update(); // Ensure the component re-renders with updated state
      expect(
        wrapper.containsMatchingElement(
          <Row>
            <a className="blue-link" href="/#/pages/1">
              Page 1
            </a>
          </Row>
        )
      ).toBe(true);

      expect(
        wrapper.containsMatchingElement(
          <Row>
            <a className="blue-link" href="/#/pages/2">
              Page 2
            </a>
          </Row>
        )
      ).toBe(true);

      done();
    });
  });

  test("Handles empty pages list gracefully", (done) => {
    pageService.getOrderedPages = jest.fn(() => Promise.resolve([])); // Simulate empty response
    const wrapper = shallow(<Main />);

    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find(Row).length).toBe(0); // No rows rendered
      done();
    });
  });
});
