import express, { json } from "express";
import mongoose from "mongoose";

const app = express();
app.use(json());

mongoose
  .connect("mongodb://mongo:27017/rule-engine-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
