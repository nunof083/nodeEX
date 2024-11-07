const fs = require('fs');
const path = require('path');
const express = require('express');

const port = 3000;
const app = express();
app.use(express.static('public'));
app.use(express.json());



async function getFiles(directoryPath) {
    const files = await fs.promises.readdir(directoryPath);
    const filesOnJson = [];

    for (const file of files) {
        const absolutePathFile = path.join(directoryPath, file);
        const stat = await fs.promises.stat(absolutePathFile);

        filesOnJson.push({
            name: file,
            size: stat.size,
            type: stat.isDirectory() ? "directory" : "file"
        });
    }
    return filesOnJson;
}

// Endpoint pour récupérer les fichiers d'un répertoire donné
app.get("/api/data", async (req, res) => {
    const directoryPath = req.query.path || "..";
    try {
        const filesOnJson = await getFiles(directoryPath);
        res.json({
            currentPath: directoryPath,
            files: filesOnJson
        });
    } catch(e) {
        res.status(404).send("Une erreur s'est produite");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});
