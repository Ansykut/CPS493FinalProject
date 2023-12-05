const path = require('path')
const express = require('express');
require('dotenv').config();
const productController = require('./controllers/products');
const userController = require('./controllers/users');
const workoutController = require('./controllers/workouts');
const app = express();
const { connect } = require('./models/mongo');

const PORT = process.env.PORT ?? 3000;

console.log(`The best class at SUNY New Paltz is ${process.env.BEST_CLASS}`);

app
    .use('/', express.static(path.join( __dirname, '../client/dist/') ) )
    .use(express.json())

    // CORS
    /*
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
    })
*/
    .use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            // Make sure OPTIONS request are always allowed
         // That way pre-flight requests don't fail
         if(req.method === 'OPTIONS') {
            return res.status(200).send({})
        }
        next()
    })

    .use('/api/v1/products', productController)
    .use('/api/v1/users', userController)
    .use('/api/v1/workouts', workoutController) //<------------------ shouldnt this work?


    .get('*', (req, res) => {
        res.sendFile(path.join( __dirname, '../client/dist/index.html') )
    });

app
    .use((err, req, res, next) => {
        console.error(err);
        res
            .status(err?.status || 500)
            .json({ message: err?.message || err });
    })



console.log('1: Trying to start server...');

app.listen(PORT, async () => {
    console.log(`2: Server is running at http://localhost:${PORT}`);
     connect().then(() => {
        console.log('Connected to database');
    })
});

console.log('3: End of file, waiting for requests...');