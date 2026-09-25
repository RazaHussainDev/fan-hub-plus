const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://fanhub:lfYIOP6eWKWEQWiD@cluster0.yxxc7b4.mongodb.net/fanhubplus?appName=Cluster0').then(async () => {
  const user = await mongoose.connection.db.collection('users').findOne({ email: 'acchacked.pk@gmail.com' });
  console.log("Found User ID:", user._id.toString());
  
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    'fanhub_jwt_ultra_secure_secret_2024',
    { expiresIn: '7d' }
  );
  
  console.log("Generated Token:", token);
  
   // If installed, otherwise native fetch in node 18+
  const res = await fetch('http://localhost:5000/api/auth/watchlist', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await res.json();
  console.log("GET Watchlist Response:");
  console.dir(data, { depth: null });
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
