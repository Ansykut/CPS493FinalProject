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
//const { use } = require("../controllers/products");
const { ObjectId, connect } = require('./mongo');

const JWT_SECRET = process.env.JWT_SECERT;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
console.log(JWT_SECRET, JWT_EXPIRES_IN)

const COLLECTION_NAME = 'users';
async function getCollection() {
  console.log('getCollection', DB_NAME, COLLECTION_NAME)
  const db = client.db('exerciseDB')//await connect();
  return db.collection(COLLECTION_NAME);
}

/**
 * @returns {Promise<User[]>} An array of products.
 */
async function getAll() {
  const col = await getCollection();
  return col.find({}).toArray();
}

/**
 * @param {number} id - The user's ID.
 */
async function get(id) {
  const col = await getCollection();
  return await col.findOne({ _id: ObjectId(id) });
}
/*x.firstName.toLowerCase().includes(query.toLowerCase()) ||
      x.lastName.toLowerCase().includes(query.toLowerCase()) ||
      x.email.toLowerCase().includes(query.toLowerCase()) ||
      x.username.toLowerCase().includes(query.toLowerCase())*/
async function search(query) {
  const col = await getCollection();
  const users = await col.find({
    or: [
      { firstName: { $regex: query, $options: 'i' } }, // i stands for ignore case
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
    ],
  }).toArray();

  return users;
}

/**
 * @param {BaseUser} values - The user to create.
 * @returns {User} The created user.
 */
async function create(newUser) {
  const col = await getCollection();
  const result = await col.insertOne(newUser);
  newUser._id = result.insertedId;

  return newUser;
}

/**
 * @param {BaseUser} baseUser The user to create.
 * @returns {Promise<User>} The created user.
 */
async function register(baseUser) {
  try {
    

    const userCollection = await client.db('exerciseDB').collection('users');

    const userExist = await userCollection.find({ email: baseUser.email }).toArray()
    console.log(userExist.length)

    if (userExist.length > 0) {
      throw {
        message: 'Email already exist',
        status: 400
      }
    }
    const salt = 10
    const passwordHash = await bcrypt.hash(password, salt)
    
    // spread operator, copy all the properties of baseUser into newUser
    // adds password property to newUser
    const newUser = {password:passwordHash, ...baseUser} 
    await userCollection.insertOne(newUser)
    return newUser
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
  try {
    const userCollection = await client.db('exerciseDB').collection('users');
    const existingUser = await userCollection.find({ email }).toArray()
    if (existingUser.length === 0) {
      throw {
        message: 'Invalid email or password',
        status: 400
      }
    }

    const user = existingUser[0]
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
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
  } catch (error) {
    throw error

  }
}

/**
 * @param {User} newValues - The user's new data.
 * @returns {User} The updated user.
 */
async function update(newValues) {
  try {
    const userCollection = await client.db('exerciseDB').collection('users');
    const existingUser = await userCollection.findOne({ id: newValues.id });
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...existingUser, // spreads out the existing user
      ...newValues, // if there are any new values, it will override the existing user
    };
    await userCollection.updateOne({ id: newValues.id }, { $set: updatedUser });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {number} id - The user's ID.
 */
async function remove(id) {
  try {
    const userCollection = await client.db(DB_NAME).collection(COLLECTION_NAME);
    const result = await userCollection.deleteOne({ id: id });
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
}

async function generateJWT(user) {

  try {
    return await jwt.sign(user, JWT_SECRET);
  } catch (error) {
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

async function seed() {
  const col = await getCollection();

  await col.insertMany(data.users);
}


module.exports = {
  getAll, get, search, create, update, remove, login, register, generateJWT, verifyJWT, seed
};