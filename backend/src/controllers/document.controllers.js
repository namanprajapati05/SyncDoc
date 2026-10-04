const mongoose = require("mongoose");
const Document = require("../models/document");
const {User} = require("../models/user")
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const createDocument = async (req, res) => {
  const { title } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "title is required");
  }

  const doc = await Document.create({
    title: title.trim(),
    ownerId: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { _id: doc._id, title: doc.title },
        "Document registered successfully",
      ),
    );
};

const listDocuments = async (req, res) => {
  const docs = await Document.find({
    $or: [{ ownerId: req.user._id }, { "collaborators.userId": req.user._id }],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { documents: docs },
        "documents fetched successfully",
      ),
    );
};

const getDocument = async (req, res) => {
  const { documentId } = req.params;

  const doc = await Document.findById(documentId);
  if (!doc) {
    throw new ApiError(404, "document not found");
  }

  const isOwner = doc.ownerId.toString() === req.user._id.toString();
  const isCollaborator = doc.collaborators.some((collaborator) => {
    return collaborator.userId.toString() === req.user._id.toString();
  });

  if (!isOwner && !isCollaborator) {
    throw new ApiError(403, "access denied");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { document: doc }, "document fetched successfully"),
    );
};

const deleteDocument = async (req, res) => {
  const { documentId } = req.params;

  const doc = await Document.findById(documentId);

  if (!doc) {
    throw new ApiError(404, "document not found");
  }

  const isOwner = doc.ownerId.toString() === req.user._id.toString();
  if (!isOwner) {
    throw new ApiError(403, "only the owner can delete this document");
  }

  await doc.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "document deleted successfully"));
};

const deleteBlock = async (req, res) => {
  const { documentId, blockId } = req.params;
  const doc = await Document.findById(documentId);

  if (!doc) {
    throw new ApiError(404, "document not found");
  }

  const isOwner = doc.ownerId.toString() === req.user._id.toString();

  const isEditor = doc.collaborators.some((collaborator) => {
    return (
      collaborator.userId.toString() === req.user._id.toString() &&
      collaborator.role === "editor"
    );
  });
  if (!isOwner && !isEditor) {
    throw new ApiError(403, "only the owner or an editor can delete blocks");
  }

  const blockExists = doc.ast.blocks.some((block) => {
    return block.blockId === blockId;
  });

  if (!blockExists) {
    throw new ApiError(404, "block not found");
  }

  doc.ast.blocks = doc.ast.blocks.filter((block) => {
    return block.blockId !== blockId;
  });

  await doc.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { ast: doc.ast }, "block deleted successfully"));
};



const addCollaborator = async (req, res) => {

  const { documentId } = req.params;
  const { email, role } = req.body;

  if (!email || !email.trim()) {
    throw new ApiError(400, "email is required");
  }
  
  

  if (!["editor", "viewer"].includes(role)) {
    throw new ApiError(400, "role must be 'editor' or 'viewer'");
  }
 
  const collaboratorUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!collaboratorUser) {
    throw new ApiError(404, "no user found with this email");
  }

  const userId = collaboratorUser._id;

  const existingDoc = await Document.findById(documentId);

  if (!existingDoc) {
    throw new ApiError(404, "document not found");
  }

  if (existingDoc.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only the owner can add collaborators");
  }

  if (existingDoc.ownerId.toString() === userId.toString()) {
    throw new ApiError(400, "owner cannot be added as a collaborator");
  }

  const doc = await Document.findOneAndUpdate(
    {
      _id: documentId,
      ownerId: req.user._id,
      "collaborators.userId": { $ne: userId },
    },
    {
      $push: { collaborators: { userId, role } },
    },
    { new: true },
  );

  if (!doc) {
    throw new ApiError(409, "user is already a collaborator");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { collaborators: doc.collaborators },
        "collaborator added successfully",
      ),
    );
};

const ALLOWED_BLOCK_TYPES = ["paragraph", "heading", "image", "list", "code"];

const addBlock = async (req, res) => {
  const { documentId } = req.params;
  const { blockId, type, content } = req.body;

  if (!blockId) {
    throw new ApiError(400, "blockId is required");
  }

  if (!ALLOWED_BLOCK_TYPES.includes(type)) {
    throw new ApiError(400, "invalid block type");
  }

  const doc = await Document.findById(documentId);

  if (!doc) {
    throw new ApiError(404, "document not found");
  }

  const isOwner = doc.ownerId.toString() === req.user._id.toString();

  const isEditor = doc.collaborators.some((collaborator) => {
    return (
      collaborator.userId.toString() === req.user._id.toString() &&
      collaborator.role === "editor"
    );
  });

  if (!isOwner && !isEditor) {
    throw new ApiError(403, "only the owner or an editor can add blocks");
  }

  const blockAlreadyExists = doc.ast.blocks.some((block) => {
    return block.blockId === blockId;
  });

  if (blockAlreadyExists) {
    throw new ApiError(409, "a block with this blockId already exists");
  }

  const newBlock = {
    blockId: blockId,
    type: type,
    content: content || "",
    createdBy: req.user._id,
    updatedBy: req.user._id,
  };

  doc.ast.blocks.push(newBlock);

  await doc.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { ast: doc.ast }, "block added successfully"));
};

module.exports = {
  createDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  deleteBlock ,
  addCollaborator,
  addBlock,
};
