const express = require("express");
const cors = require('cors'); 
var admin = require("firebase-admin");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

var serviceAccount = require(process.env.servicePath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
});
  
const database = admin.database();
const userRef = database.ref('/users');
const locationRef = database.ref('/locations');

// create user
app.post('/user',(req,res) =>{
    const user_id = userRef.push().key;
    userRef.child(user_id).set({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        age: req.body.age,
        phone_number: req.body.phone_number,
        password: req.body.password
    }).then(res.json("User Created"))
    .catch(err => res.status(400).json('Error: '+err));
});

//add health info
app.post('/addhealthinfo',(req,res) =>{
    console.log(req)
    userRef.child(req.body.user_id).update({
        temperature: req.body.temperature,
        vaccened: req.body.vaccened,
        vaccine_type: req.body.vaccine_type,
        vaccine_date: req.body.vaccine_date,
        pcr_result: req.body.pcr_result,
        location_access: req.body.location_access
    }).then(res.json("Info added"))
    .catch(err => res.status(400).json('Error: '+err));
});

// set location
app.post('/setlocation',(req,res) =>{
    locationRef.child(req.body.user_id).set({
        longitude: req.body.longitude,
        latitude: req.body.latitude
    }).then(res.json("location set"))
    .catch(err => res.status(400).json('Error: '+err));;
});

// read user credentials
app.get('/getcredentials',(req,res) =>{
    userRef.orderByChild('email').equalTo(req.body.email).once('value', (snapshot) => {
        data = snapshot.val()
        if(data != null){
            res.json({
                password: data[[Object.keys(data)[0]]].password
            })
        }else{
            res.status(400).json('Error: check your email!')
        }
    }, (errorObject) => {
        res.status(400).json('The read failed: ' + errorObject.name);
      });
});

// read users
app.get('/getuser',(req,res) =>{
    userRef.child(req.body.user_id).once('value', (snapshot) => {
        data = snapshot.val()
        if(data != null){
            res.json(data)
        }else{
            res.status(400).json('Error: no user with this ID!')
        }
    }, (errorObject) => {
        res.status(400).json('The read failed: ' + errorObject.name);
      });
});

// var longx = 500
// var longy = 500
// var latx = 500
// var laty = 500

// const snapshot = locationRef.where('longitude', '>=', longx).where('longitude', '<=', longy)
//             .where('latitude', '>=', latx).where('latitude', '<=', laty).get();
// if (snapshot.empty) {
//   console.log('No matching documents.');
//   return;
// }  

// snapshot.forEach(doc => {
//   console.log(doc.id, '=>', doc.data());
// });

app.listen(port,()=>{
    console.log(`App is listening to port ${port}`);
});