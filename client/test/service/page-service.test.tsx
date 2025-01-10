// Import neccessary modules for testing
import pageService, { Page } from "../../src/service/page-service";
import axios from "axios";

//Made with guidance and help from copilot 
//Mock axios
jest.mock("axios");

//Clear all mocks
describe("PageService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Get page with given id.
  test("GET /pages/ + page.id", async () => {
    const mockPage: Page = { id: 1, name: "Test Page", num_views: 0 };

    (axios.get as jest.Mock).mockResolvedValue({ data: mockPage });

    const result = await pageService.getPage(1);

    expect(axios.get).toHaveBeenCalledWith("/pages/1");
    expect(result).toEqual(mockPage);
  });

  //Get all pages
  test("GET /pages", async () => {
    const mockPages: Page[] = [
      { id: 1, name: "Page 1", num_views: 10 },
      { id: 2, name: "Page 2", num_views: 20 },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockPages });

    const result = await pageService.getAllPages();

    expect(axios.get).toHaveBeenCalledWith("/pages");
    expect(result).toEqual(mockPages);
  });

  //Create new page having the given name
  test(" POST /pages/", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { id: 3 } });

    const result = await pageService.createPage();

    expect(axios.post).toHaveBeenCalledWith("/pages");
    expect(result).toBe(3);
  });

  //Delete page with given id
  test("DELETE pages/ + page.id", async () => {
    (axios.delete as jest.Mock).mockResolvedValue({});

    await pageService.deletePage(1);

    expect(axios.delete).toHaveBeenCalledWith("/pages/1");
  });

  //Update page name
  test("POST /pages/ + page.id /editname ", async () => {
    const page: Page = { id: 1, name: "Updated Name", num_views: 0 };
    (axios.patch as jest.Mock).mockResolvedValue({});

    await pageService.updatePageName(page);

    expect(axios.patch).toHaveBeenCalledWith("/pages/1/editname", {
      name: "Updated Name",
    });
  });

  //Search for pages
  test("GET /pages/", async () => {
    const mockPages: Page[] = [
      { id: 1, name: "HomePage", num_views: 15 },
      { id: 2, name: "About", num_views: 5 },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockPages });

    const result = await pageService.searchPages("home");

    expect(axios.get).toHaveBeenCalledWith("/pages");
    expect(result).toEqual([{ id: 1, name: "HomePage", num_views: 15 }]);
  });
});
