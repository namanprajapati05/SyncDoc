const mongoose = require("mongoose");

const collaboratorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["editor", "viewer"],
      required: true,
    },
  },
  { _id: false }
);

const blockSchema = new mongoose.Schema(
  {
    blockId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["paragraph", "heading", "image", "list", "code"],
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: false }
);

const astSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "document",
    },

    blocks: {
      type: [blockSchema],
      default: [],
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },

    ast: {
      type: astSchema,
      default: () => ({
        type: "document",
        blocks: [],
      }),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);
