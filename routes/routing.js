const express = require('express');

const routing = express.Router();
const control = require('../controller/control');

routing.post('/login', control.loginauth);
routing.post('/salesorder',control.addsalesorder);
routing.post('/receipt',control.addreceipt);
routing.get('/salesorder/:user/:executive',control.getsalesorder);
routing.get('/receipt/:user/:executive',control.getreceipt);
routing.get("/voucher/:user/:start/:end",control.getvoucher);
routing.get("/extract/:user/:start/:end",control.extractdata);
routing.post("/import",control.importdata);
routing.post("/importled",control.importled);
routing.post("/importcc",control.importcc);
routing.post("/importstock",control.importstock);
routing.get("/party/:user",control.getparty);
routing.get("/stock/:user",control.getstock);
routing.get("/cc/:user",control.getcc);

routing.all('*', control.invalid);

module.exports = routing;
