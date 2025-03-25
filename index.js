const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://admin:Admin123@localhost:30000/?replicaSet=rs0&authSource=admin",
    {
      autoIndex: true,
      replicaSet: "rs0",
      directConnection: true,
      readPreference: "primary",
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Replica Set with Primary (mongo1:30000)");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
