const { ObjectId, connect } = require('./mongo');
const data = require('../data/workouts.json');



const COLLECTION_NAME = 'workouts';
async function getWorkouts() {
  const db = await connect();
  return db.collection(COLLECTION_NAME);
}


/**
 * @returns {Promise<workouts[]>} An array of workouts.
 */

async function getWorkouts(){
    const db = await getWorkouts();
    return db.find({}).toArray();
}

``
async function addWorkout(workout) {
    const newWorkout = { 
    id : data.workouts.length + 1, ...workout };
    data.workouts.push(workout);
}


async function deleteWorkout(workout) {
    const index = data.workouts.findIndex(s => s.workout === workout);
    data.workouts.splice(index, 1);
}


module.exports = {
    getWorkouts,
    addWorkout,
    deleteWorkout,
};