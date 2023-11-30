const express = require('express');
const model = require('../models/workouts');
const router = express.Router();

router

    //updated to match users.js
    .get('/', async (req, res) => {
    try {
        console.log('get all')
        let workouts = await model.getAll()
        return res.status(200).json({ message: "success", workouts })
    } catch (error) {
        console.log(error)
    }
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

    //updated to match users.js
    .post('/seed', (req, res, next) => {
        console.log('seed')
        model.seed()
            .then(x => {
                const data = { data: x, isSuccess: true };
                res.send(data)
            }).catch(next);
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