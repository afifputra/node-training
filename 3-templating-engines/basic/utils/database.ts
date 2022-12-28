import { MongoClient } from "mongodb";

const mongoConnect = (callback: Function) => {
  MongoClient.connect("mongodb+srv://web-app:online123@cluster0.5fapyff.mongodb.net/?retryWrites=true&w=majority")
    .then((result) => {
      console.log("Connected!");
      callback(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default mongoConnect;
