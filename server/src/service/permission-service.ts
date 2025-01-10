// Import mysql pool from mysql-pool and RowDataPacket and ResultSetHeader from mysql2.
import { pool } from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

//Type for permission
export type Permission = {
  id: number;
  alterpages: boolean;
  deletepages: boolean;
  versions: boolean;
  allcomments: boolean;
  tags: boolean;
  users: boolean;
};

//Service for permission
class PermissionService {
  /**
   * Get permission with given id.
   */
  getPermission(id: number) {
    return new Promise<Permission | undefined>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Permissions WHERE id = ?",
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as Permission);
        }
      );
    });
  }

  /**
   * Get all permissions.
   */
  getAllPermissions() {
    return new Promise<Permission[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Permissions",
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Permission[]);
        }
      );
    });
  }

  /**
   * Create new permission.
   *
   * Resolves the newly created permission
   */
  createPermission() {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        "INSERT INTO Permissions(alterpages, deletepages, versions, allcomments, tags, users) VALUES(true, false, false, false, false, false);",
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }

  /**
   * Update permission with given id.
   */
  updatePermissions(p: Permission) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "UPDATE Permissions SET alterpages=?, deletepages=?, versions=?, allcomments=?, tags=?, users=? WHERE id=?",
        [
          p.alterpages,
          p.deletepages,
          p.versions,
          p.allcomments,
          p.tags,
          p.users,
          p.id,
        ],
        (error, _results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  /**
   * Delete permission with given id.
   */
  deletePermission(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Permissions WHERE id=?",
        [id],
        (error, _results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

const permissionService = new PermissionService();
export default permissionService;
