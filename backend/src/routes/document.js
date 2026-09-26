const express = require("express");
const { authmiddleware } = require("../middleware/auth.middleware");
const router = express.Router();
const {
  createDocument,
  addCollaborator,
  addBlock,
} = require("../controllers/document.controllers");
const { asyncHandler } = require("../utils/asyncHandler");


router.post("/createDocument" , authmiddleware , asyncHandler(createDocument));
router.post("/:documentId/collaborators", authmiddleware, asyncHandler(addCollaborator));
router.post("/:documentId/addBlock" , authmiddleware , asyncHandler (addBlock));


module.exports = router;
