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
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const { use } = require("../controllers/products");
const { ObjectId, connect } = require("./mongo");

const JWT_SECRET = process.env.JWT_SECERT;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
console.log(JWT_SECRET, JWT_EXPIRES_IN);

const COLLECTION_NAME = "users";
async function getCollection() {
  console.log("getCollection", DB_NAME, COLLECTION_NAME);
  const db = client.db(DB_NAME); //await connect();
  return db.collection(COLLECTION_NAME);
}

/**
 * @returns {Promise<User[]>} An array of products.
 */
async function getAll() {
  const col = await getCollection();
  return col.find({}).toArray();
}

async function add(user) {
  if(await isEmailTaken(user.email)){
    throw new Error("email already exists");
  }
  const col = await getCollection();
  const result = await col.insertOne(user);
  return result
}

/**
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if the email is taken, false otherwise.
 */
async function isEmailTaken(email) {
  const col = await getCollection();
  const user = await col.findOne({ email });
  return user !== null;
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
  const users = await col
    .find({
      or: [
        { firstName: { $regex: query, $options: "i" } }, // i stands for ignore case
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
    .toArray();

  return users;
}

/**
 * @param {BaseUser} values - The user to create.
 * @returns {User} The created user.
 */
async function create(values) {
  const col = await getCollection();
  const newItem = {
    id: data.users.length + 1,
    ...values,
  };
  const result = await col.insertOne(newItem);
  return newItem;
}

/**
 * @param {BaseUser} values - The user to register.
 * @returns {Promise<User>} The registered user.
 */
async function register(values) {
  // register is like create but with validation
  // and some extra logic

  const exists = data.users.some((x) => x.username === values.username);
  if (exists) {
    throw new Error("Username already exists");
  }

  if (values.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // TODO: Make sure user is created with least privileges

  const col = await getCollection();
  const newItem = {
    id: data.users.length + 1,
    ...values,
  };

  await col.insertOne(newItem);
  return newItem;
}

/**
 * @param {string} email
 * @param {string} password
 * @returns { Promise< { user: {}, token: string}> } The created user.
 */
async function login(email, password) {
  const col = await getCollection();
  const user = await col.findOne({ email: email });
  if (!user) {
    throw {
      message: "User not found",
      status: 404,
    };
  }
  if (user.password !== password) {
    throw {
      message: "Password is incorrect",
      status: 400,
    };
  }
  const squeakyCleanUser = { ...user, password: undefined };
  const token = await generateJWT(squeakyCleanUser);
  return { user: squeakyCleanUser, token: token };
}

/**
 * @param {User} newValues - The user's new data.
 * @returns {User} The updated user.
 */
async function update(newValues) {
  try {
    const userCollection = await client.db("exerciseDB").collection("users");
    const existingUser = await userCollection.findOne({ id: newValues.id });
    if (!existingUser) {
      throw new Error("User not found");
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
      throw new Error("User not found");
    }
  } catch (error) {
    throw error;
  }
}

async function generateJWT(user) {
  try {
    return await jwt.sign(user, JWT_SECRET);
  } catch (error) {
    throw error;
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
  });
}

async function seed() {
  const col = await getCollection();

  await col.insertMany(data.users);
}

module.exports = {
  getAll,
  get,
  search,
  create,
  update,
  remove,
  login,
  register,
  generateJWT,
  verifyJWT,
  seed,
  add,
};
