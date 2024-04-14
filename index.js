import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';

const app = express();
const DB_FILE = 'datos.json';

app.use(bodyParser.json());
app.use(cors());

// Helper function para leer los datos del archivo JSON
function readDataFromFile() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo JSON:', error);
        throw new Error('Error al leer el archivo JSON');
    }
}

// Endpoint para guardar nuevos datos en el archivo JSON
app.post('/guardarDatos', (req, res) => {
    const newData = req.body; // Datos enviados en la solicitud POST
    if (newData && typeof newData === 'object') {
        try {
            let data = readDataFromFile(); // Leer datos actuales del archivo
            data.push(newData);
            fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');

            console.log('Datos agregados correctamente en ' + DB_FILE);
            res.status(200).send('Datos guardados correctamente');
        } catch (error) {
            console.error('Error al escribir en el archivo JSON:', error);
            res.status(500).send('Error al guardar los datos');
        }
    } else {
        res.status(400).send('Datos no válidos');
    }
});

// Endpoint para obtener todos los datos del archivo JSON
app.get('/obtener', (req, res) => {
    try {
        const data = readDataFromFile(); // Leer datos actuales del archivo
        res.json(data);
    } catch (error) {
        res.status(500).send('Error al leer el archivo JSON');
    }
});

// Manejar la concurrencia usando un semáforo simple
let isWriting = false; // Variable de estado para bloquear escrituras concurrentes

// Endpoint para realizar una copia de seguridad de los datos en otro archivo
app.get('/backup', (req, res) => {
    if (isWriting) {
        return res.status(503).send('Servicio no disponible temporalmente');
    }

    try {
        isWriting = true;
        const data = readDataFromFile(); // Leer datos actuales del archivo
        const backupFileName = "datosRes.json";
        fs.writeFileSync(backupFileName, JSON.stringify(data, null, 2), 'utf-8');

        console.log('Copia de seguridad realizada correctamente en ' + backupFileName);
        res.status(200).send(`Copia de seguridad realizada correctamente en ${backupFileName}`);
    } catch (error) {
        console.error('Error al realizar la copia de seguridad:', error);
        res.status(500).send('Error al realizar la copia de seguridad');
    } finally {
        isWriting = false;
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
