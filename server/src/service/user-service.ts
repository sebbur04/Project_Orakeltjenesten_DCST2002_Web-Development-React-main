// Import mysql pool, RowDataPacket and ResultSetHeader from mysql2, and crypto from crypto.
import { pool } from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import crypto from "crypto";

//Type for user
export type User = {
  id: number;
  username: string;
  hashedPassword: Buffer;
  salt: Buffer;
  avatar: string;
  bio: string;
  permid: number;
};

//Service for user
class UserService {
  /**
   * Get user with given id.
   */
  getUser(id: number) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Users WHERE id = ?",
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as User);
        }
      );
    });
  }

  /**
   * Get user with given username.
   */
  getUserFromUsername(username: string) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Users WHERE username=?",
        [username],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);
          if (results.length == 0) {
            return reject(new Error("No user found"));
          }

          //This is from ChatGPT after a lot of problems with the type in the comparison of the hashed passwords.
          const user: User = {
            id: results[0].id,
            username: results[0].username,
            hashedPassword: results[0].hashed_password, // Ensure you access the correct column name
            salt: results[0].salt, // Ensure you access the correct column name
            avatar: results[0].avatar,
            bio: results[0].bio,
            permid: results[0].permid,
          };

          resolve(user);
        }
      );
    });
  }

  /**
   * Get user with given username.
   */
  getUsername(username: string) {
    return new Promise<User | undefined>((resolve, reject) => {
      pool.query(
        "SELECT username FROM Users WHERE username=?",
        [username],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as User);
        }
      );
    });
  }

  /**
   * Get all users.
   */
  getAllUsers() {
    return new Promise<User[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Users",
        [],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as User[]);
        }
      );
    });
  }

  /**
   * Delete specific user with given id.
   */
  deleteUser(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Users WHERE id = ?",
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows === 0) reject(new Error("No row deleted"));

          resolve();
        }
      );
    });
  }

  /**
   * Update username
   */
  updateUsername(userId: number, username: string) {
    return new Promise<User>((resolve, reject) => {
      pool.query(
        "UPDATE Users Set username = ? WHERE id = ?",
        [username, userId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as User);
        }
      );
    });
  }

  /**
   * Update user password
   */
  updatePassword(userId: number, password: string) {
    const salt = crypto.randomBytes(16);
    return new Promise<User>((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        310000,
        32,
        "sha256",
        (error, hashedPassword) => {
          if (error) return reject(error);
          pool.query(
            "UPDATE Users Set hashed_password = ?, salt=? WHERE id = ?",
            [hashedPassword, salt, userId],
            (error, results: RowDataPacket[]) => {
              if (error) return reject(error);

              resolve(results[0] as User);
            }
          );
        }
      );
    });
  }

  /**
   * Update user permid
   */
  updateUserPermId(user: User) {
    return new Promise<User>((resolve, reject) => {
      pool.query(
        "UPDATE Users Set permid = ? WHERE id = ?",
        [user.permid, user.id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as User);
        }
      );
    });
  }

  /**
   * Create new user having the given username and password
   * Resolves the newly created user id.
   */
  createUser(username: string, password: string, permId: number) {
    const salt = crypto.randomBytes(16);

    return new Promise<number>((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        310000,
        32,
        "sha256",
        (error, hashedPassword) => {
          if (error) return reject(error);
          pool.query(
            "Insert INTO Users SET username=?, hashed_password=?, salt=?, permid=?, avatar='/user-avatars/img_avatar_1.png'",
            [username, hashedPassword, salt, permId],
            (error, results: ResultSetHeader) => {
              if (error) return reject(error);
              return resolve(results.insertId);
            }
          );
        }
      );
    });
  }

  /**
   * Update user avatar
   */
  updateUserAvatar(userId: number, avatar: string) {
    return new Promise<User>((resolve, reject) => {
      pool.query(
        "UPDATE Users SET avatar = ? WHERE id = ?",
        [avatar, userId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as User);
        }
      );
    });
  }

  /**
   * Update user bio
   */
  updateUserBio(userId: number, bio: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        "UPDATE Users SET bio=? WHERE id=?",
        [bio, userId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }

  /**
   * Delete all comments made by a specific user
   */
  deleteUserComments(userId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Comments WHERE userid=?",
        [userId],
        (error, _results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

const userService = new UserService();
export default userService;
