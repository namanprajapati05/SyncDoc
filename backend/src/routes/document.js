const express = require("express");
const { authmiddleware } = require("../middleware/auth.middleware");
const router = express.Router();
const {
  createDocument,
  addCollaborator,
} = require("../controllers/document.controllers");
const { asyncHandler } = require("../utils/asyncHandler");


router.post("/createDocument" , authmiddleware , asyncHandler(createDocument));
router.post("/:documentId/collaborators", authmiddleware, addCollaborator);


module.exports = router;
