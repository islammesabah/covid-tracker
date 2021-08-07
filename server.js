const express = require("express");
const cors = require('cors'); 
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const axios = require("axios");
const path = require("path");

// access .env file
require('dotenv').config();

//start express and set the uri port
const server = express();
const port = process.env.PORT || 5000;

// use cors and set express response to json formate
server.use(cors());
server.use(express.json());

// initialize firebase database
var serviceAccount = require(process.env.servicePath);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
});
const database = admin.database();

// set database referance to access them easily
const userRef = database.ref('/users');
const locationRef = database.ref('/locations');
const regionRef = database.ref('/region');

// post request to register user
server.post('/user', async (req, res) => {
  try {
      // check if the email already exist
      userRef
        .orderByChild("email")
        .equalTo(req.body.email)
          .once("value", async (snapshot) => {
            if (!snapshot.exists()) {
              // get new user id
              const user_id = userRef.push().key;

              // hash the password
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(req.body.password, salt);
              var data = req.body;
              data["password"] = hashPassword;
              data["ID"] = user_id;

              // save new user
              userRef
                .child(user_id)
                .set(req.body)
                .then(res.json(user_id))
                .catch((err) => res.status(400).json("Error: " + err));
            } else {
            res.status(400).json("This Email is already exist!");
          }
        });
    } catch (err) {
      res.status(500).json("The post failed: " + err.name);
    }
});

//update user data
server.post("/updateuser", async (req, res) => {
  try {
    var data = req.body;
    data["ID"] = req.body.ID;
          userRef
            .child(req.body.ID)
            .set(data)
            .then(res.json("Done"))
            .catch((err) => res.status(400).json("Error: " + err));
    
  } catch (err) {
    res.status(500).json("The post failed: " + err.name);
  }
});

// // post request to login
server.post('/login', async (req, res) => {
  // access the given email
    userRef.orderByChild('email').equalTo(req.body.email).once('value', async (snapshot) => {
      var data = snapshot.val()
      // check if the email exist 
      if (data != null) {
          // validate the password
            const validate = await bcrypt.compare(
              req.body.password,
              data[Object.keys(data)[0]].password
            );
        !validate && res.status(400).json("Wronge Email or Password");
        // return the user id
        if (validate) res.status(200).json(Object.keys(data)[0]);
        }else{
            res.status(400).json('Wronge Email or Password');
        }
    }, (errorObject) => {
        res.status(500).json('The post failed: ' + errorObject.name);
      });
});

//change current password
server.post("/changepassword", async (req, res) => {
    userRef
      .child(req.body.ID)
      .once(
        "value",
        async (snapshot) => {
          var data = snapshot.val();
          // get user data
          if (data != null) {
            // validate the password
            const validate = await bcrypt.compare(
              req.body.current_password,
              data.password
            );
            !validate && res.status(400).json("Wronge Password");
          
            if (validate) {
              // hash the password
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(req.body.new_password, salt);
              data["password"] = hashPassword;

              // update the data
              userRef
                .child(req.body.ID)
                .set(data)
                .then(res.json(data))
                .catch((err) => res.status(400).json("Error: " + err));
            }
          } else {
            res.status(400).json("Wronge Email or Password");
          }
        },
        (errorObject) => {
          res.status(500).json("The post failed: " + errorObject.name);
        }
      );
});

// set location
server.post('/location', (req, res) => {
  // get the user information to save the tempreature and pcr_result
  // to be aple to filter the content when showing the map
  // here we chose to save the data again on the dataset 
  // instead of ask the server again for it in seperate request
  userRef.child(req.body.ID).once("value", async (snapshot) => {
    if (snapshot.exists()) {
      // save the data
             locationRef
               .child(req.body.ID)
               .set({
                 temperature: snapshot.val().temperature
                   ? snapshot.val().temperature
                   : 37,
                 pcr_result: snapshot.val().pcr_result
                   ? snapshot.val().pcr_result
                   : "Not Taken",
                 longitude: req.body.longitude,
                 latitude: req.body.latitude,
                 region: req.body.region,
               })
               .then(res.status(200).json("done"))
               .catch((err) => res.status(400).json("The post failed: " + err));
    }
      },
        (errorObject) => {
          res.status(500);
        });
});

// add the regions
server.post("/region", (req, res) => {
  // get the regions from its cordinates using locationIq
   axios
     .post(
       "https://us1.locationiq.com/v1/reverse.php?key=" +
         process.env.locationIqAPIkey +
         "&lat=" +
         req.body.latitude +
         "&lon=" +
         req.body.longitude +
         "&format=json"
     )
     .then(function (response) {
       if (response.data) {
         // save the name and the geojson of it
        var id = ""
         if (response.data.address.city) {
          id = response.data.address.city
         } else {
           id = response.data.address.state
         }
           regionRef
             .child(id)
             .set({
               latitude: response.data.lat,
               longitude: response.data.lon,
             })
             .then(res.status(200).json(id))
             .catch((err) => res.status(400).json("The post failed: " + err));
       } else {
         res.status(400).json("Can not find a state for this coordinates");
       }
     })
     .catch((err) => res.status(400).json("The post failed: " + err));
});

// add the regions
server.get("/region", (req, res) => {
  regionRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    }
  },
    (errorObject) => {
      res.status(400).json("The read failed: " + errorObject.name);
    });
});

// read user
server.get('/user', (req, res) => {
    userRef.child(req.query.ID).once(
      "value",
      (snapshot) => {
        var data = snapshot.val();
        if (data != null) {
          res.status(200).json(data);
        } else {
          res.status(400).json("Error: no user with this ID!");
        }
      },
      (errorObject) => {
        res.status(400).json("The read failed: " + errorObject.name);
      }
    );
});

if (process.env.NODE_ENV == 'production') {
  server.use(express.static(path.resolve(__dirname, "./client/build")));
  server.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });
}

// start the server
server.listen(port,()=>{
    console.log(`Server is listening to port ${port}`);
});