//Express import
import express from "express";

//Service import
import permissionService from "../service/permission-service";

/**
 * Express router containing task methods.
 */
const permissionRouter = express.Router();

//Gets all permissions
permissionRouter.get("/", async (_request, response) => {
  try {
    const data = await permissionService.getAllPermissions();

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Gets a specific permission by permid
permissionRouter.get("/:permid", async (request, response) => {
  const permId = Number(request.params.permid);

  try {
    const data = await permissionService.getPermission(permId);

    response.send(data);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Creates a new permission
permissionRouter.post("/", async (_request, response) => {
  try {
    const permId = await permissionService.createPermission();

    response.send({ id: permId });
  } catch (error) {
    response.status(500).send(error);
  }
});

//Deletes a permission with specific permid
permissionRouter.delete("/:permid", async (request, response) => {
  const permId = Number(request.params.permid);

  try {
    await permissionService.deletePermission(permId);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

//Updates a permission with specific permid
permissionRouter.patch("/:permid/edit", async (request, response) => {
  const permission = request.body.permission;

  try {
    await permissionService.updatePermissions(permission);

    response.sendStatus(200);
  } catch (error) {
    response.status(500).send(error);
  }
});

export default permissionRouter;
