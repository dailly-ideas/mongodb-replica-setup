# MongoDB Replica Set Setup Guide

This guide provides instructions to set up a MongoDB Replica Set using Docker Compose. The setup includes three MongoDB nodes (one primary and two secondaries) with authentication and a keyfile for secure replication. Environment variables are managed via a .env file.

## Prerequisites

- Docker and Docker Compose installed on your system.
- Node.js and npm installed (for testing the connection with Mongoose).
- OpenSSL installed (for generating the keyfile).

## Directory Structure

```
mongo-replica/

├── .data/                  # Volume data for MongoDB nodes

│   ├── mongo1/            # Data for mongo1 (primary)

│   ├── mongo2/            # Data for mongo2 (secondary)

│   └── mongo3/            # Data for mongo3 (secondary)

├── mongodb/               # MongoDB configuration

│   └── Dockerfile         # Dockerfile for MongoDB nodes

├── node_modules/          # Node.js dependencies

├── .env                   # Environment variables

├── docker-compose.yml     # Docker Compose configuration

├── mongodb.keyfile        # Keyfile for replication security

└── index.js               # Test script for MongoDB connection
```

## Setup Instructions

Follow these steps to set up and test the MongoDB Replica Set:

### 1. Create the Keyfile

Generate a secure keyfile for MongoDB replication authentication:

```shell
openssl rand -base64756> mongodb.keyfile
chmod400 mongodb.keyfile
```

This creates a `mongodb.keyfile` with restricted permissions (read-only for the owner).

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```
MONGO_USER=admin
MONGO_PASSWORD=Admin123
MONGO_MULTIPLE_DATABASES=true
```

These variables will be used by the MongoDB containers for authentication.

### 3. Start the Docker Containers

Run the following command to build and start the MongoDB Replica Set in detached mode:

```shell
docker compose up --build-d
```

This command:

- Builds the custom MongoDB image from `mongodb/Dockerfile`.
- Starts three MongoDB nodes (`mongo1`, `mongo2`, `mongo3`) and an initialization container (`mongo-init`).
- Maps ports `30000`, `30001`, and `30002` to the host for external access.
- Initializes the Replica Set with `mongo1` as the primary node.

### 4. Test the Connection to MongoDB

#### Using Mongo Shell

Access the primary node (`mongo1`) and verify the Replica Set status:

```shell
docker exec -it mongo-replica-mongo1-1 mongosh -u admin -p Admin123 --port27017
```

Inside the Mongo shell, run:

```
rs.status();
```

This will display the status of the Replica Set, including the primary and secondary nodes.

#### Using Mongoose (Node.js)

##### 1. Install Mongoose:

```bash
npm install mongoose
```

##### 2. Create an `index.js` file with the following content:

```javascript
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://admin:Admin123@192.168.100.1:30000,192.168.100.1:30001,192.168.100.1:30002/?replicaSet=rs0&authSource=admin",
    {
      autoIndex: true,
      replicaSet: "rs0",
      readPreference: "primary",
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Replica Set with Primary (mongo1:30000)");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
```

##### 3. Run the script:

```shell
node index.js
```

If successful, you’ll see the message: `Connected to MongoDB Replica Set with Primary (mongo1:30000)`.

Note: Replace `192.168.100.1` with your actual host IP or `localhost` if running locally.

## Cleanup

To stop and remove the containers and volumes:

```shell
docker compose down -v
```

## Troubleshooting

To stop and remove the containers and volumes:

- Ensure ports 30000, 30001, and 30002 are not in use.
- Check Docker logs if the Replica Set fails to initialize:

```shell
docker logs mongo-replica-mongo1-1
```

- Verify the keyfile permissions (`chmod 400 mongodb.keyfile`) if authentication errors occur.

## Additional Notes

- The primary node (mongo1) has a higher priority (10) to ensure it remains the primary unless unavailable.
- The Replica Set is named rs0 and uses authentication with the keyfile for security.
- Data is persisted in the .data/ directory for each node.
