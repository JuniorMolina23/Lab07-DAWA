const mongoose = require('mongoose');
const express = require('express');
const { render } = require('ejs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
var datos = [];
//COnfiguracion de base de datos
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado exitosamente');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


const userSchema = new mongoose.Schema({
    Nombre: String,
    Artista: String,
    Genero: String,
    Duracion: String,
    Reproducciones: String
});

const Music = mongoose.model('Musica', userSchema);
// Configurar el motor de plantillas
app.set('views', './views');

app.use(express.static('public'));
app.engine('ejs', require('ejs').renderFile);

app.get('/', (req, res) => {
    Music.find().then((musics) => {
        res.render('index.ejs',{musica:musics});
    }).catch((error) => {
        res.render('index.ejs',{musica:error});
    });
    
});
app.get('/agregar', (req, res) => {
    res.render('agregar.ejs')
});

//Insertar nueva data
app.post('/insertar', (req, res) => {
    for (const x in req.body){
        datos.push(req.body[x])
    }
    const newMusic = new Music({
        Nombre: datos[0],
        Artista: datos[1],
        Genero: datos[2],
        Duracion: datos[3],
        Reproducciones: datos[4]
    });
    datos = []
    newMusic.save().then(() => {
        console.log('Musica agregada correctamente');
    }).catch((error) => {
        console.error('Error al agregar musica:', error);
    });
    res.redirect('/')
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Aplicación web dinámica ejecutándose en el puerto 3000');
});
