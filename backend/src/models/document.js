const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    collaborators: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        role: {
          type: String,
          enum: ["editor", "viewer"],
          required: true
        }
      }
    ],

    ast: {
      type: {
        type: String,
        required: true
      },

      blocks: [
        {
          blockId: {
            type: String,
            required: true
          },

          type: {
            type: String,
            required: true
          },

          content: {
            type: String
          },

          createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },

          updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Document", documentSchema);
