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
