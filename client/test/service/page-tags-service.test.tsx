// Import neccessary modules for testing
import axios from "axios";
import pageTagService from "../../src/service/page-tags-service";

//Made with guidance and help from copilot 
//Mock axios
jest.mock("axios");

//Clear all mocks
describe("PageTagService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Get page tag with given id.
  test("GET /pages + pageid", async () => {
    const pageid = 1;
    const mockData = { pageid: 1, tagid: 2 };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await pageTagService.getPageTag(pageid);

    expect(axios.get).toHaveBeenCalledWith("/pages" + pageid);
    expect(result).toEqual(mockData.pageid);
  });

  //Get all page tags
  test("GET /pages", async () => {
    const mockData = [
      { pageid: 1, tagid: 2 },
      { pageid: 3, tagid: 4 },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await pageTagService.getAllPageTags();

    expect(axios.get).toHaveBeenCalledWith("/pages");
    expect(result).toEqual(mockData);
  });

  //Delete a tag from a page
  test("DELETE /pages/ + pageId + /edit/ + tagId", async () => {
    const pageId = 1;
    const tagId = 2;
    (axios.delete as jest.Mock).mockResolvedValue({});

    await pageTagService.deleteTagFromPage(pageId, tagId);

    expect(axios.delete).toHaveBeenCalledWith(
      "/pages/" + pageId + "/edit/" + tagId
    );
  });

  //Add a tag to a page
  test("POST /pages/ + pageId + /edit/ + tagId", async () => {
    const pageId = 1;
    const tagId = 2;
    (axios.post as jest.Mock).mockResolvedValue({});

    await pageTagService.addTagToPage(pageId, tagId);

    expect(axios.post).toHaveBeenCalledWith(
      "/pages/" + pageId + "/edit/" + tagId
    );
  });
});
