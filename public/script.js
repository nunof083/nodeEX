async function fetchAndDisplay(directoryPath = "") {
    const response = await fetch(`/api/data?path=${encodeURIComponent(directoryPath)}`);
    const data = await response.json();
    const files = data.files;  // Liste des fichiers/dossiers
    const currentPath = data.currentPath;  // Chemin du répertoire actuel
    const templateHtml = document.querySelector(".template-files").innerHTML;

    let finalHtml = `<h2>${currentPath || "Root Directory"}</h2>`;  // Affiche le répertoire actuel en haut

    for (const file of files) {
        const isDirectory = file.type === "directory";
        const itemLink = isDirectory
            ? `<a href="#" onclick="fetchAndDisplay('${currentPath}/${file.name}')">${file.name}</a>`
            : file.name;  // Affiche le nom du fichier ou dossier uniquement

        let itemHtml = templateHtml
            .replace('%FOLDER%', itemLink)
            .replace('%SIZE%', `${file.size} octets`);

        finalHtml += itemHtml;
    }

    document.querySelector('#fileList').innerHTML = finalHtml;
}

// Fonction pour revenir au dossier parent
function goBack() {
    if (currentDirectory) {
        const parentPath = currentDirectory.substring(0, currentDirectory.lastIndexOf("/"));
        fetchAndDisplay(parentPath);
    }
}

// Chargement initial de la racine
fetchAndDisplay();
