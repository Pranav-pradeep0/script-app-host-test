# Movie Script Writing App Database Schema

This document outlines the database schema for the Movie Script Writing App, which is built on the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Users Collection

- `user_id` (Auto-generated unique identifier)
- `email` (Unique)
- `first_name`
- `last_name`
- `password` (Hashed)

## Scripts Collection

- `script_id` (Auto-generated unique identifier)
- `user_id` (References the Users collection)
- `title`
- `content` (Text of the script)
- `page_size` (e.g., A4)
- `last_edited` (Timestamp)

## ScriptShares Collection

- `share_id` (Auto-generated unique identifier)
- `script_id` (References the Scripts collection)
- `shared_with_user_id` (References the Users collection)
- `can_edit` (Boolean, indicating if the user can edit the shared script)

## Subscriptions Collection

- `subscription_id` (Auto-generated unique identifier)
- `user_id` (References the Users collection)
- `subscription_type` (e.g., Free, Monthly, Yearly)
- `start_date`
- `end_date`
- `status` (e.g., Active, Expired)

## Notes

- In MongoDB, each collection stores a set of documents, and each document represents an entity or record.
- The `Users` collection stores user information, including their email, name, and hashed password.
- The `Scripts` collection stores individual scripts created by users, including the script content, title, page size, and the timestamp of the last edit.
- The `ScriptShares` collection manages script sharing, linking scripts to users, and specifying whether they can edit the shared script.
- The `Subscriptions` collection tracks user subscriptions, including the subscription type (Free, Monthly, Yearly), start and end dates, and the subscription status.

This schema is designed to work with MongoDB, a NoSQL database, and provides the foundational data structure for the Movie Script Writing App.
