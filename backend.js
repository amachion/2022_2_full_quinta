const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
app.use(cors())

const Filme  = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarMongo () {
    await mongoose.connect(`mongodb+srv://pro_mac:machion@cluster0.skf8n.mongodb.net/?retryWrites=true&w=majority`)
}

app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find()
    res.json(filmes)
})

app.post('/filmes', async (req, res) => {
    //capturar os dados que o cliente preencheu
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //monta um objeto "json" com os dados recebidos, de acordo com o modelo Filme do Mongoose
    const filme = new Filme ({titulo: titulo, sinopse: sinopse})
    //acrescentar o filme novo à base no MongoDB
    await filme.save()
    const filmes = await Filme.find()
    res.json(filmes)
})

app.post('/signup', async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password
        const criptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario({login: login, password: criptografada})
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.status(201).end()
    }
    catch (error) {
        console.log(error)
        res.status(409).end()
    }
})
app.post('/login', async (req, res) => {
    const login = req.body.login
    const password = req.body.password

    const existeUsuario = await Usuario.findOne({login: req.body.login})
    if (!existeUsuario) {
        //recurso não encontrado, código 404
        return res.status(404).json({mensagem: "usuário não cadastrado"})
    }
    //aqui sabemos que o usuário existe, vamos verificar a senha
    const senhaOk = await bcrypt.compare(password, existeUsuario.password)
    if (!senhaOk) {
        //usuário não autorizado, código 401
        return res.status(401).json({mensagem: "senha inválida"})
    }
    //se tudo deu certo, vamos gerar o token para aramazenamento lá no front
    const token = jwt.sign(
        {login: login},
        //vamos usar uma chave secreta gerada daqui a há pouco
        "chave_secreta",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})
})

app.listen(3000, () => {
    try {
        conectarMongo()
        console.log("up and running and connected")
    }
    catch (e) {
        console.log ("oh oh: ", e)
    }
})
    