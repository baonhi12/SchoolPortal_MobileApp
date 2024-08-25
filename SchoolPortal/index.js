const express = require('express')
const PORT = 8000; // Port number

const app = express()

app.use(express.json());
const bodyParser = require('body-parser');

require('./DBContext');
require('./models/User');

const authRoutes = require('./router/authRoutes');
const requireToken = require('./middlewares/authTokenRequire');


app.use(bodyParser.json());

app.use(authRoutes);

app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})