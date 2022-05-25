
const express = require('express'); // Require express
const app = express();
require('dotenv').config();
var cors = require('cors')
const validUrl = require('valid-url')
const port = process.env.PORT || 6500; //setting the port

const fetchuser = require("../src/middleware/fetchuser")


app.use(cors({
    origin:'https://url-shortner-task.netlify.app'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))//important line

//connect the database to our project
require("../src/db/dbconnection")

const shortUrl = require('../src/models/shorturlSchema');






// signup routes
app.use('/api/auth', require('../routes/auth'))





// Routes

app.get('/', (req, res) => {

    res.send("Hello");
})

app.get('/fetchdata', fetchuser, async (req, res) => {

    try {
        const allData = await shortUrl.find({ user: req.user.id });

        res.json(allData)
    } catch (error) {

        res.send(error);

    }
})


// add a short url in data base login required
app.post('/adddata/short', fetchuser, async (req, res) => {


      const {fullUrl} = req.body;


       const url = fullUrl

    if (validUrl.isUri(url)) 
    {
        try {
            const newShort = new shortUrl({

                user: req.user.id,

                full: url
            })




            const result = await newShort.save();
            res.json(result)

            

        




        } catch (error) {
            res.status(404).send(error);
        }

    }else {

        res.status(404).send("Invalid URL")
    }


})


app.get('/:shortid', async (req, res) => {


    // grab the short id by req url
    const sId = req.params.shortid;

    //perform to mongoose call to find the long url

    const data = await shortUrl.findOne({ short: sId })

    if (!data) {
        return res.status(404).send("NO URL")
    }

    data.clicks++;

    await data.save()

    res.redirect(data.full)



})

app.listen(port, () => {

    console.log(`server is running at ${port}`);
})