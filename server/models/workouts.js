/**
 * id: number,
  dateDaysAgo: number,
  type: string,
  distance: number,
  duration: number,
  location: string,
  photo: string
@typedef {Object} Workout
* @property {number} id
* @property {number} distance
* @property {number} duration
* @property {string} location
* @property {string} photo

interface stats {
  distance: number,
  duration: number,
  avgpace: number,
  calories: number,
@typedef {Object} Stats 
* @property {number} distance
* @property {number} duration
* @property {number} avgpace
* @property {number} calories
*/


//Not sure if these are needed here or just users.js
/**
 * @typedef {Object} HasId
 * @property {number} id
 */

/**
 * @typedef {Workout & HasId} savedWorkout
 */
/**
 * @type { {workouts: savedWorkout[]} }
 */






const { ObjectId, connect } = require('./mongo');
const { client, DB_NAME } = require("./mongo");
const data = require('../data/workouts.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const { use } = require('../controllers/workouts'); //Copilot might be trying to mess me up here




//Updated to match users.js DID NOT CHANGE ANY DB NAMES!!!!!!
const COLLECTION_NAME = 'workouts';
async function getCollection() {
    console.log('getCollection', DB_NAME, COLLECTION_NAME)
    const db = client.db(DB_NAME)//await connect();
  return db.collection(COLLECTION_NAME);
}

//updated to match users.js Choose workout b/c above typedef
/**
 * @returns {Promise<savedWorkout[]>} An array of saved workouts.
 */

//updated to match users.js
async function getWorkouts(){
    const db = await getCollection();
    return db.find({}).toArray();
}
/**
 * @param {number} id - The user's ID.
 */

//direct rip from users.js
async function get(id) {
    const col = await getCollection();
    return await col.findOne({ _id: ObjectId(id) });
  }

/**
 * @param {Workout} values - The workout to be create.
 * @returns {savedWorkout} The created workout.
 */
//direct rip from users.js
async function addWorkout(newWorkout) {
    const col = await getCollection();
    const result = await col.insertOne(newWorkout);
    newWorkout._id = result.insertedId;
  
    return newWorkout;
  }


async function deleteWorkout(workout) {
    const userCollection = await client.db(DB_NAME).collection(COLLECTION_NAME);
    const result = await userCollection.deleteOne({ workout: workout });
}

async function seed() {
    try {
        const col = await getCollection();
        await col.insertMany(data.workouts);
    } catch (error) {
        console.error("Error seeding workouts:", error);
    }
}
module.exports = {
    getWorkouts,
    addWorkout,
    deleteWorkout,
    seed,
};