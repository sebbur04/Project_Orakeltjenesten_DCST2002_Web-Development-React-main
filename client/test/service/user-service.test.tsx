// Import neccessary modules for testing
import axios from "axios";
import userService, { User } from "../../src/service/user-service";

//Made with guidance and help from copilot 
//Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

//Tests for UserService
describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Get user with given id.
  test("GET /users/ + id", async () => {
    const mockUser: User = {
      id: 1,
      username: "testuser",
      avatar: "",
      bio: "",
      permid: 1,
    };
    mockedAxios.get.mockResolvedValue({ data: mockUser });

    const user = await userService.getUser(1);
    expect(user).toEqual(mockUser);
    expect(mockedAxios.get).toHaveBeenCalledWith("/users/1");
  });

  //Get all users
  test("GET /users", async () => {
    const mockUsers: User[] = [
      { id: 1, username: "testuser", avatar: "", bio: "", permid: 1 },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockUsers });

    const users = await userService.getAllUsers();
    expect(users).toEqual(mockUsers);
    expect(mockedAxios.get).toHaveBeenCalledWith("/users");
  });

  //Create new user
  test("POST /signup", async () => {
    const mockId = 1;
    mockedAxios.post.mockResolvedValue({ data: { id: mockId } });

    const id = await userService.signUp("newuser", "password");
    expect(id).toEqual(mockId);
    expect(mockedAxios.post).toHaveBeenCalledWith("/signup", {
      username: "newuser",
      password: "password",
    });
  });

  //Delete user with given id
  test("DELETE /users/ + id", async () => {
    mockedAxios.delete.mockResolvedValue({ data: { id: 1 } });

    const id = await userService.deleteUser(1);
    expect(id).toEqual(1);
    expect(mockedAxios.delete).toHaveBeenCalledWith("/users/1");
  });

  //Update username
  test("PATCH /users/ + userId + /edit/username", async () => {
    mockedAxios.patch.mockResolvedValue({ data: { id: 1 } });

    const id = await userService.updateUsername(1, "newusername");
    expect(id).toEqual(1);
    expect(mockedAxios.patch).toHaveBeenCalledWith("/users/1/edit/username", {
      username: "newusername",
    });
  });

  //Update password
  test("PATCH /users/ + userId + /edit/password", async () => {
    mockedAxios.patch.mockResolvedValue({ data: { id: 1 } });

    const id = await userService.updatePassword(1, "newpassword");
    expect(id).toEqual(1);
    expect(mockedAxios.patch).toHaveBeenCalledWith("/users/1/edit/password", {
      password: "newpassword",
    });
  });

  //Update avatar
  test("PATCH /users/ + userId + /edit/avatar", async () => {
    mockedAxios.patch.mockResolvedValue({ data: { id: 1 } });

    const id = await userService.updateUserAvatar(1, "newavatar");
    expect(id).toEqual(1);
    expect(mockedAxios.patch).toHaveBeenCalledWith("/users/1/edit/avatar", {
      avatar: "newavatar",
    });
  });

  //Update bio
  test("PATCH /users/ + userId + /edit/bio", async () => {
    mockedAxios.patch.mockResolvedValue({ data: { id: 1 } });

    const id = await userService.updateUserBio(1, "newbio");
    expect(id).toEqual(1);
    expect(mockedAxios.patch).toHaveBeenCalledWith("/users/1/edit/bio", {
      bio: "newbio",
    });
  });

  //Update user permid
  test("PATCH /users/ + userId + /edit/permid", async () => {
    const mockUser: User = {
      id: 1,
      username: "testuser",
      avatar: "",
      bio: "",
      permid: 2,
    };
    mockedAxios.patch.mockResolvedValue({ data: { id: 1 } });

    const id = await userService.updateUserPermId(mockUser);
    expect(id).toEqual(1);
    expect(mockedAxios.patch).toHaveBeenCalledWith("/users/1/edit/permid", {
      user: mockUser,
    });
  });

  //Delete user comments
  test("DELETE /users/ + userId + /comments", async () => {
    mockedAxios.delete.mockResolvedValue({});

    await userService.deleteUserComments(1);
    expect(mockedAxios.delete).toHaveBeenCalledWith("/users/1/comments");
  });

  //Login user
  test("POST /login/password", async () => {
    const mockResponse = { data: { token: "token" } };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const response = await userService.login("username", "password");
    expect(response).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith("/login/password", {
      username: "username",
      password: "password",
    });
  });

  //Logout user
  test("POST /logout", async () => {
    mockedAxios.post.mockResolvedValue({});

    await userService.logout();
    expect(mockedAxios.post).toHaveBeenCalledWith("/logout");
  });
});
