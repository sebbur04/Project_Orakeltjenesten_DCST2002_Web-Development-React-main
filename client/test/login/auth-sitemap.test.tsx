// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import Sitemap from "../../src/login/sitemap";

describe("Sitemap Component Tests", () => {
  test("Renders Sitemap correctly", (done) => {
    const wrapper = shallow(<Sitemap />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <h1 className="hero-title">Sitemap</h1>,
          <p className="Hero-text">
            Her er en oversikt over undersider kun for autentiserte brukere
          </p>,
          <li>
            <u>Hjem</u>
          </li>,
          <li>
            <u>Min Profil</u>
          </li>,
          <li>
            <u>Endre Profil eller Bio</u>
          </li>,
          <li>
            <u>Alle Sider</u>
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

  test('Navigates to the profile page when "Min Profil" is clicked', (done) => {
    const wrapper = shallow(<Sitemap />);

    // Simulate click on "Alle Sider" link
    wrapper.find("u").at(1).simulate("click");

    // Check if history.push was called with the correct URL
    setTimeout(() => {
      expect(location.hash).toEqual("#/profile");
      done();
    });
  });

  test('Navigates to the User edit page when "Endre Profil eller Bio" is clicked', (done) => {
    const wrapper = shallow(<Sitemap />);

    // Simulate click on "Logg inn" link
    wrapper.find("u").at(2).simulate("click");

    // Check if history.push was called with the correct URL
    setTimeout(() => {
      expect(location.hash).toEqual("#/useredit");
      done();
    });
  });

  test('Navigates to the All pages page when "Alle Sider" is clicked', (done) => {
    const wrapper = shallow(<Sitemap />);

    // Simulate click on "Logg inn" link
    wrapper.find("u").at(3).simulate("click");

    // Check if history.push was called with the correct URL
    setTimeout(() => {
      expect(location.hash).toEqual("#/allpages");
      done();
    });
  });
});
