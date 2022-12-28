import { MongoClient, MongoClientOptions } from "mongodb";

let _db: MongoClientOptions;

const mongoConnect = (callback: Function) => {
  MongoClient.connect(`mongodb+srv://web-app:online123@cluster0.5fapyff.mongodb.net/shop?retryWrites=true&w=majority`)
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

export { mongoConnect, getDb };
