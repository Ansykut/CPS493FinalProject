const express = require('express');
const model = require('../models/users');
const router = express.Router();

router
    .get('/' ,async (req, res, next) => {
      /*  model.getAll(+req.query.page, +req.query.pageSize)
            .then(list => {
                const data = { data: list.items, total: list.total, isSuccess: true };
                res.send(data)

            }).catch(next);
        */

            try{
        let users = await model.getAll()
                 return res.status(200).json({message:"success",users})
            }catch(error){
                console.log(error)
            }
    })

    .get('/search/:q', (req, res, next) => {

        model.search(req.params.q, +req.query.page, +req.query.pageSize)
            .then(list => {
                const data = { data: list.items, total: list.total, isSuccess: true };
                res.send(data)
            }).catch(next);
        
    })

    .get('/:id', (req, res, next) => {

        model.getById(req.params.id)
            .then(x => {
                const data = { data: x, isSuccess: true };
                res.send(data)
            }).catch(next);

    })

    .post('/', (req, res, next) => {

        model.add(req.body)
            .then(x => {
                const data = { data: x, isSuccess: true };
                res.send(data)
            }).catch(next);

    })

    .put('/', (req, res, next) => {

        model.update(req.body)
            .then(x => {
                const data = { data: x, isSuccess: true };
                res.send(data)
            }).catch(next);

    })

    .delete('/', (req, res, next) => {

        model.deleteItem(req.params._id)
            .then(x => {
                const data = { data: x, isSuccess: true };
                res.send(data)
            }).catch(next);
    })

    .post('/seed', (req, res, next) => {
        model.seed()
            .then(x => {
                const data = { data: x, isSuccess: true };
                res.send(data)
            }).catch(next);
    })



   
    .post('/login',async  (req, res) => {
       try{
        const {email,password} = req.body;
        let user = await model.login(email,password)
        return res.status(200).json({message:"success",user})
       }catch(error){
           if(error.code !== 500){
               return res.status(400).json(error.message)
           }else{
                 return res.status(500).json(error.message)
           }
       }
    })

    .post('/register', async (req, res) => {
       try{
       const {email,password, firstName, lastName, maidenName, age, gender, phone, username, birthDate, image, bloodGroup,
        height,macAddress,university,bank,company,ein,ssn,userAgent} = req.body;

         let user = await model.register({email,password, firstName, lastName, maidenName, age, gender, phone, username, birthDate, image, bloodGroup,
            height,macAddress,university,bank,company,ein,ssn,userAgent}) 

         return res.status(200).json({message:"success",user})
       }catch(error){
          if(error.code !== 500){
              return res.status(400).json(error.message)
          }else{
                return res.status(500).json(error.message)
          }
       }    
    })

module.exports = router;