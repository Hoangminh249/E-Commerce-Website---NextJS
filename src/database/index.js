import mongoose from "mongoose";

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDB = async () => {
  const connectionUrl =
    "mongodb+srv://mh742578:12345678023@cluster0.uw343jh.mongodb.net/";
  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Connect DB successfully"))
    .catch((err) => console.log("err", err.message));
};
export default connectToDB;
