const qrReaderContainer = document.getElementById("qr-reader-container");
const qrReader = document.getElementById("qr-reader");
const qrResult = document.getElementById("qr-result");
const stopScanButton = document.getElementById("stop-scan");
const buttonsContainer = document.getElementById("buttons-container");

// Fonction pour vérifier la présence d'un numéro de série
function checkSerialNumber() {
    const serialNumber = localStorage.getItem("serial_number");
    if (serialNumber) {
        console.log("Numéro de série trouvé :", serialNumber);
        displayButtons();
    } else {
        console.log("Aucun numéro de série trouvé. Lancement du scan...");
        startQrScanner(); // Lance le scan si le numéro de série est absent
    }
}

// Fonction pour afficher les boutons principaux
function displayButtons() {
    buttonsContainer.style.display = "block";
    qrReaderContainer.style.display = "none";
}

// Fonction pour démarrer le scanner QR code
function startQrScanner() {
    qrReaderContainer.style.display = "block";
    qrResult.textContent = ""; // Réinitialise les résultats précédents

    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Utilise la caméra arrière
        {
            fps: 10, // Fréquence d'analyse (images par seconde)
            qrbox: { width: 200, height: 200 }, // Zone de détection du QR code
        },
        (decodedText) => {
            console.log("QR Code détecté :", decodedText);
            qrResult.textContent = `Contenu détecté : ${decodedText}`;

            try {
                const qrData = JSON.parse(decodedText); // Parse le QR code en JSON
                const serialNumber = qrData.serial_number;
                const serverAddress = qrData.server_address;

                if (serialNumber && serverAddress) {
                    // Enregistre le numéro de série et l'adresse du serveur
                    localStorage.setItem("serial_number", serialNumber);
                    localStorage.setItem("server_address", serverAddress);

                    alert(`Numéro de série enregistré : ${serialNumber}`);
                    html5QrCode.stop().then(() => {
                        displayButtons();
                    });
                } else {
                    qrResult.textContent = "QR code invalide.";
                }
            } catch (error) {
                qrResult.textContent = "Erreur : Le contenu n'est pas un JSON valide.";
            }
        },
        (errorMessage) => {
            console.log("Erreur de détection :", errorMessage);
        }
    );

    // Permet d'arrêter le scanner
    stopScanButton.addEventListener("click", () => {
        html5QrCode.stop().then(() => {
            qrReaderContainer.style.display = "none"; // Cache le conteneur du scanner
        }).catch(err => console.error("Erreur lors de l'arrêt du scanner :", err));
    });
}

// Ajouter des actions aux boutons
document.getElementById("settings-btn").addEventListener("click", startQrScanner);

document.getElementById("take-photo").addEventListener("click", () => {
    alert("Fonction 'Prendre une photo' à implémenter.");
});

document.getElementById("select-photo").addEventListener("click", () => {
    alert("Fonction 'Sélectionner des photos' à implémenter.");
});

document.getElementById("send-files").addEventListener("click", () => {
    const serverAddress = localStorage.getItem("server_address");
    alert(`Les fichiers seront transmis à : ${serverAddress}`);
});

// Lancer la vérification au chargement
window.addEventListener("load", checkSerialNumber);
