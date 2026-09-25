const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://127.0.0.1:27017/fanhub').then(async () => {
  const users = await User.find({});
  console.log("Users:", users.map(u => ({ email: u.email, watchlist: u.watchlist })));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
