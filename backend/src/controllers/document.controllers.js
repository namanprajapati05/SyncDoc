const mongoose = require("mongoose");
const Document = require("../models/document");
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


const addCollaborator = async (req, res) => {

  const { documentId } = req.params;
  const { userId, role } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "valid userId is required");
  }

  if (!["editor", "viewer"].includes(role)) {
    throw new ApiError(400, "role must be 'editor' or 'viewer'");
  }


  const existingDoc = await Document.findById(documentId);

  if (!existingDoc) {
    throw new ApiError(404, "document not found");
  }

  if (existingDoc.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only the owner can add collaborators");
  }

  if (existingDoc.ownerId.toString() === userId) {
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
    { new: true }
  );

  if (!doc) {
    throw new ApiError(409, "user is already a collaborator");
  }

  return res.status(201).json(
    new ApiResponse(
        201,
        { collaborators: doc.collaborators }, 
        "collaborator added successfully"
    )
  );
};

module.exports={
    createDocument,
    addCollaborator
}


