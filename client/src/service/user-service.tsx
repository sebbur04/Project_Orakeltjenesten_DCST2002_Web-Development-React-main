import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/v2";

export type User = {
  id: number;
  username: string;
  avatar: string;
  bio: string;
  permid: number;
};

class UserService {
  /**
   * Get user with given id.
   */
  async getUser(id: number) {
    const response = await axios.get<User>("/users/" + id);

    return response.data;
  }

  async getUserAuth() {
    try {
      const response = await axios.get("/users/auth"); // Adjust the endpoint as needed

      return response.data; // Returns the user data or throws an error if not authenticated
    } catch (error) {
      return error;
    }
  }

  async getAuthenticatedUser() {
    try {
      const response = await userService.getUserAuth();

      return response.user;
    } catch (error) {
      return error;
    }
  }

  /**
   * Get all users.
   */
  async getAllUsers() {
    const response = await axios.get<User[]>("/users");

    return response.data;
  }

  /**
   * Create new user having the given username.
   *
   * Resolves the newly created page id.
   */
  async signUp(username: string, password: string) {
    try {
      const response = await axios.post<{ id: number }>("/signup", {
        username: username,
        password: password,
      });

      return response.data.id;
    } catch (error) {
      throw error;
    }
  }

  //Delete user with given id.
  async deleteUser(id: number) {
    const response = await axios.delete("/users/" + id);

    return response.data.id;
  }

  async updateUsername(userId: number, username: string) {
    const response = await axios.patch("/users/" + userId + "/edit/username", {
      username: username,
    });

    return response.data.id;
  }

  async updatePassword(userId: number, password: string) {
    const response = await axios.patch("/users/" + userId + "/edit/password", {
      password: password,
    });

    return response.data.id;
  }

  async updateUserAvatar(userId: number, avatar: string) {
    const response = await axios.patch("/users/" + userId + "/edit/avatar", {
      avatar: avatar,
    });

    return response.data.id;
  }

  async updateUserBio(userId: number, bio: string) {
    const response = await axios.patch("/users/" + userId + "/edit/bio", {
      bio: bio,
    });

    return response.data.id;
  }

  async updateUserPermId(user: User) {
    const response = await axios.patch("/users/" + user.id + "/edit/permid", {
      user: user,
    });

    return response.data.id;
  }
  /**
   * Check if username and password is correct and exists
   * Denne må nok kanskje endress
   */
  async login(username: string, password: string) {
    const response = await axios.post("/login/password", {
      username,
      password,
    });

    return response.data;
  }

  async logout() {
    await axios.post("/logout");

    return;
  }

  async deleteUserComments(userId: number) {
    try {
      await axios.delete("/users/" + userId + "/comments");

      return;
    } catch (error) {
      console.error(error);
    }
  }
}

const userService = new UserService();
export default userService;
