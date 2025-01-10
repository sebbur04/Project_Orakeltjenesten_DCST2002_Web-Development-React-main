// Import neccessary modules for testing
import * as React from "react";
import { shallow } from "enzyme";
import ProfileView from "../../src/same/profile-view"; 
import { Card } from "../../src/widgets";

// Mock userService
jest.mock("../../src/service/user-service", () => ({
  getUser: jest.fn((id) =>
    Promise.resolve({
      id,
      username: `user${id}`,
      avatar: `https://example.com/avatar${id}.png`,
      bio: `This is user${id}'s bio.`,
      permid: 0,
    })
  ),
}));

describe("ProfileView Component Tests", () => {
  test("Renders user profile data correctly", (done) => {
    const match = { params: { id: 1 } };
    const wrapper = shallow(<ProfileView match={match} />);

    // Wait for state to update after async operation in mounted()
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Card title="">
            <div>
              <img
                className="imgstyle"
                src="https://example.com/avatar1.png"
                alt="avatar-image.png"
              />
              <h1 className="hero-title">user1</h1>
              <h3>Bio:</h3>
              <p>This is user1's bio.</p>
            </div>
          </Card>,
        ])
      );

      done();
    });
  });
});
