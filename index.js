import Express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from "cors"

const app = Express();
const DB_FILE = "datos.json";

app.use(bodyParser.json());
app.use(cors())

app.post('/guardarDatos', (req, res) => {
    const newData = req.body; // Datos enviados en la solicitud POST
    if (newData && typeof newData === 'object') {
        try {
            // Leer el archivo JSON existente
            const data = fs.readFileSync(DB_FILE, "utf-8");
            const jsonData = JSON.parse(data);

            // Agregar los nuevos datos al arreglo existente
            jsonData.push(newData);

            // Escribir los datos actualizados de vuelta al archivo JSON
            fs.writeFileSync(DB_FILE, JSON.stringify(jsonData, null, 2), "utf-8");

            console.log("Datos agregados correctamente en " + DB_FILE);
            res.status(200).send('Datos guardados correctamente');
        } catch (error) {
            console.error('Error al escribir en el archivo JSON:', error);
            res.status(500).send('Error al guardar los datos');
        }
    } else {
        res.status(400).send('Datos no válidos');
    }
});

app.get("/obtener", (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) {
        console.error('Error al leer el archivo JSON:', error);
        res.status(500).send('Error al leer el archivo JSON');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
