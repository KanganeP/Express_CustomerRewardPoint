import bodyParser from 'body-parser';
import express from 'express';
import { default as mongodb } from 'mongodb';
let MongoClient = mongodb.MongoClient;


const app = express();
app.use(bodyParser.json());
app.use(express.json());
const url = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

//--add header
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.post('/api/makepayment', async function(req, res){
  console.log("reqbody", req.body.customerPrice);
  const makepayment = {
    cus_price: req.body.customerPrice,
    cus_reward: req.body.customerPoint,
    cus_tran_date: req.body.TransactionDate
  }
  MongoClient.connect(url, {
  }, (err, client) => {
    if (err) {
      return console.log(err);
    }
    const db = client.db('local');

    console.log(`MongoDB Connected: ${url}`);

    const courses = db.collection('cus_payment_details');

    courses.insertOne({ price: makepayment.cus_price, rewards: makepayment.cus_reward, tran_date: makepayment.cus_tran_date }, (err, result) => { console.log(result); });
  });

  res.status('200').send("Success");
})

app.get('/api/payment/list', (req, res) => {

  MongoClient.connect(url, {
  }, (err, client) => {
    if (err) {
      return console.log(err);
    }
    const db = client.db('local');

  db.collection('cus_payment_details').find({}).toArray().then(result => {
      if (result) {
        const data = JSON.stringify(result)
        console.log("result", data)
        res.status('200').send(data);

      } else {
        res.status('400').send(false);
      }
    })
  })
});

app.get('/api/latest/date', (req, res) => {

  MongoClient.connect(url, {
  }, (err, client) => {
    if (err) {
      return console.log(err);
    }
    const db = client.db('local');
    
  db.collection('cus_payment_details').find({}).toArray().then(result => {
      if (result) {
        const data = JSON.stringify(result)
        console.log("result", data)
        res.status('200').send(data);

      } else {
        res.status('400').send(false);
      }
    })
  })
});


app.listen(8080);