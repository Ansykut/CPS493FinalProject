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

//getWorkoutsByUserId
async function getWorkoutsByUserId(id){
    const db = await getCollection();
    console.log(await getWorkouts())
    const arr = await db.find({ userId: new ObjectId(id) }).toArray();
    console.log(arr)
    return arr;
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


const defaultWorkout = {
  dateDaysAgo: 0,
  type: '',
  distance: 0,
  duration: 0,
  location: '',
  photo: ''
}


//direct rip from users.js
async function addWorkout(newWorkout, userId) {
    newWorkout = { ...defaultWorkout, ...newWorkout };
    const col = await getCollection();
    // by userId
    const result = await col.insertOne({ ...newWorkout, userId: new ObjectId(userId) });
    newWorkout._id = result.insertedId;
  
    return newWorkout;
  }


async function deleteWorkout(workout) {
    const userCollection = await client.db(DB_NAME).collection(COLLECTION_NAME);
    const result = await userCollection.deleteOne({ workout: workout });
}

//deleteAllWorkouts
async function deleteAllWorkouts() {
    const userCollection = await client.db(DB_NAME).collection(COLLECTION_NAME);
    const result = await userCollection.deleteMany({});
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
    deleteAllWorkouts,
    getWorkoutsByUserId,
};