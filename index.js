require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const catPackage = require('./routes/catPackage');
const profileRouter = require('./routes/profile');
const packageDataRouter = require('./routes/packageData');
const fullBoardRouter = require('./routes/fullBoard');
const sortBoardRouter = require('./routes/sortBoard');
const connectDB = require('./config/db');
const app = express();

connectDB();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Backend Viettel');
});
app.use('/api/', authRouter);
app.use('/api/catPackage', catPackage);
app.use('/api/profile', profileRouter);
app.use('/api/packageData', packageDataRouter);
app.use('/api/fullBoard', fullBoardRouter);
app.use('/api/sort', sortBoardRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
