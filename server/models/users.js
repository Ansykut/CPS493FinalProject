// @ts-check
/**
 * @typedef {Object} Bank
 * @property {string} cardExpire
 * @property {string} cardNumber
 * @property {string} cardType
 * @property {string} currency
 * @property {string} iban
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} Address
 * @property {string} address
 * @property {string} [city]
 * @property {Coordinates} coordinates
 * @property {string} postalCode
 * @property {string} state
 */

/**
 * @typedef {Object} Company
 * @property {Address} address
 * @property {string} department
 * @property {string} name
 * @property {string} title
 */

/**
 * @typedef {Object} BaseUser
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} maidenName
 * @property {number} age
 * @property {string} gender
 * @property {string} email
 * @property {string} phone
 * @property {string} username
 * @property {string} password
 * @property {string} birthDate
 * @property {string} image
 * @property {string} bloodGroup
 * @property {number} height
 * @property {string} macAddress
 * @property {string} university
 * @property {Bank} bank
 * @property {Company} company
 * @property {string} ein
 * @property {string} ssn
 * @property {string} userAgent
 */


/**
 * @typedef {Object} HasId
 * @property {number} id
 */

/**
 * @typedef {BaseUser & HasId} User
 */

/**
 * @type { {users: User[]} }
 */
const data = require("../data/users.json");
const { client, DB_NAME } = require("./mongo");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { use } = require("../controllers/products");

const JWT_SECRET = process.env.JWT_SECERT;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
console.log(JWT_SECRET, JWT_EXPIRES_IN)

/**
 * @returns {Promise<User[]>} An array of products.
 */
async function getAll() {
  try {
    const users = await client.db(DB_NAME).collection('users');
    console.log(users)
    return data.users;
  } catch (error) {
    console.log(error)
  }

}

/**
 * @param {number} id - The product's ID.
 */
function get(id) {
  const item = data.users.find(x => x.id === id);
  if (!item) {
    throw new Error('User not found');
  }
  return item
}

function search(query) {
  return data.users.filter(x => {
    return (
      x.firstName.toLowerCase().includes(query.toLowerCase()) ||
      x.lastName.toLowerCase().includes(query.toLowerCase()) ||
      x.email.toLowerCase().includes(query.toLowerCase()) ||
      x.username.toLowerCase().includes(query.toLowerCase())
    );
  });
}

/**
 * @param {BaseUser} values - The user to create.
 * @returns {User} The created user.
 */
function create(values) {
  const newItem = {
    id: data.users.length + 1,
    ...values,
  };

  data.users.push(newItem);
  return newItem;
}

/**
 * @param {BaseUser} values The user to create.
 * @returns {Promise<User>} The created user.
 */
async function register(values) {
  try {
    const { email, password, firstName, lastName, maidenName, age, gender, phone, username, birthDate, image, bloodGroup,
      height, macAddress, university, bank, company, ein, ssn, userAgent } = values;

    const userCollection = await client.db('exerciseDB').collection('users');

    const userEixst = await userCollection.find({ email }).toArray()
    console.log(userEixst.length)

    if(userEixst.length > 0){
      throw {
        message: 'Email already exist',
        status: 400
      }
      
    }

    
    const salt = 10
    const hash = await bcrypt.hash(password, salt)
    const id = Math.floor(Math.random() * 1000)

     await userCollection.insertOne({
      email, password:hash, firstName, lastName, maidenName, age, gender, phone, username, birthDate, image, bloodGroup,
      height, macAddress, university, bank, company, ein, ssn, userAgent ,id
    })

    
    return {
      email, password, firstName, lastName, maidenName, age, gender, phone, username, birthDate, image, bloodGroup,
      height, macAddress, university, bank, company, ein, ssn, userAgent, id
    }
  } catch (error) {
    throw error
  }

}

/**
 * @param {string} email
 * @param {string} password
 * @returns { Promise< { user: {}, token: string}> } The created user.
 */
async function login(email, password) {

 try{
  
  const userCollection = await client.db('exerciseDB').collection('users');
  const  existingUser = await userCollection.find({email}).toArray()
 

  if(existingUser.length === 0){
    throw {
      message: 'Invalid email or password',
      status: 400
    }
  }

  const user = existingUser[0]
  const validPassword = await bcrypt.compare(password, user.password)

  if(!validPassword){
    throw {
      message: 'Invalid credntials',
      status: 400
    }
  }

  const token = await generateJWT(user)
  
  delete user.password
  return {
    user,
    token
  }
 }catch(error){
   throw error
   
 }
}

/**
 * @param {User} newValues - The user's new data.
 * @returns {User} The updated user.
 */
function update(newValues) {
  const index = data.users.findIndex(p => p.id === newValues.id);
  if (index === -1) {
    throw new Error('User not found');
  }
  data.users[index] = {
    ...data.users[index],
    ...newValues,
  };
  return data.users[index];
}

/**
 * @param {number} id - The user's ID.
 */
function remove(id) {
  const index = data.users.findIndex(x => x.id === id);
  if (index === -1) {
    throw new Error('User not found');
  }
  data.users.splice(index, 1);
}

async function generateJWT(user) {
  
  try{
    return await jwt.sign(user, JWT_SECRET);
  }catch(error){
    throw error
  
  }
}

function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  })
}


module.exports = {
  getAll, get, search, create, update, remove, login, register, generateJWT, verifyJWT
};