const express = require('express'); // Require express
const app = express();
const validUrl = require('valid-url')
const port = process.env.PORT || 6500; //setting the port

const path = require('path'); // Use the path modules to join the folder with directiory

const hbs = require('hbs') // use hbs module to use dynamic data in express

// Setting the paths
const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")


app.set("view engine", "hbs")
app.use(express.static(static_path));
app.set("views", template_path)
hbs.registerPartials(partials_path)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))//important line

//connect the database to our project
require("../src/db/dbconnection")

const shortUrl = require('../src/models/shorturlSchema')



// Routes
app.get('/', async (req, res) => {

    try {
        const allData = await shortUrl.find();

        res.render('index', { Urls: allData })
    } catch (error) {

        res.send(error);

    }
})


app.post('/short', async (req, res) => {

    const url = req.body.fullUrl

    if (validUrl.isUri(url)) {
        try {

            const checkUrl = await shortUrl.findOne({ full: url });

            if (!checkUrl) {
                const newShort = new shortUrl({

                    full: url
                })




                const result = await newShort.save();
                res.status(201).redirect('/')

            }else{
                res.redirect("/")
            }




        } catch (error) {
            res.status(404).send(error);
        }

    } else {

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