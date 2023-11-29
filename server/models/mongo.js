/* B"H
*/

const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB_NAME;
console.log(uri,DB_NAME)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {});

async function connect() {
 try{
   await client.connect();
 }catch(err){

  console.log('Failed to connect to databese')
 }
}

module.exports = { 
  connect, ObjectId, DB_NAME,client
};
