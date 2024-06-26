const mongoose = require("mongoose");
const userName = encodeURIComponent('nikhil');
const password = encodeURIComponent('S3cur3#7');
const uri = `mongodb+srv://${userName}:${password}@sharely.afghe6j.mongodb.net/?retryWrites=true&w=majority&appName=Sharely`;

mongoose.set("strictQuery", true);

mongoose.connect(uri, {}).then((result) => {
    console.log(`Connected to db`);
  }).catch((err) => {
    console.log(`Error occured while connecting to db, ${err}`);
  });

  