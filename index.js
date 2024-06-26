const express = require('express');
const db = require('./db/mongodb');
const userRoutes = require('./routers/user');
const shareRoutes = require('./routers/share');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(shareRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
});

