// Import pool from mysql-pool and RowDataPacket and ResultSetHeader from mysql2.
import { pool } from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

//Type for page
export type Page = {
  id: number;
  name: string;
  num_views: number;
};

//Service for page
class PageService {
  /**
   * Get page with given id.
   */
  getPage(id: number) {
    return new Promise<Page | undefined>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Pages WHERE id = ?",
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results[0] as Page);
        }
      );
    });
  }

  /**
   * Retrieve pages from tags
   */
  getPageFromTag(id: number) {
    return new Promise<Page[]>((resolve, reject) => {
      pool.query(
        "SELECT p.id, p.name FROM Pages p JOIN PageTags pt ON pt.pageid = p.id WHERE pt.tagid = ?",
        [id],
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Page[]);
        }
      );
    });
  }

  /**
   * Get all pages.
   */
  getAllPages() {
    return new Promise<Page[]>((resolve, reject) => {
      pool.query("SELECT * FROM Pages", (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as Page[]);
      });
    });
  }

  /**
   * Create new page.
   *
   * Resolves the newly created page id.
   */
  createPage() {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO Pages SET name = "", num_views = 0',
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }

  /**
   * Delete page with given id.
   */
  deletePage(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "DELETE FROM Pages WHERE id = ?",
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject("No row deleted");

          resolve();
        }
      );
    });
  }

  /**
   * Update page with given id.
   */
  updatePageViews(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        "UPDATE Pages SET num_views = num_views + 1 WHERE id = ?",
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0)
            return reject(new Error("No rows affected"));

          resolve();
        }
      );
    });
  }

  /**
   * Update page with given id
   */
  updatePageName(pageId: number, name: string) {
    return new Promise<Page>((resolve, reject) => {
      //In case there is a whitespace at the start of name
      pool.query(
        "UPDATE Pages SET name=? WHERE id=?",
        [name.replace(/^[ ]+/g, ""), pageId],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          if (results.affectedRows == 0) {
            return reject("No rows affected");
          }

          pool.query(
            "SELECT * FROM Pages WHERE id=?",
            [pageId],
            (error, results: RowDataPacket[]) => {
              if (error) return reject(error);

              resolve(results[0] as Page);
            }
          );
        }
      );
    });
  }

  /**
   * Checks if there are empty pages and deletes them
   */
  checkForEmptyPage() {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM Pages WHERE name=""',
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve();
        }
      );
    });
  }

  /**
   * Get all pages but they are sorted by number of views
   */
  getOrderedPages() {
    return new Promise<Page[]>((resolve, reject) => {
      pool.query(
        "SELECT * FROM Pages ORDER BY num_views DESC LIMIT 3",
        (error, results: RowDataPacket[]) => {
          if (error) return reject(error);

          resolve(results as Page[]);
        }
      );
    });
  }
}

const pageService = new PageService();
export default pageService;
