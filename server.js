const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const {isInvalidEmail,isEmptyPayload} = require('./validator')

const {DB_USER, DB_PASS, DEV} = process.env
const dbAddress = '127.0.0.1:27017'
const url = DEV ?`mongodb://${dbAddress}` : `mongodb://${DB_USER}:${DB_PASS}@${dbAddress}/company_db?authSource=company_db`
const client = new MongoClient(url)
const dbName = 'company_db'
const collName = 'employees'

app.use(bodyParser.json())

app.use(express.static(__dirname + '/dist'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
})
app.get('/get-profile', async function (req, res) {
    try {
    
    // connnect to db
    //await client.connect()
    console.log('Connected successfully to server')

    //initiates or gets the database and collection
    const db =client.db(dbName)
    const collection = db.collection(collName)

    // get data from database
    const result = await collection.findOne({id: 1})
    console.log(result)

    response = {}

    if (result !== null) {
        response = {
            name: result.name,
            email: result.email,
            interests: result.interests
    }
    }
    res.send(response)
    } catch (err) {
        console.error('GET_PROFILE_ERROR:',err)
        res.status(500).send({ error: err.message })
    }finally {
        //client.close()
    }

 })

app.post('/update-profile', async function (req, res) {
    const payload = req.body
    console.log(payload)
 
        if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
            res.status(400).send({ error: "invalid payload. Could not update user profile data" })
            return;
        } else {
            try {
                // connect to Mongodb database
                //await client.connect()
                console.log('Connected successfully to server')

                // initiates or gets the database and collection
                const db = client.db(dbName)
                const collection = db.collection(collName)

                // save payload data to the database 
                payload['id'] = 1
                const updatedValues = { $set: payload }
                await collection.updateOne({ id: 1 }, updatedValues, { upsert: true })

                res.status(200).send({ info: "user profile updated successfully" })
            } catch (err) {
                console.error(err)
                res.status(500).send({ error: err.message })
            } finally {
                //client.close()
            }
        }
    })
async function startServer() {
  await client.connect()
  console.log('Connected to MongoDB')

  const server = app.listen(3000, function () {
    console.log('app listening on port 3000')
  })
}

startServer()

module.exports = {
    app
}