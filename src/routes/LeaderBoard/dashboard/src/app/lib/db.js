import mongoose from "mongoose";

const connection = {};

export const connectToDb = async () => {
  try {
    if (connection.isConnected) {
      console.log("Already connected to the DataBase");
      return;
    }

    const db = await mongoose.connect(process.env.MONGO_URL, {
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to the DataBase");
  } catch (error) {
    console.error("Unable to connect to the DB", error.message);
    throw new Error("Unable to connect to the database");
  }
};