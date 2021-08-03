const express = require("express");
const cors = require('cors'); 
var admin = require("firebase-admin");
const bcrypt = require("bcrypt");

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

// register user
app.post('/user', async (req, res) => {
    try {
      userRef
        .orderByChild("email")
        .equalTo(req.body.email)
          .once("value", async (snapshot) => {
            console.log(snapshot.val())
          if (!snapshot.exists()) {
            const user_id = userRef.push().key;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            var data = req.body;
              data["password"] = hashPassword;
              data["ID"] = user_id;
            userRef
              .child(user_id)
              .set(req.body)
              .then(res.json(user_id))
              .catch((err) => res.status(400).json("Error: " + err));
          } else {
              console.log("ssss")
            res.status(400).json("This Email is already exist!");
          }
        });
    } catch (err) {
      res.status(500).json("The read failed: " + err.name);
    }
});

// login
app.get('/login', async (req,res) =>{
    userRef.orderByChild('email').equalTo(req.body.email).once('value', async (snapshot) => {
        var data = snapshot.val()
        if (data != null) {
            const validate = await bcrypt.compare(
              req.body.password,
              data[[Object.keys(data)[0]]].password
            );
            !validate && res.status(400).json("Wronge Email or Password");
            res.status(200).json(Object.keys(data)[0]);
        }else{
            res.status(400).json('Wronge Email or Password');
        }
    }, (errorObject) => {
        res.status(500).json('The read failed: ' + errorObject.name);
      });
});

// set location
app.post('/setlocation',(req,res) =>{
    locationRef.child(req.body.user_id).set({
        longitude: req.body.longitude,
        latitude: req.body.latitude
    }).then(res.json("location set"))
    .catch(err => res.status(400).json('Error: '+err));;
});



// read users
app.get('/getuser',(req,res) =>{
    userRef.child(req.body.user_id).once('value', (snapshot) => {
        var data = snapshot.val()
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