const express = require("express");
const { authmiddleware } = require("../middleware/auth.middleware");
const router = express.Router();
const {
  createDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  deleteBlock ,
  addCollaborator,
  addBlock,
} = require("../controllers/document.controllers");
const { asyncHandler } = require("../utils/asyncHandler");


router.post("/createDocument" , authmiddleware , asyncHandler(createDocument));
router.get("/listDocuments" , authmiddleware , asyncHandler (listDocuments) );
router.get("/:documentId/getDocument" ,  authmiddleware , asyncHandler (getDocument) ); 
router.delete("/:documentId/deleteDocument" , authmiddleware , asyncHandler(deleteDocument) ) ;
router.delete("/:documentId/blocks/:blockId" , authmiddleware , asyncHandler(deleteBlock) ) ;
router.post("/:documentId/collaborators", authmiddleware, asyncHandler(addCollaborator));
router.post("/:documentId/addBlock" , authmiddleware , asyncHandler (addBlock));


module.exports = router;
