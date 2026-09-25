const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://fanhub:lfYIOP6eWKWEQWiD@cluster0.yxxc7b4.mongodb.net/fanhubplus?appName=Cluster0').then(async () => {
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log("Users raw from db:");
  console.dir(users, { depth: null });
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
