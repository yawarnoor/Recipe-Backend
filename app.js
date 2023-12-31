
const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer')
const Recipe = require('./models/recipeSchema');
const cors = require('cors')
const bodyParser = require('body-parser');

var uniqueSuffix = "";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      uniqueSuffix = `${Date.now()}-${file.originalname}`
      cb(null, uniqueSuffix)
    }
  })
  
  const upload = multer({storage})

const app = express();
app.set('view engine', 'ejs');


//const dbURI = "mongodb+srv://admin:admin123@cluster0.y7qqkrq.mongodb.net/?retryWrites=true&w=majority";
const dbURI = "mongodb://admin:admin123@ac-phhcjlt-shard-00-00.y7qqkrq.mongodb.net:27017,ac-phhcjlt-shard-00-01.y7qqkrq.mongodb.net:27017,ac-phhcjlt-shard-00-02.y7qqkrq.mongodb.net:27017/recipes?ssl=true&replicaSet=atlas-qjxm2g-shard-0&authSource=admin&retryWrites=true&w=majority";



mongoose.connect(dbURI)
.then( (result) => {
    app.listen(3000);
    console.log("Connected to Mongo");
});

app.use(cors());
app.use(express.static('uploads'));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/search', (req, res) => {
    const query = req.query.query;

    Recipe.find()
    .then((result) => {
        const results = result.filter(recipe => {
            return(
            recipe.name.toLowerCase().includes(query.toLowerCase()) ||
            recipe.desc.toLowerCase().includes(query.toLowerCase()) ||
            recipe.chef.toLowerCase().includes(query.toLowerCase())
    )});
        res.render('home', {recipes: results});
    })
    .catch( (err) => {console.log(err)})
    
});

app.get('/', (req,res) => {
    Recipe.find()
    .then((result) => {
        res.render('home', {recipes: result});
    })
    .catch( (err) => {console.log(err)})
    
});

app.get('/recipe/new', (req,res) => {
    res.render('newRecipe');
});

app.post('/recipe/new', upload.single("file"), (req,res) => {
    data = req.body;
    data.file = `${uniqueSuffix}`;
    console.log(data);
    const recipe = new Recipe(req.body);
    recipe.save()
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => console.log(err));
});

app.get('/recipe/:id', (req,res) => {
    const id = req.params.id;
    Recipe.findById(id)
    .then((result)=>{
        res.render('details', {recipe: result});
    })
    .catch((err) => console.log(err));
})

app.get('/recipe/edit/:id', (req,res) => {
    const id = req.params.id;
    Recipe.findById(id)
    .then((result)=>{
        res.render('edit', {recipe: result});
    })
    .catch((err) => console.log(err));
})

app.post('/recipe/:id', (req,res) => {
    const id = req.params.id;
    Recipe.findByIdAndUpdate(id,req.body, { new: true })
    .then((e)=>{
        res.redirect('/')
    })
})

app.delete('/recipe/:id', (req,res) => {
    const id = req.params.id;
    Recipe.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect : "/"});
    })
    .catch((err) => console.log(err));
})

