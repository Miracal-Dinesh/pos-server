const express = require('express');
const bodyparser = require('body-parser');
//const myReqLogger = require('./Utilities/requestLogger');
const route = require('./routes/routing');
const cors = require('cors');

const coroption={
  origin:'*',
  credentials:'true',
  optionSuccessStatus:200,
}

const PORT = 4000;
const HOST = '192.168.29.19'; // <-- Replace with your IP

const app = express();
app.use(bodyparser.json());
//app.use(myReqLogger);
app.use(cors(coroption));
app.use('/api', route);
app.use(bodyparser.json({ limit: 8000000000 }));
app.use(bodyparser.urlencoded({ limit: 8000000000,  extended: true, parameterLimit: 8000000000 }));
app.post("/someRoute", function(req, res) {
  console.log(req.body.SalesInv);
  res.send({ status: 'SUCCESS' });
});
/*
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});*/

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

module.exports=app
