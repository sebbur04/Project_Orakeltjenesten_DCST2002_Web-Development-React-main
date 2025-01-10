// Import mysql and mysql2
import { pool } from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

//Type for versionlog
export type Versionlog = {
  id: number;
  pageid: number;
  content: string;
  userid: number;
  date: string;
  changelog: string;
  version: number;
};

//Service for versionlog
class VersionlogService {
  /**
   * Get date of latest version of page with specific id
   */

  getDate(pageId: number) {
    return new Promise<Versionlog | undefined>((resolve, reject) => {
      pool.query(
        "SELECT date FROM Versionlog WHERE pageid = ? ORDER BY version DESC LIMIT 1",
        [pageId],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          if (results.length == 0) {
            return reject(new Error("Date not found"));
          }

          resolve(results[0].date);
        }
      );
    });
  }

  /**
   * Get latest version of page with specific id
   */

  getLatestVersion(pageid: number) {
    return new Promise<Versionlog | undefined>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Versionlog WHERE pageid = ? ORDER BY version DESC",
        [pageid],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as Versionlog);
        }
      );
    });
  }

  /**
   * Check version and delete the oldest version if there are more than 10 versions, by using pageid
   */
  checkVersion(pageid: number) {
    return new Promise<void>(async (resolve, reject) => {
      /* Here is a lot of sql-coding. LIMIT is not allowed in subquery,
      can therefore not just find the newest versions of a page. Another solution is to set a new row number based on the order of the version.
      Here was this page, https://www.geeksforgeeks.org/sql-server-row_number-function-with-partition-by, very helpful.
      You basically do an order of version, and then set row_number on each of them in order. So the highest version gets row_number 1 etc. 
      Then check if row_number is greater than 10 or not.
      */

      pool.query(
        "DELETE FROM Versionlog WHERE id NOT IN (SELECT id FROM (SELECT id FROM ( SELECT *, ROW_NUMBER() OVER (ORDER BY version DESC) AS row_Num FROM Versionlog WHERE pageid = ?) AS ordered_Table WHERE row_Num <= 10) as extra_table) AND pageid=?",
        [pageid, pageid],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  /**
   * Deletes a specific version of a page
   */
  deleteVersion(pageId: number, version: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Versionlog WHERE pageid = ? AND version = ?",
        [pageId, version],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0)
            return reject(new Error("No row deleted"));

          resolve();
        }
      );
    });
  }

  /**
   * Deletes all versions of a page
   */
  deletePageVersions(pageId: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Versionlog WHERE pageid = ?",
        [pageId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          if (results.affectedRows == 0) {
            return reject("No versions deleted");
          }
          resolve();
        }
      );
    });
  }

  /**
   * Get one specific version from specific page.
   */
  getVersion(pageId: number, versionNum: number) {
    return new Promise<Versionlog>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Versionlog WHERE pageid=? AND version=?",
        [pageId, versionNum],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as Versionlog);
        }
      );
    });
  }

  /**
   * Get all versions of page
   */
  getAllPageVersions(pageid: number) {
    return new Promise<Versionlog[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Versionlog WHERE pageid=?",
        [pageid],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Versionlog[]);
        }
      );
    });
  }

  /**
   * Get all versions of page
   */
  getAllVersions() {
    return new Promise<Versionlog[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Versionlog",
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Versionlog[]);
        }
      );
    });
  }

  /**
   * Makes new version of a page
   */
  createVersion(versionlog: Versionlog) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "INSERT INTO Versionlog SET pageid = ?, content = ?, userid = ?, date = ?, changelog = ?, version = ?;",
        [
          versionlog.pageid,
          versionlog.content,
          versionlog.userid,
          versionlog.date,
          versionlog.changelog,
          versionlog.version,
        ],
        (error, _results) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }
}

const versionlogService = new VersionlogService();
export default versionlogService;
