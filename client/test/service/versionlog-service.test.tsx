// Import neccessary modules for testing
import axios from "axios";
import versionlogService, { Versionlog } from "../../src/service/versionlog-service";

//Made with guidance and help from copilot 
//Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Tests for VersionlogService
describe("VersionlogService", () => {
  const versionlog: Versionlog = {
    id: 1,
    pageid: 1,
    content: "Test content",
    userid: 1,
    date: "2023-10-10",
    changelog: "Initial version",
    version: 1,
  };

  //Get latest version of a page
  test("GET /pages/ + pageId + /latest", async () => {
    mockedAxios.get.mockResolvedValue({ data: versionlog });

    const result = await versionlogService.getLatestVersion(1);
    expect(result).toEqual(versionlog);
    expect(mockedAxios.get).toHaveBeenCalledWith("/pages/1/latest");
  });

  //Check version and return pageId
  test("GET /pages/ + pageId + /check", async () => {
    mockedAxios.get.mockResolvedValue({ data: { pageId: 1 } });

    const result = await versionlogService.checkVersion(1);
    expect(result).toEqual(1);
    expect(mockedAxios.get).toHaveBeenCalledWith("/pages/1/check");
  });

  //Get a specific version of a page
  test("GET /pages/ + pageId + /versionlog/ + versionNum", async () => {
    mockedAxios.get.mockResolvedValue({ data: versionlog });

    const result = await versionlogService.getVersion(1, 1);
    expect(result).toEqual(versionlog);
    expect(mockedAxios.get).toHaveBeenCalledWith("/pages/1/versionlog/1");
  });

  //Get all versions of a page
  test("GET /pages/ + pageId + /versionlog", async () => {
    mockedAxios.get.mockResolvedValue({ data: [versionlog] });

    const result = await versionlogService.getAllPageVersions(1);
    expect(result).toEqual([versionlog]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/pages/1/versionlog");
  });

  //Get all versions
  test("GET /pages/versions/getversions", async () => {
    mockedAxios.get.mockResolvedValue({ data: [versionlog] });

    const result = await versionlogService.getAllVersions();
    expect(result).toEqual([versionlog]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/pages/versions/getversions");
  });

  //Create a new version
  test("POST /pages/ + version.pageid + /newversion", async () => {
    mockedAxios.post.mockResolvedValue({ data: { versionid: 1 } });

    await versionlogService.createVersion(versionlog);
    expect(mockedAxios.post).toHaveBeenCalledWith("/pages/1/newversion", {
      version: versionlog,
    });
  });

  //Delete a specific version
  test("DELETE /pages/ + pageId + /versionlog/ + versionNum", async () => {
    mockedAxios.delete.mockResolvedValue({});

    await versionlogService.deleteVersion(1, 1);
    expect(mockedAxios.delete).toHaveBeenCalledWith("/pages/1/versionlog/1");
  });

  //Delete all versions of a page
  test("/pages/ + pageId + /edit", async () => {
    mockedAxios.delete.mockResolvedValue({ data: {} });

    const result = await versionlogService.deletePageVersions(1);
    expect(result).toEqual({});
    expect(mockedAxios.delete).toHaveBeenCalledWith("/pages/1/edit");
  });
});
