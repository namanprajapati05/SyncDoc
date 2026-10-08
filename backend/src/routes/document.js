  const express = require("express");
  const { authmiddleware } = require("../middleware/auth.middleware");
  const router = express.Router();
  const {
    createDocument,
    listDocuments,
    getDocument,
    deleteDocument,
    deleteBlock,
    addCollaborator,
    addBlock,
    updateDocument,
    updateBlock,
    updateCollaboratorRole,
    removeCollaborator,
  } = require("../controllers/document.controllers");
  const { asyncHandler } = require("../utils/asyncHandler");

  router.post("/createDocument", authmiddleware, asyncHandler(createDocument));
  router.get("/listDocuments", authmiddleware, asyncHandler(listDocuments));
  router.get(
    "/:documentId/getDocument",
    authmiddleware,
    asyncHandler(getDocument),
  );
  router.delete(
    "/:documentId/deleteDocument",
    authmiddleware,
    asyncHandler(deleteDocument),
  );
  router.delete(
    "/:documentId/blocks/:blockId",
    authmiddleware,
    asyncHandler(deleteBlock),
  );
  router.post(
    "/:documentId/collaborators",
    authmiddleware,
    asyncHandler(addCollaborator),
  );
  router.post("/:documentId/addBlock", authmiddleware, asyncHandler(addBlock));

  router.patch(
    "/:documentId/updateDocument",
    authmiddleware,
    asyncHandler(updateDocument),
  );
  router.patch(
    "/:documentId/blocks/:blockId",
    authmiddleware,
    asyncHandler(updateBlock),
  );
  router.patch(
    "/:documentId/collaborators/:userId",
    authmiddleware,
    asyncHandler(updateCollaboratorRole),
  );
  router.delete(
    "/:documentId/collaborators/:userId",
    authmiddleware,
    asyncHandler(removeCollaborator),
  );

  module.exports = router;
