// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Sitemap from "../../src/logout/sitemap";

describe("Sitemap Component Tests", () => {
  test("Renders Sitemap correctly", (done) => {
    const wrapper = shallow(<Sitemap />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <h1 className="hero-title">Sitemap</h1>,
          <p className="Hero-text"> Her er en oversikt over undersider </p>,
          <li>
            <u>Hjem</u>
          </li>,
          <li>
            <u>Alle Sider</u>
          </li>,
          <li>
            <u>Logg inn</u>
          </li>,
        ])
      ).toBe(true);
      done();
    });
  });

  test('Navigates to the home page when "Hjem" is clicked', (done) => {
    const wrapper = shallow(<Sitemap />);

    // Simulate click on "Hjem" link
    wrapper.find("u").at(0).simulate("click");

    // Check if history.push was called with the correct URL
    setTimeout(() => {
      expect(location.hash).toEqual("#/");
      done();
    });
  });

  test('Navigates to the "All Pages" page when "Alle Sider" is clicked', (done) => {
    const wrapper = shallow(<Sitemap />);

    // Simulate click on "Alle Sider" link
    wrapper.find("u").at(1).simulate("click");

    // Check if history.push was called with the correct URL
    setTimeout(() => {
      expect(location.hash).toEqual("#/allpages");
      done();
    });
  });

  test('Navigates to the login page when "Logg inn" is clicked', (done) => {
    const wrapper = shallow(<Sitemap />);

    // Simulate click on "Logg inn" link
    wrapper.find("u").at(2).simulate("click");

    // Check if history.push was called with the correct URL
    setTimeout(() => {
      expect(location.hash).toEqual("#/login");
      done();
    });
  });
});
