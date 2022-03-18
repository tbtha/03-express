const express = require("express")
// 1. Integrar express-fileupload a Express. 
const expressFileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended : false}))
app.use(expressFileUpload())


// 4. Crear una ruta POST /imagen que reciba y almacene una imagen en una carpeta
// pública del servidor. Considerar que el formulario envía un payload con una
// propiedad “position”, que indica la posición del collage donde se deberá mostrar la imagen. 
app.post("/imagen",(req,res) => {
   
   const {posicion} = req.body;
  
// 2. Definir que el límite para la carga de imágenes es de 5MB.
// 3. Responder con un mensaje indicando que se sobrepasó el límite especificado.

   if(req.files.targetFile.size >= 52428800){
       return res.end("sobrepasate el limite, el tope maximo para cargar imagenes es de 5MB")
   }

   const ruta = `${__dirname}/public/imgs/imagen-${posicion}.jpg`
   req.files.targetFile.mv(ruta, (error) => { 
       if(error){
           return res.send("carga de archivo fallida")
       }return res.sendFile(__dirname + "/public/collage.html")
    })

// Crear una ruta GET /deleteImg/:nombre que reciba como parámetro el nombre de
// una imagen y la elimine de la carpeta en donde están siendo alojadas las imágenes
// Considerar que esta interacción se ejecuta al hacer click en alguno de los números del collage.
app.get("/deleteImg/:nombre", (req,res) => {
    const {nombre} = req.params;

    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        if(err){
            return res.end("Eliminacion de archivo fallida")
        }
        return res.send (`
        <h5>El archivo ${nombre} fue eliminado con exito</h5>
        <a href="/imagen">Volver a collage</a>
        `)
    })
 })
})


app.get("/imagen", (req,res) => {
     res.sendFile(__dirname + "/public/collage.html")
 })




app.listen(3000, () => console.log("servidor activo puerto 3000"))