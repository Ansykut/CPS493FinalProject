const express = require('express');
const model = require('../models/workouts');
const router = express.Router();

router

    //updated to match users.js
    .get('/', async (req, res) => {
        try {
            console.log('get all');
            let workouts = await model.getWorkouts();
            return res.status(200).json({ message: "success", workouts });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    })
    
    .get('/search/:q', (req, res) => {
        const term = req.params.q;
        console.log({ term });
        const list = model.searchWorkout(term);
        res.send(list);
    })
    .get('/user/:user', async (req, res) => {
        const user = req.params.user;
        const list = await model.getWorkoutsByUserId(user);
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

    .post('/', async (req, res) => {
        try {
            const {userId, workout} = req.body;
            const addedWorkout = await model.addWorkout(workout, userId);
            res.status(201).json(addedWorkout);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
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

    //delete all workouts
    .delete('/all', (req, res) => {
        model.deleteAllWorkouts();
        res.send('all workouts deleted');
    })

module.exports = router;