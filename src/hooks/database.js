var admin = require("firebase-admin");

var serviceAccount = require(process.env.servicePath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL,
});


export const database = admin.database();
