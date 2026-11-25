const express = require('express');

const mysql=require("mysql2");
const app = express()
app.use("/css", express.static(__dirname + "/css"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/js", express.static(__dirname + "/js"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(express.urlencoded({extended:false}))

let conexion=mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD
});

//MOSTRAR OAGINA PRINCIPAL
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/usuarios', function(req, res) {
    let consulta = "SELECT * FROM usuario";
    conexion.query(consulta, function(error, resultados) {
        if (error) {
            console.error(error);
            res.status(500).send("Error al consultar la base de datos");
        } else {
            res.render("usuarios", { usuarios: resultados });
        }
    });
});

app.post('/validar', function(req, res) {
    const { nombres, celular, correo, mensaje } = req.body;
    let registrar = "INSERT INTO informacion (nombres, celular, correo, mensaje) VALUES (?, ?, ?, ?)";
    conexion.query(registrar, [nombres, celular, correo, mensaje], function(error) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error al guardar la información");
        }
        res.send(`
            <script>
                alert("Datos enviados correctamente");
                window.location.href="/";
            </script>
        `);
    });
});

app.post("/registrar", function(req, res) {
    const { dni, nombres, correo, celular } = req.body;
    const sql = `
        INSERT INTO usuario (dni, nombres, correo, celular) 
        VALUES (?, ?, ?, ?)
    `;
    
    conexion.query(sql, [dni, nombres, correo, celular], function(error) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error al registrar");
        }
        res.redirect("/usuarios");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Servidor corriendo en el puerto ${PORT});
});
