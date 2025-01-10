// Import neccessary modules for testing
import axios from "axios";
import tagService, { Tag } from "../../src/service/tag-service";

//Made with guidance and help from copilot 
//Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("TagService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Get tag with given id.
  test("GET /tags/ + id", async () => {
    const tag: Tag = { id: 1, name: "Test Tag" };
    mockedAxios.get.mockResolvedValue({ data: tag });

    const result = await tagService.getTag(1);

    expect(mockedAxios.get).toHaveBeenCalledWith("/tags/1");
    expect(result).toEqual(tag);
  });

  //Get all tags
  test("GET /tags", async () => {
    const tags: Tag[] = [
      { id: 1, name: "Tag1" },
      { id: 2, name: "Tag2" },
    ];
    mockedAxios.get.mockResolvedValue({ data: tags });

    const result = await tagService.getAllTags();

    expect(mockedAxios.get).toHaveBeenCalledWith("/tags");
    expect(result).toEqual(tags);
  });

  //Create new tag having the given name
  test("POST /tags", async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });

    const id = await tagService.createTag("New Tag");

    expect(mockedAxios.post).toHaveBeenCalledWith("/tags", { name: "New Tag" });
    expect(id).toEqual(1);
  });

  //Delete tag with given id
  test("DELETE /tags/ + id", async () => {
    mockedAxios.delete.mockResolvedValue({});

    await tagService.deleteTag(1);

    expect(mockedAxios.delete).toHaveBeenCalledWith("/tags/1");
  });

  //Update tag name
  test("PATCH /tags/ + tag.id + /edit", async () => {
    const tag: Tag = { id: 1, name: "Updated Tag" };
    mockedAxios.patch.mockResolvedValue({});

    await tagService.updateTag(tag);

    expect(mockedAxios.patch).toHaveBeenCalledWith("/tags/1/edit", { tag });
  });

  //Delete all pages belonging to a tagid
  test("DELETE /tags/ + tagId + /pages", async () => {
    mockedAxios.delete.mockResolvedValue({});

    await tagService.deleteAllPagesFromTag(1);

    expect(mockedAxios.delete).toHaveBeenCalledWith("/tags/1/pages");
  });
});
