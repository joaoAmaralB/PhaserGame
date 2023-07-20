const express = require('express');
const bodyParser = require('body-parser');
//================================
const mongoose = require('mongoose');
var cors = require('cors');
mongoose.connect('mongodb+srv://jogosifb:j0g051fb@cluster0.ftxpehj.mongodb.net/?retryWrites=true&w=majority');
//======================================
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//========================================

const RankingController = require('./controller/RecordController');

app.post('/ranking', RankingController.store);

// inicialização básica
app.get('/', (req, res) => {
  res.send('REST API Game');
});

app.listen(3000, () => console.log('server REST API GAME started'));