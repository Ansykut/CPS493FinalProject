const express = require('express');
const model = require('../models/workouts');
const router = express.Router();

router
    .get('/', (req, res) => {
        const list = model.getWorkouts();
        res.send(list)
    })

    .get('/search/:q', (req, res) => {
        const term = req.params.q;
        console.log({ term });
        const list = model.searchWorkout(term);
        res.send(list);
    })

    .get('/:workout', (req, res) => {
        const workout = req.params.workout;
        const list = model.getWorkoutById(workout);
        res.send(list);

    
    })

    .post('/', (req, res) => {
        const workout = req.body;

        console.log({ user });
        console.log( req.query );
        console.log( req.params );
        console.log( req.headers );

        model.addProduct(workouts);
        res.send(workouts);
    })
  
    .patch('/', (req, res) => {
        const workouts = req.body;
        model.updateWorkout(workouts);
        res.send(workouts);
    })

  
    .delete('/', (req, res) => {
        const workout = req.body;
        model.deleteWorkout(workout);
        res.send(workout);
    })

module.exports = router;

