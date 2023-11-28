const data = require('../data/workouts.json');

function getWorkouts(){
    return data.workouts;
}

function getWorkoutbyName(workout) {
    return data.workouts.find(workouts => workouts.workout === workout);
}


function addWorkout(workout) {
    workout.id = data.workouts.length + 1;
    data.workouts.push(workout);
}


function updateWorkout(workout) {
    const index = data.workouts.findIndex(s => s.id === workout.id);
    data.workouts[index] = workout;
}


function deleteWorkout(workout) {
    const index = data.workouts.findIndex(s => s.workout === workout);
    data.workouts.splice(index, 1);
}

function searchWorkout(searchTerm) {
    return data.workouts.filter(workouts => {
        return  workouts.title.toLowerCase().includes(searchTerm.toLowerCase())  ||
            workouts.description.toLowerCase().includes(searchTerm.toLowerCase())  ||
            workouts.brand.toLowerCase().includes(searchTerm.toLowerCase());
    });
}

module.exports = {
    getWorkouts,
    getWorkoutbyName,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    searchWorkout
    
    
};