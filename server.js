GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=
const express = require("express");
const app = express();
var mongo = require('mongodb').MongoClient;
const bodyParser=require('body-parser')
var request = require('request')

app.use(express.static("public"));
//app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongo.connect(process.env.DB,{ useUnifiedTopology: true },(err,client)=>{
  var db=client.db('new')
  if (err) throw err;

  require('dotenv').config()

  app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/imagesearch/:search", (req, res) => {
  let search=req.params.search
  let page = req.query.offset? req.query.offset :1
  db.collection('img').insertOne({term:search,searched_on:new Date().toUTCString()},(err,doc)=>{
    request(ggle+search+'&searchType=image',{json:true},(err,red,data)=>{
      let dat=data.items.map((i)=>{return{image_url:i.link,alt_text:i.snippet,page_url:i.image.contextLink}})
      dat=dat.slice(0,page)
      res.send(dat);
    })
  })

  app.post("/api/imagesearch", (req, res) => {
let search=req.body.search
search= encodeURI(search)
let page = req.body.page ? req.body.page :1
})

app.get('/latest/imagesearch',(req,res)=>{
  db.collection('img').find({}).sort({searched_on:-1}).limit(10).toArray((err,doc)=>{
    res.send(doc)
  })
})

const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + 3000);
});
