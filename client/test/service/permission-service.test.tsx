// Import neccessary modules for testing
import axios from "axios";
import permissionService, { Permission } from "../../src/service/permission-service";

//Made with guidance and help from copilot 
//Mock axios
jest.mock("axios");

describe("PermissionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Get permission with given id.
  describe("getPermission", () => {
    test("GET /permissions/ + id", async () => {
      const permission: Permission = {
        id: 1,
        alterpages: true,
        deletepages: false,
        versions: true,
        allcomments: false,
        tags: true,
        users: false,
      };
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce({ data: permission });

      const result = await permissionService.getPermission(1);

      expect(axios.get).toHaveBeenCalledWith("/permissions/1");
      expect(result).toEqual(permission);
    });
  });

  //Get all permissions
  describe("getAllPermissions", () => {
    test("GET /permissions", async () => {
      const permissions: Permission[] = [
        {
          id: 1,
          alterpages: true,
          deletepages: false,
          versions: true,
          allcomments: false,
          tags: true,
          users: false,
        },
        // More possible permissions
      ];
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce({ data: permissions });

      const result = await permissionService.getAllPermissions();

      expect(axios.get).toHaveBeenCalledWith("/permissions");
      expect(result).toEqual(permissions);
    });
  });

  //Create new permission having given id
  describe("createPermission", () => {
    test("POST /permissions", async () => {
      (
        axios.post as jest.MockedFunction<typeof axios.post>
      ).mockResolvedValueOnce({ data: { id: 1 } });

      const id = await permissionService.createPermission();

      expect(axios.post).toHaveBeenCalledWith("/permissions");
      expect(id).toBe(1);
    });
  });

  //Delete permission with given id
  describe("deletePermission", () => {
    test("DELETE /permissions/ + id", async () => {
      (
        axios.delete as jest.MockedFunction<typeof axios.delete>
      ).mockResolvedValueOnce({});

      await permissionService.deletePermission(1);

      expect(axios.delete).toHaveBeenCalledWith("/permissions/1");
    });
  });

  //Update permission with given id
  describe("updatePermissions", () => {
    test("PATCH /permissions/ + permission.id + /edit", async () => {
      const permission: Permission = {
        id: 1,
        alterpages: false,
        deletepages: true,
        versions: true,
        allcomments: true,
        tags: false,
        users: true,
      };
      (
        axios.patch as jest.MockedFunction<typeof axios.patch>
      ).mockResolvedValueOnce({});

      await permissionService.updatePermissions(permission);

      expect(axios.patch).toHaveBeenCalledWith("/permissions/1/edit", {
        permission,
      });
    });
  });
});
