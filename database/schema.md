# SyncDoc Database Schema

## Database: syncdoc

### Users Collection

- _id: ObjectId
- name: String
- email: String (unique)
- password: String (hashed)
- createdAt: Date
- updatedAt: Date

### Documents Collection

- _id: ObjectId
- title: String
- ownerId: ObjectId → users._id
- collaborators:
  - userId: ObjectId → users._id
  - role: String ("editor" | "viewer")
- ast:
  - type: String
  - blocks:
    - blockId: String
    - type: String
    - content: String
    - createdBy: ObjectId → users._id
    - updatedBy: ObjectId → users._id
- createdAt: Date
- updatedAt: Date

### Versions Collection

- _id: ObjectId
- documentId: ObjectId → documents._id
- version: Number
- userId: ObjectId → users._id
- changes: Array
- createdAt: Date

## Relationships

- One user can own many documents.
- One document has one owner.
- One document can have multiple collaborators.
- A collaborator can be an editor or viewer.
- Each document contains an AST.
- An AST contains multiple blocks.
- Each block has a unique blockId.
- Each block can record who created and updated it.
- One document can have multiple versions.
- Each version belongs to one document.
- Each version records the user who made the changes.
