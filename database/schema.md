# SyncDoc Database Schema

## Database: syncdoc

### Users Collection

- _id: ObjectId
- name: String
- email: String (unique)
- password: String
- createdAt: Date
- updatedAt: Date

### Documents Collection

- _id: ObjectId
- title: String
- ownerId: ObjectId → users._id
- collaborators:
  - userId: ObjectId → users._id
  - role: String
- content: String
- createdAt: Date
- updatedAt: Date

### Versions Collection

- _id: ObjectId
- documentId: ObjectId → documents._id
- content: String
- createdBy: ObjectId → users._id
- createdAt: Date

## Relationships

- One user can own many documents.
- One document has one owner.
- One document can have multiple collaborators.
- One document can have multiple versions.
- Each version belongs to one document.
