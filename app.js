const qrReaderContainer = document.getElementById("qr-reader-container");
const qrReader = document.getElementById("qr-reader");
const qrResult = document.getElementById("qr-result");
const stopScanButton = document.getElementById("stop-scan");
const buttonsContainer = document.getElementById("buttons-container");

// Vérifier si le numéro de série est déjà enregistré
function checkSerialNumber() {
    const serialNumber = localStorage.getItem("serial_number");
    if (serialNumber) {
        console.log("Numéro de série trouvé :", serialNumber);
        displayButtons();
    } else {
        console.log("Aucun numéro de série trouvé. Lancement du scan...");
        startQrScanner();
    }
}

// Afficher les boutons principaux
function displayButtons() {
    buttonsContainer.style.display = "block";
    qrReaderContainer.style.display = "none";
}

// Démarrer le scanner QR code
function startQrScanner() {
    qrReaderContainer.style.display = "block";
    qrResult.textContent = ""; // Réinitialise les résultats

    const html5QrCode = new Html5Qrcode("qr-reader", { verbose: true });

    html5QrCode.start(
        { facingMode: "environment" }, // Caméra arrière
        {
            fps: 10, // Fréquence d’analyse (images par seconde)
            qrbox: { width: 300, height: 300 }, // Zone de détection
        },
        (decodedText) => {
            qrResult.textContent = `Contenu détecté : ${decodedText}`;
            console.log("QR Code détecté :", decodedText);

            try {
                const qrData = JSON.parse(decodedText);
                const serialNumber = qrData.serial_number;
                const serverAddress = qrData.server_address;

                if (serialNumber && serverAddress) {
                    // Enregistrer le numéro de série et l'adresse du serveur
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
                qrResult.textContent = "Erreur : Le contenu n’est pas un JSON valide.";
            }
        },
        (errorMessage) => {
            console.log("Erreur de détection :", errorMessage);
        }
    );

    // Arrêter le scanner
    stopScanButton.addEventListener("click", () => {
        html5QrCode.stop().then(() => {
            qrReaderContainer.style.display = "none";
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
