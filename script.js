
let selectedDossier = '';
let selectedFileType = '';
const pdfCache = new Map();







function selectDossier(dossier) {
    // const user = JSON.parse(localStorage.getItem('current_user'));
    
    // if (!user) {
    //     alert("🔒 Veuillez vous connecter pour accéder aux dossiers.");
    //     return;
    // }
    
    // if (!user.user.validated) {
    //     alert("⚠️ Votre compte n'est pas encore validé.");
    //     return;
    // }
    
    selectedDossier = dossier;
    
    if (dossier === 'energinova') {
        document.getElementById('selected-dossier-text').textContent = 'ENERGINOVA - Dossier énergie & innovation';
        document.getElementById('form-subtitle').textContent = 'Choisissez le document à ajouter à votre dossier ENERGINOVA';
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        document.getElementById('step2').classList.add('fade-in');
        
        document.getElementById('backBtn').classList.remove('hidden');
        document.getElementById('submit-text').textContent = 'Ajouter le fichier';
        document.getElementById('help-text').textContent = 'Sélectionnez le type de fichier que vous souhaitez ajouter à votre dossier. Vous pourrez ensuite télécharger le document correspondant.';
        
        document.getElementById('submitBtn').disabled = true;
        
    } else if (dossier === 'myhouse') {
        document.getElementById('selected-dossier-text').textContent = 'MYHOUSE - Dossier logement & propriété';
        document.getElementById('form-subtitle').textContent = 'Choisissez le document à ajouter à votre dossier MYHOUSE';
        
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        document.getElementById('step2').classList.add('fade-in');
        
        document.getElementById('backBtn').classList.remove('hidden');
        document.getElementById('submit-text').textContent = 'Ajouter le fichier';
        document.getElementById('help-text').textContent = 'Sélectionnez le type de fichier que vous souhaitez ajouter à votre dossier. Vous pourrez ensuite télécharger le document correspondant.';
        
        document.getElementById('submitBtn').disabled = true;
        
        updateFileOptionsForMyHouse();
    }
}

function updateFileOptionsForMyHouse() {
    const fileGrid = document.querySelector('.grid.grid-cols-1');
    if (fileGrid) {
        fileGrid.innerHTML = `
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="devis">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-invoice-dollar text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Devis</h4>
                    <p class="text-gray-500 text-sm">Estimation des coûts MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="facture">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-invoice text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Facture</h4>
                    <p class="text-gray-500 text-sm">Document comptable MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="attestation_realisation">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-certificate text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Attestation de réalisation</h4>
                    <p class="text-gray-500 text-sm">Document attestant des travaux MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="attestation_signataire">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-signature text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Attestation signataire</h4>
                    <p class="text-gray-500 text-sm">Document avec signature MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="cdc">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-clipboard-list text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Cahier des charges</h4>
                    <p class="text-gray-500 text-sm">Spécifications techniques MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="rapport">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-alt text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Rapport</h4>
                    <p class="text-gray-500 text-sm">Document d'analyse MYHOUSE</p>
                </div>
            </div>
        `;
        
        document.querySelectorAll('.file-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.file-option').forEach(opt => {
                    opt.classList.remove('border-green-500', 'bg-green-50');
                    opt.classList.add('border-gray-200');
                });
                
                this.classList.remove('border-gray-200');
                this.classList.add('border-green-500', 'bg-green-50');
                
                selectedFileType = this.getAttribute('data-value');
                document.getElementById('selected_file_type').value = selectedFileType;
                
                const fileName = this.querySelector('h4').textContent;
                document.getElementById('selected-file-name').textContent = fileName;
                document.getElementById('selected-file-indicator').classList.remove('hidden');
                
                if (selectedDossier === 'myhouse') {
                    loadMyhouseForm(selectedFileType);
                } else {
                    loadFormFor(selectedFileType);
                }
                
                document.getElementById('submitBtn').disabled = false;
            });
        });
    }
}







function goBackToStep1() {
    selectedDossier = '';
    selectedFileType = '';
    
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('step1').classList.add('fade-in');
    
    document.getElementById('form-title').textContent = 'Sélectionnez le type de dossier';
    document.getElementById('form-subtitle').textContent = 'Choisissez parmi les options disponibles pour démarrer la constitution de votre dossier';
    
    document.getElementById('backBtn').classList.add('hidden');
    document.getElementById('submit-text').textContent = 'Continuer';
    document.getElementById('help-text').textContent = 'Sélectionnez d\'abord le type de dossier pour continuer';
    
    document.getElementById('dossier_type').value = '';
    document.getElementById('selected_file_type').value = '';
    document.getElementById('selected-file-indicator').classList.add('hidden');
    document.getElementById('submitBtn').disabled = true;
    
    document.querySelectorAll('.file-option').forEach(option => {
        option.classList.remove('border-blue-500', 'bg-blue-50');
        option.classList.add('border-gray-200');
    });
    
    document.getElementById("dynamic-form").classList.add("hidden");
}




// Fonction pour ajuster la position X selon le nombre de chiffres
function adjustXForAmount(value, baseX) {
    // Vérifier si c'est un nombre
    const num = parseFloat(value.toString().replace(/[^\d,.-]/g, '').replace(',', '.'));
    
    if (isNaN(num)) return { x: baseX, digits: 0 };
    
    // Obtenir la partie entière
    const integerPart = Math.floor(Math.abs(num));
    const digitCount = integerPart.toString().length;
    
    let adjustedX = baseX;
    
    // Logique d'ajustement
    if (digitCount === 5) {
        adjustedX = 526; // Pour 5 chiffres (ex: 12345)
    } else if (digitCount === 4) {
        adjustedX = 528; // Pour 4 chiffres (ex: 1234)
    } else if (digitCount === 3) {
        adjustedX = 530; // Pour 3 chiffres (ex: 123)
    } else if (digitCount === 2) {
        adjustedX = 532; // Pour 2 chiffres (ex: 12)
    } else if (digitCount === 1) {
        adjustedX = 534; // Pour 1 chiffre (ex: 1)
    }
    
    return { x: adjustedX, digits: digitCount };
}



const fileForms = {
    attestation_signataire: [
        { name: "residence_nom", label: "Nom de la résidence / bâtiment", required: true },
        { name: "adresse_batiment", label: "Adresse du bâtiment", required: true },
        { name: "numero_immatriculation", label: "Numéro d'immatriculation", required: true },
        { name: "date_fait", label: "Date du document", type: "date", required: true },
    ],

    attestation_realisation: [
        { name: "date_signature", label: "Date de signature", type: "date", required: true, example: "07/10/2025" },
        { name: "nombre_logements", label: "Nombre de logements", required: true, example: "139" },
        { name: "adresse_travaux", label: "Adresse des travaux", readonly: true },
        { name: "puissance_chaudiere", label: "Puissance nominale de la chaudière", readonly: true },
        { name: "nombre_emetteurs", label: "Nombre d'émetteurs désemboués", readonly: true },
        { name: "volume_circuit", label: "Volume total du circuit d'eau", readonly: true },
        { name: "nombre_batiments", label: "Nombre de bâtiments", readonly: true },
        { name: "details_batiments", label: "Détails des bâtiments", readonly: true },
        { name: "reference_devis", label: "Numéro de devis", readonly: true },
        { name: "dates_previsionnelles", label: "Dates prévisionnelles des travaux", readonly: true},
        { name: "date_devis", label: "Date du devis", readonly: true}
    ],

    devis: [
        { name: "reference_devis", label: "Référence devis", required: true, example: "389" },
        { name: "date_devis", label: "Date du devis", type: "date", required: true, example: "07/10/2025" },
        { name: "adresse_travaux", label: "Adresse des travaux", required: true },
        { name: "numero_immatriculation", label: "Numéro immatriculation", required: true },
        { name: "nom_residence", label: "Nom de la résidence", required: true },
        { name: "parcelle_1", label: "Parcelle cadastrale 1", required: true, example: " Parcelle 0290 Feuille 000 0T 001" },
        { name: "parcelle_2", label: "Parcelle cadastrale 2"},
        { name: "parcelle_3", label: "Parcelle cadastrale 3"},
        { name: "parcelle_4", label: "Parcelle cadastrale 4"},
        { name: "dates_previsionnelles", label: "Dates prévisionnelles des travaux", example: "07/10/2025 au 08/10/2025" },
        { name: "nombre_batiments", label: "Nombre de bâtiments", required: true },
        { name: "details_batiments", label: "Détails des bâtiments", required: true, example: "Bat A (47 Logs), Bat B (46 Logs), Bat C (46 Logs)" },
        { name: "montant_ht", label: "Montant HT (€)", required: true, example: "12 259,80 €" },
        { name: "montant_tva", label: "Montant TVA (€)", required: true, example: "2 451,96 €" },
        { name: "montant_ttc", label: "Montant TTC (€)", required: true, example: "14 711,76 €" },
        { name: "prime_cee", label: "Prime CEE (€)", required: true, example: "12 259,80 €" },
        { name: "reste_a_charge", label: "Reste à charge (€)", required: true, example: "2 451,96 €" },
        { name: "puissance_chaudiere", label: "Puissance nominale de la chaudière", required: true, example: "670 kW" },
        { name: "nombre_logements", label: "Nombre de logements concernés", required: true, example: "139" },
        { name: "nombre_emetteurs", label: "Nombre d'émetteurs désemboués", required: true, example: "487" },
        { name: "zone_climatique", label: "Zone climatique", required: true, example: "H1, H2 ou H3" },
        { name: "volume_circuit", label: "Volume total du circuit d'eau", required: true, example: "5 396 L" },
        { name: "nombre_filtres", label: "Nombre de filtres", required: true, example: "14" },
        { name: "wh_cumac", label: "WH CUMAC", required: true, example: "1 751 400" },
        { name: "somme", label: "somme", required: true, example: "751 400" }
    ],
    
    facture: [
        { name: "date_facture", label: "Date de la facture", type: "date", required: true, example: "10/10/2025" },
    ],
    
    cdc: [
            { name: "prime_cee", label: "Prime CEE pour CDC", readonly: true },
            { name: "date_devis", label: "Date du devis", readonly: true },
            
        ],




          rapport: [
        // Adresses (saisie manuelle)
        { name: "adresse_travaux_1", label: "Adresse des travaux (1)", required: true },
        { name: "boite_postale_1", label: "Boîte postale + Zone (1)", required: true },
        { name: "adresse_travaux_2", label: "Adresse des travaux (2) - Facultatif", required: false },

        
        // Champs provenant de la FACTURE (readonly)
        { name: "date_facture", label: "Date facture", readonly: true },
      
        // Champs provenant du DEVIS (readonly)
        { name: "reference_devis", label: "Numéro de devis", readonly: true },
        { name: "puissance_chaudiere", label: "Puissance chaudière", readonly: true },
        { name: "nombre_emetteurs", label: "Nombre d'émetteurs", readonly: true },
        { name: "volume_circuit", label: "Volume circuit", readonly: true }
    ],
    
};


function loadFormFor(type) {
    const container = document.getElementById("dynamic-fields");
    container.innerHTML = "";
    document.getElementById("dynamic-form").classList.remove("hidden");

    // Liste de TOUS les types qui dépendent du devis
    const typesDependants = ["facture", "attestation_realisation", "cdc", "rapport"];
    
    // Récupérer les données du devis ET de la facture
    let lastDevisData = null;
    let lastFactureData = null;
    
    if (typesDependants.includes(type)) {
        lastDevisData = JSON.parse(localStorage.getItem("lastDevisData") || "null");
        lastFactureData = JSON.parse(localStorage.getItem("lastFactureData") || "null");
        
        // Vérifier si un devis existe (obligatoire)
        if (!lastDevisData) {
            container.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">Devis requis !</h4>
                            <p class="text-red-600 mb-3">Vous devez d'abord générer un devis pour créer un ${type}.</p>
                            <div class="flex gap-3">
                                <button onclick="createDevisFirst()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-2"></i>Créer un devis d'abord
                                </button>
                                <button onclick="goBackToStep1()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                    <i class="fas fa-arrow-left mr-2"></i>Retour au choix
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('submitBtn').disabled = true;
            return;
        }
        
        // Pour le rapport, vérifier si une facture existe (recommandé mais pas obligatoire)
        if (type === 'rapport' && !lastFactureData) {
            container.innerHTML += `
                <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-yellow-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-yellow-700 mb-2">Facture recommandée</h4>
                            <p class="text-yellow-600">Aucune facture trouvée. Le rapport sera généré sans date de facture.</p>
                            <p class="text-yellow-600 text-sm mt-2">Conseil : Créez d'abord une facture pour avoir une date complète.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Créer les champs du formulaire
    if (fileForms[type]) {
        fileForms[type].forEach(field => {
            const placeholder = field.example || "";
            let defaultValue = "";
            
            // 1. D'abord chercher dans le formulaire actuel (si reload)
            // (c'est géré automatiquement par le navigateur)
            
            // 2. Chercher dans les données de facture (pour le rapport)
            if (type === 'rapport' && field.name === "date_facture" && lastFactureData && lastFactureData[field.name]) {
                defaultValue = lastFactureData[field.name];
            }
            // 3. Chercher dans les données du devis
            else if (lastDevisData && lastDevisData[field.name]) {
                defaultValue = lastDevisData[field.name];
            }
            
            // Si le champ est readonly, forcer la valeur
            if (field.readonly && defaultValue) {
                // Ne rien changer, defaultValue est déjà défini
            }
            
            container.innerHTML += `
                <label class="block mb-4">
                    <span class="text-gray-700 font-medium">
                        ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                        ${field.readonly ? '<span class="text-blue-500 text-xs ml-2">(auto)</span>' : ''}
                    </span>
                    <input
                        type="${field.type || 'text'}"
                        name="${field.name}"
                        value="${defaultValue}"
                        placeholder="${placeholder}"
                        class="w-full mt-1 px-4 py-3 border-2 ${field.readonly ? 'bg-gray-100 border-gray-300' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        ${field.required ? 'required' : ''}
                        ${field.readonly ? 'readonly' : ''}
                    >
                    ${field.example ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                    ${field.readonly && defaultValue ? `
                        <p class="text-xs text-green-600 mt-1">
                            <i class="fas fa-check-circle mr-1"></i>
                            ${field.name === 'date_facture' ? 'Rempli depuis la facture' : 'Rempli depuis le devis'}
                        </p>
                    ` : ''}
                </label>
            `;
        });

        // Ajouter un panneau d'information amélioré
        if (typesDependants.includes(type) && lastDevisData) {
            let infoHTML = `
                <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-info-circle text-blue-600 text-xl mt-1"></i>
                        <div class="flex-1">
                            <h4 class="font-bold text-blue-700 mb-2">Données importées</h4>
                            <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div><span class="font-medium">Devis n°:</span> ${lastDevisData.reference_devis || 'Non spécifié'}</div>
                                <div><span class="font-medium">Date devis:</span> ${formatDateFR(lastDevisData.date_devis) || 'Non spécifiée'}</div>
                                <div><span class="font-medium">Adresse:</span> ${(lastDevisData.adresse_travaux || '').substring(0, 30)}...</div>
            `;
            
            // Ajouter info facture si disponible
            if (lastFactureData) {
                infoHTML += `
                    <div class="col-span-2 mt-2 p-2 bg-green-50 rounded-lg">
                        <div class="font-medium text-green-700">Facture disponible</div>
                        <div class="text-green-600 text-xs">
                            Date: ${formatDateFR(lastFactureData.date_facture) || 'Non spécifiée'}
                        </div>
                    </div>
                `;
            } else if (type === 'rapport') {
                infoHTML += `
                    <div class="col-span-2 mt-2 p-2 bg-yellow-50 rounded-lg">
                        <div class="font-medium text-yellow-700">⚠️ Aucune facture</div>
                        <div class="text-yellow-600 text-xs">
                            La date de facture sera vide. Créez une facture d'abord.
                        </div>
                    </div>
                `;
            }
            
            infoHTML += `
                            </div>
                            <button type="button" onclick="reimportAllData('${type}')" 
                                class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                <i class="fas fa-sync-alt"></i>
                                Actualiser toutes les données
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML += infoHTML;
        }

        container.innerHTML += `
            <div class="pt-4 border-t border-gray-200">
                <button type="button"
                    onclick="generateFromDynamicForm('${type}')"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                    <i class="fas fa-file-pdf mr-2"></i>
                    Générer le PDF avec Calibri
                </button>
                <p class="text-xs text-gray-500 text-center mt-2">
                    Cliquez pour générer et télécharger le document
                </p>
            </div>
        `;

        document.getElementById('submitBtn').disabled = false;
    }
}


const pdfCoordinates = {
    devis: {
           page1: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 12, color: 'white', bold: true },
            adresse_travaux: { x: 105, y: 505, size: 8, color: 'black' },
            numero_immatriculation: { x: 205, y: 495.5, size: 8, color: 'black' },
            nom_residence: { x: 266, y: 495.5, size: 8, color: 'black' },
            zone_climatique: { x: 107, y: 485.5, size: 8, color: 'black' },
            parcelle_1: { x: 54, y: 462, size: 8, color: 'black' },
            parcelle_2: { x: 190, y: 462, size: 8, color: 'black' },
            parcelle_3: { x: 54, y: 449, size: 8, color: 'black' },
            parcelle_4: { x: 190, y: 449, size: 8, color: 'black' },
            dates_previsionnelles: { x: 174, y: 428, size: 7, color: 'black' },
            nombre_batiments: { x: 124, y: 400, size: 8, color: 'black' },
            details_batiments: { x: 72, y: 391, size: 8, color: 'black' },
            prime_cee: { x: 410, y: 348, size: 7, color: 'black' },
            prime_cee_dup: { x: 468, y: 348, size: 7, color: 'black' }
        },
        page2: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 12, color: 'white', bold: true },
            puissance_chaudiere: { x: 198, y: 632, size: 8, color: 'black' },
            zone_climatique: { x: 135, y: 579.5, size: 8, color: 'black' },
            nombre_logements: { x: 189, y: 622, size: 8, color: 'black' },
            nombre_emetteurs: { x: 195, y: 611, size: 8, color: 'black' },
            volume_circuit: { x: 179, y: 590, size: 8, color: 'black' },
            nombre_filtres: { x: 102, y: 569, size: 8, color: 'black' },
            wh_cumac: { x: 127, y: 548, size: 8, color: 'black' },
            montant_ht: { x: 120, y: 537.5, size: 8, color: 'black' }
        },
        page3: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 12, color: 'white', bold: true }
        },
        page4: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 12, color: 'white', bold: true },
            prime_cee_dup: { x: 528, y: 383, size: 8, color: 'darkblue', bold: true },
            montant_tva: { x: 526, y: 371, size: 8, color: 'darkblue', bold: true },
            montant_ttc: { x: 526, y: 361, size: 8, color: 'darkblue', bold: true },
            prime_cee: { x: 528, y: 350, size: 8, color: 'black', bold: false },
            reste_a_charge: { x: 526, y: 315, size: 8, color: 'darkblue', bold: true },
            // prime_cee_dup: { x: 78.5, y: 277.5, size: 7, color: 'black', bold: false },
            // montant_ht_dup: { x: 77, y: 277, size: 7, color: 'black' },
            somme: { x: 78, y: 277.5, size: 7, color: 'black' },

        },
        page5: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 10.5, color: 'white', bold: true }
        }
    },
    
    facture: {
         page1: {
            reference_devis: { x: 214, y: 733.2, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 12, color: 'white', bold: true }, // Remplace date_devis
            adresse_travaux: { x: 105, y: 505, size: 8, color: 'black' },
            numero_immatriculation: { x: 205, y: 495.5, size: 8, color: 'black' },
            nom_residence: { x: 268, y: 495.5, size: 8, color: 'black' },
            zone_climatique: { x: 107, y: 485.5, size: 8, color: 'black' },
            parcelle_1: { x: 54, y: 462, size: 8, color: 'black' },
            parcelle_2: { x: 190, y: 462, size: 8, color: 'black' },
            parcelle_3: { x: 54, y: 449, size: 8, color: 'black' },
            parcelle_4: { x: 190, y: 449, size: 8, color: 'black' },
            dates_previsionnelles: { x: 174, y: 428, size: 7, color: 'black' },
            nombre_batiments: { x: 124, y: 400, size: 8, color: 'black' },
            details_batiments: { x: 72, y: 391, size: 8, color: 'black' },
            prime_cee: { x: 410, y: 348, size: 7, color: 'black' },
            prime_cee_dup: { x: 468, y: 348, size: 7, color: 'black' }
        },
        page2: {
            reference_devis: { x: 214, y: 733, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 12, color: 'white', bold: true }, // Remplace date_devis
            puissance_chaudiere: { x: 198, y: 632, size: 8, color: 'black' },
            zone_climatique: { x: 135, y: 579.5, size: 8, color: 'black' },
            nombre_logements: { x: 189, y: 622, size: 8, color: 'black' },
            nombre_emetteurs: { x: 195, y: 611, size: 8, color: 'black' },
            volume_circuit: { x: 179, y: 590, size: 8, color: 'black' },
            nombre_filtres: { x: 102, y: 569, size: 8, color: 'black' },
            wh_cumac: { x: 127, y: 548, size: 8, color: 'black' },
            montant_ht: { x: 120, y: 538, size: 8, color: 'black' }
        },
        page3: {
            reference_devis: { x: 214, y: 733, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 12, color: 'white', bold: true } // Remplace date_devis
        },
        page4: {
            reference_devis: { x: 214, y: 733, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 12, color: 'white', bold: true }, // Remplace date_devis
           somme: { x: 526, y: 383, size: 8, color: 'darkblue', bold: true },
            montant_tva: { x: 522, y: 371, size: 8, color: 'darkblue', bold: true },
            montant_ttc: { x: 522, y: 361, size: 8, color: 'darkblue', bold: true },
            prime_cee: { x: 522, y: 350, size: 8, color: 'darkblue', bold: true },
            reste_a_charge: { x: 522, y: 315, size: 8, color: 'darkblue', bold: true },
            montant_ht_dup: { x: 77, y: 277, size: 7, color: 'black' },
            prime_cee_dup: { x: 78.5, y: 277.5, size: 7, color: 'black', bold: false },
        }
    },
    
    attestation_signataire: {
        page1: {
            residence_nom: { x: 85, y: 503, size: 11, color: 'black', bold: false },
            adresse_batiment: { x: 100, y: 490, size: 11, color: 'black', bold: false },
            numero_immatriculation: { x: 253, y: 477, size: 11, color: 'black', bold: false },
            date_fait: { x: 155, y: 385, size: 10, color: 'black', bold: false }
        }
    },
    
    attestation_realisation: {
        page1: {
            nombre_logements: { x: 186, y: 419, size: 8, color: 'black', bold: false },
            adresse_travaux: { x: 186, y: 447, size: 8, color: 'black', bold: false },
            puissance_chaudiere: { x: 186, y: 395, size: 8, color: 'black', bold: false },
            nombre_emetteurs: { x: 186, y: 385, size: 8, color: 'black', bold: false },
            volume_circuit: { x: 186, y: 364, size: 8, color: 'black', bold: false },
            nombre_batiments: { x: 189, y: 314, size: 8, color: 'black', bold: false },
            details_batiments: { x: 186, y: 300, size: 8, color: 'black', bold: false },
            dates_previsionnelles: { x: 197, y: 341.5, size: 8, color: 'black', bold: false }
        },
        page2: {
            reference_devis: { x: 224, y: 469, size: 8, color: 'black', bold: true },
            date_signature: { x: 389, y: 399, size: 8, color: 'black', bold: false },
            date_devis: { x: 248, y: 469, size: 8, color: 'black', bold: true }
        }
    },
    cdc: {
    page1: {
        prime_cee:  { x: 194, y: 675, size: 8, color: 'light_blue', bold: true },
        // prime_cee_dup: { x: 180, y: 538, size: 7, color: 'black' }, // Position différente
        date_devis: { x: 328, y: 372, size: 9, color: 'red' },
        date_devis_dup: { x: 149, y: 196, size: 8, color: 'black' },
    }
    // Ajoutez d'autres pages si nécessaire
},
 rapport: {
        page1: {
            adresse_travaux_1: { x: 9, y: 740, size: 7, color: 'black'},
            boite_postale_1: { x: 9, y: 710, size: 7, color: 'black' },
            adresse_travaux_2: {  x: 9, y: 725, size: 7, color: 'black' },
            boite_postale_2: { x: 100, y: 455, size: 10, color: 'black' },
            puissance_chaudiere: { x: 245, y: 401, size: 9, color: 'black' },
            nombre_emetteurs: { x: 375, y: 510, size: 9, color: 'black' },
            volume_circuit: {x: 367, y: 402, size: 9, color: 'black'  },
            date_facture: { x: 412, y: 728, size: 8, color: 'black' },
            // numero_facture: { x: 412, y: 728, size: 8, color: 'black'},
            reference_devis: { x: 463, y: 707.5, size: 8, color: 'black' }

        }
    }

  
    
};








async function generateFromDynamicForm(type) {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        // Liste de TOUS les types qui dépendent du devis
        const typesDependants = ["facture", "attestation_realisation", "cdc", "rapport"];
        
        // Sauvegarder les données selon le type
        if (type === 'devis') {
            localStorage.setItem("lastDevisData", JSON.stringify(formData));
            console.log("✅ Devis sauvegardé:", formData);
        } 
        else if (type === 'facture') {
            localStorage.setItem("lastFactureData", JSON.stringify(formData));
            console.log("✅ Facture sauvegardée:", formData);
        }
        
        // Pour TOUS les types dépendants, fusionner avec les données du devis
        if (typesDependants.includes(type)) {
            const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData") || "null");
            const lastFactureData = JSON.parse(localStorage.getItem("lastFactureData") || "null");
            
            if (!lastDevisData) {
                alert(`❌ Impossible de générer le ${type} : aucun devis trouvé !`);
                return;
            }
            
            // Fusionner les données : priorité AU FORMULAIRE, puis à la facture, puis au devis
            let mergedData = { ...lastDevisData };
            
            // Ajouter les données de la facture si elles existent
            if (lastFactureData) {
                mergedData = { ...mergedData, ...lastFactureData };
            }
            
            // Ajouter les données du formulaire (priorité maximale)
            mergedData = { ...mergedData, ...formData };
            
            // Gestion spécifique par type
            switch(type) {
                case 'facture':
                    // Pour la facture, garder date_facture du formulaire
                    if (formData.date_facture) {
                        mergedData.date_facture = formData.date_facture;
                    }
                    break;
                    
                case 'attestation_realisation':
                    // Pour l'attestation, garder date_signature du formulaire
                    if (formData.date_signature) {
                        mergedData.date_signature = formData.date_signature;
                    }
                    break;
                    
                case 'cdc':
                case 'rapport':
                    // Pour rapport, récupérer aussi la date de facture si elle existe
                    if (lastFactureData && lastFactureData.date_facture) {
                        mergedData.date_facture = lastFactureData.date_facture;
                    }
                    break;
            }
            
            await generatePdfWithPdfLib(mergedData, type);
            return;
        }
        
        // Pour le devis seul (sans fusion)
        await generatePdfWithPdfLib(formData, type);
        
    } catch (error) {
        console.error("❌ Erreur:", error);
        alert(`❌ Erreur lors de la génération du ${type}.`);
    }
}





async function generatePdfWithPdfLib(formData, type = null) {
    const selectedType = type || document.getElementById('selected_file_type').value;
    if (!selectedType) {
        alert("Veuillez sélectionner un type de fichier.");
        return;
    }

    console.log(`=== GÉNÉRATION ${selectedType.toUpperCase()} AVEC CALIBRI ===`);

    // Vérifier si PDFLib est disponible
    if (typeof PDFLib === 'undefined') {
        alert("❌ Erreur: PDFLib n'est pas chargé. Vérifiez votre connexion internet ou les scripts.");
        console.error("PDFLib non défini");
        return;
    }

    // Chemins vers les fichiers Calibri LOCAUX
    const calibriUrls = {
        regular: "./fonts/calibri-regular.ttf",
        bold: "./fonts/calibri-bold.ttf"
    };
    
    const pdfMap = {
        devis: "PDFS/devis.pdf",
        facture: "PDFS/facture.pdf",
        attestation_signataire: "PDFS/attestation_signataire.pdf",
        attestation_realisation: "PDFS/attestation_realisation.pdf",
        cdc: "PDFS/cdc.pdf",
        rapport: "PDFS/rapport.pdf"
    };

    try {
        // Afficher un indicateur de chargement
        document.getElementById('submitBtn').disabled = true;
        document.querySelector('#submit-text').textContent = "Génération en cours...";

        // 1. Charger le template PDF
        const existingPdf = await fetch(pdfMap[selectedType]).then(res => res.arrayBuffer());
        
        // 2. Créer le document PDF avec PDFLib
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdf);
        const { rgb } = PDFLib;
        
        // 3. Enregistrer fontkit si disponible
        if (typeof fontkit !== 'undefined') {
            pdfDoc.registerFontkit(fontkit);
            console.log("✅ Fontkit enregistré");
        } else {
            console.warn("⚠️ Fontkit non disponible");
        }
        
        const pages = pdfDoc.getPages();

        // 4. Charger les polices Calibri
        console.log("🔄 Chargement des polices Calibri...");
        let calibriRegular, calibriBold;
        
        try {
            // Essayer de charger Calibri Regular
            const regularResponse = await fetch(calibriUrls.regular);
            if (!regularResponse.ok) throw new Error(`Calibri Regular non trouvé (${regularResponse.status})`);
            const regularBytes = await regularResponse.arrayBuffer();
            calibriRegular = await pdfDoc.embedFont(regularBytes);
            
            // Essayer de charger Calibri Bold
            const boldResponse = await fetch(calibriUrls.bold);
            if (!boldResponse.ok) throw new Error(`Calibri Bold non trouvé (${boldResponse.status})`);
            const boldBytes = await boldResponse.arrayBuffer();
            calibriBold = await pdfDoc.embedFont(boldBytes);
            
            console.log("✅ Calibri chargée avec succès !");
            
        } catch (fontError) {
            console.warn("❌ Échec chargement Calibri:", fontError.message);
            console.log("↪️ Utilisation des polices standards comme fallback");
            
            // Fallback sur les polices standards de PDF-Lib
            try {
                calibriRegular = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
                calibriBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
            } catch (fallbackError) {
                console.error("❌ Impossible de charger les polices de fallback:", fallbackError);
                throw new Error("Impossible de charger les polices");
            }
        }

        // 5. Récupérer les coordonnées
        const coords = pdfCoordinates[selectedType];
        if (!coords) {
            alert(`❌ Pas de coordonnées définies pour ${selectedType}`);
            return;
        }

        // 6. Écrire les données sur chaque page
        pages.forEach((page, index) => {
        const pageKey = `page${index + 1}`;
        
        if (coords[pageKey]) {
        Object.entries(coords[pageKey]).forEach(([fieldName, coord]) => {
            let value = formData[fieldName] || "";

            // Ajuster la position X pour les montants (droite alignée)
                 let adjustedX = coord.x;
            
            // Appliquer l'ajustement pour les montants de la page 4 du devis et de la facture
            if ((selectedType === 'devis' || selectedType === 'facture') && pageKey === 'page4') {
                const amountFields = ['montant_ht', 'montant_tva', 'montant_ttc', 'prime_cee', 'reste_a_charge'];
                
                if (amountFields.includes(fieldName) && value) {
                    // Récupérer à la fois la position X et le nombre de chiffres
                    const adjustmentResult = adjustXForAmount(value, coord.x);
                    adjustedX = adjustmentResult.x;
                    const digitCount = adjustmentResult.digits;
                    
                    console.log(`Ajustement ${fieldName}: ${value} → ${digitCount} chiffres → x=${adjustedX}`);
                }
            }
                    
                    // LOGIQUE DE DUPLICATION POUR CDC
                    if (selectedType === 'cdc') {
                        if (fieldName.endsWith('_dup') && !value) {
                            const baseField = fieldName.replace('_dup', '');
                            if (formData[baseField]) {
                                value = formData[baseField];
                            }
                        }
                        
                        if (fieldName === 'date_devis_dup' && !value && formData['date_devis']) {
                            value = formData['date_devis'];
                        }
                    }
                    
                    
                    if (fieldName === "prime_cee_dup" && !value && formData["prime_cee"]) {
                        value = formData["prime_cee"];
                    }
                    
                    // Formater les dates
                    if (fieldName.includes("date") || fieldName.includes("signature") || fieldName.includes("fait")) {
                        value = formatDateFR(value);
                    }
                    
                    if (value && value.trim() !== "") {
                       
                        const font = coord.bold ? calibriBold : calibriRegular;
                        
                        // Choisir la couleur
                        let color;

                    switch (coord.color) {
                            case 'white':
                                color = rgb(1, 1, 1); // blanc
                                break;
                            case 'darkblue':
                            case 'dark_blue':
                               
                                color = rgb(0/255.0, 51/255.0, 102/255.0);
                                
                               
                                break;
                            case 'lightblue':
                            case 'light_blue':
                                color = rgb(135/255.0, 206/255.0, 235/255.0);
                                break;
                            case 'blue':
                                color = rgb(0, 0, 1);
                                break;
                            case 'red':
                                color = rgb(1, 0, 0);
                                break;
                            case 'green':
                                color = rgb(0, 0.5, 0);
                                break;
                            case 'black':
                            default:
                                color = rgb(0, 0, 0);
                        }

                        // Utiliser adjustedX au lieu de coord.x
                page.drawText(value, {
                    x: adjustedX,  // <-- CHANGÉ ICI
                    y: coord.y,
                    size: coord.size || 10,
                    font: font,
                    color: color,
                    opacity: 1
                });
                    }
                });
            }
        });

        // 7. Générer et télécharger le PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        
        // Nom du fichier
        const fileName = `${selectedType}_${Date.now()}.pdf`;
        link.download = fileName;
        
        // Ajouter au DOM, cliquer et nettoyer
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Libérer la mémoire
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        console.log(`✅ ${selectedType.toUpperCase()} généré: ${fileName}`);
        
        // Ajouter une notification visuelle plus agréable
        const originalText = document.querySelector('#submit-text').textContent;
        document.querySelector('#submit-text').innerHTML = `<i class="fas fa-check-circle mr-2"></i>Succès !`;
        document.querySelector('#submit-text').classList.add('text-green-600');
        
        setTimeout(() => {
            document.querySelector('#submit-text').textContent = originalText;
            document.querySelector('#submit-text').classList.remove('text-green-600');
            alert(`✅ Document généré avec succès !\n\nFichier: ${fileName}`);
            
            // Retour à l'accueil
            setTimeout(() => {
                goBackToStep1();
            }, 500);
        }, 1500);

    } catch (error) {
        console.error("❌ ERREUR:", error);
        
        // Message d'erreur plus détaillé
        let errorMessage = `Erreur lors de la génération du ${selectedType}.\n`;
        if (error.message.includes('fetch')) {
            errorMessage += "Vérifiez que le template PDF existe dans le dossier PDFS/";
        } else if (error.message.includes('font')) {
            errorMessage += "Problème avec les polices Calibri";
        } else {
            errorMessage += `Détails: ${error.message}`;
        }
        
        alert(errorMessage);
        
        // Restaurer le bouton
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = false;
        const submitText = document.querySelector('#submit-text');
        if (submitText) {
            submitText.textContent = "Ajouter le fichier";
            submitText.classList.remove('text-green-600');
        }
    }
}








async function generateFromDynamicForm(type) {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        // Liste de TOUS les types qui dépendent du devis
        const typesDependants = ["facture", "attestation_realisation", "cdc", "rapport"];
        
        // Sauvegarder les données du devis
        if (type === 'devis') {
            localStorage.setItem("lastDevisData", JSON.stringify(formData));
            console.log("✅ Devis sauvegardé:", formData);
        }
        
        // Pour TOUS les types dépendants, fusionner avec les données du devis
        if (typesDependants.includes(type)) {
            const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData") || "null");
            if (lastDevisData) {
                // Fusionner les données : priorité AU FORMULAIRE, puis au devis
                const mergedData = { ...lastDevisData, ...formData };
                
                // Gestion spécifique par type
                switch(type) {
                    case 'facture':
                        // Pour la facture, garder date_facture du formulaire
                        if (formData.date_facture) {
                            mergedData.date_facture = formData.date_facture;
                        }
                        break;
                        
                    case 'attestation_realisation':
                        // Pour l'attestation, garder date_signature du formulaire
                        if (formData.date_signature) {
                            mergedData.date_signature = formData.date_signature;
                        }
                        break;
                        
                    case 'cdc':
                        // Pour CDC, pas de traitement spécial
                        break;
                        
                    case 'rapport':
                        // Pour rapport, pas de traitement spécial
                        break;
                }
                
                console.log(`🔗 Données fusionnées ${type}:`, mergedData);
                await generatePdfWithPdfLib(mergedData, type);
                return;
            } else {
                alert(`❌ Impossible de générer le ${type} : aucun devis trouvé !`);
                return;
            }
        }
        
        // Pour le devis seul (sans fusion)
        await generatePdfWithPdfLib(formData, type);
        
    } catch (error) {
        console.error("❌ Erreur:", error);
        alert(`❌ Erreur lors de la génération du ${type}.`);
    }
}


function autoFillFromLastDevis(type) {
    const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData"));
    if (!lastDevisData) return null;
    
    // Pour la facture, on copie tout sauf la date
    const factureData = { ...lastDevisData };
    
    // On garde la date_facture saisie par l'utilisateur
    if (factureData.date_devis) {
        factureData.date_facture = factureData.date_devis;
        delete factureData.date_devis;
    }
    
    return factureData;
}


function autoFillFacture() {
    const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData"));
    if (!lastDevisData) {
        alert("Aucun devis trouvé !");
        return;
    }
    
    // Remplir tous les champs sauf date_facture
    document.querySelectorAll("#dynamic-fields input").forEach(input => {
        if (input.name !== "date_facture" && lastDevisData[input.name]) {
            input.value = lastDevisData[input.name];
        }
    });
    
    alert("✅ Données du devis importées ! Vérifiez la date de facture.");
}



function createDevisFirst() {
    document.querySelector('.file-option[data-value="devis"]').click();
}

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Écouteurs pour les options de fichiers
    document.querySelectorAll('.file-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.file-option').forEach(opt => {
                opt.classList.remove('border-blue-500', 'bg-blue-50');
                opt.classList.add('border-gray-200');
            });
            
            this.classList.remove('border-gray-200');
            this.classList.add('border-blue-500', 'bg-blue-50');
            
            selectedFileType = this.getAttribute('data-value');
            document.getElementById('selected_file_type').value = selectedFileType;
            
            const fileName = this.querySelector('h4').textContent;
            document.getElementById('selected-file-name').textContent = fileName;
            document.getElementById('selected-file-indicator').classList.remove('hidden');
            
            loadFormFor(selectedFileType);
            document.getElementById('submitBtn').disabled = false;
        });
    });
    
    // Écouteur pour le sélecteur de dossier
    const select = document.getElementById('dossier_type');
    if (select) {
        select.addEventListener('change', function() {
            if (this.value) {
                selectDossier(this.value);
            }
        });
    }
    
    // Écouteur pour le bouton annuler
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les sélections seront perdues.')) {
                goBackToStep1();
            }
        });
    }
    
    // Animation d'entrée
    const elements = document.querySelectorAll('header, .bg-white');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Précharger les templates PDF
    console.log("🔄 Préchargement des templates...");
    const essentialTemplates = ['PDFS/devis.pdf', 'PDFS/facture.pdf'];
    essentialTemplates.forEach(template => {
        fetch(template, { priority: 'low' })
            .then(res => res.arrayBuffer())
            .then(buffer => {
                pdfCache.set(template, buffer);
                console.log(`✅ Préchargé: ${template}`);
            })
            .catch(err => console.warn(`⚠️ ${template}: ${err.message}`));
    });
});

// Fonction de test rapide
async function testCalibri() {
    console.log("🧪 Test Calibri...");
    
    try {
        // Tester si fontkit est disponible
        if (typeof fontkit === 'undefined') {
            console.error("❌ Fontkit non chargé !");
            alert("❌ Fontkit non chargé. Vérifie les scripts dans index.html");
            return;
        }
        
        // Tester si les fichiers Calibri existent
        const test1 = await fetch('./fonts/calibri.ttf');
        const test2 = await fetch('./fonts/calibri-bold.ttf');
        
        console.log("calibri.ttf:", test1.ok ? "✅ OK" : "❌ MANQUANT");
        console.log("calibri-bold.ttf:", test2.ok ? "✅ OK" : "❌ MANQUANT");
        
        if (test1.ok && test2.ok) {
            alert("✅ Tous les fichiers Calibri sont présents !");
        } else {
            alert("❌ Vérifie que les fichiers sont dans le dossier fonts/");
        }
        
    } catch (error) {
        console.error("Erreur test:", error);
    }
}




function reimportAllDevisData(type) {
    const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData"));
    if (!lastDevisData) {
        alert("❌ Aucun devis trouvé !");
        return;
    }
    
    // Déterminer quels champs ne pas écraser selon le type
    let excludedFields = [];
    switch(type) {
        case 'facture':
            excludedFields = ['date_facture'];
            break;
        case 'attestation_realisation':
            excludedFields = ['date_signature'];
            break;
        case 'cdc':
        case 'rapport':
            excludedFields = []; // Tous les champs peuvent être écrasés
            break;
    }
    
    // Remplir tous les champs sauf ceux exclus
    document.querySelectorAll("#dynamic-fields input").forEach(input => {
        if (lastDevisData[input.name] && !excludedFields.includes(input.name)) {
            input.value = lastDevisData[input.name];
        }
    });
    
    alert(`✅ Données du devis réimportées (sauf ${excludedFields.join(', ') || 'aucun champ exclu'}) !`);
}

function autoFillFromDevis(type) {
    const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData"));
    if (!lastDevisData) {
        alert("❌ Aucun devis trouvé !");
        return;
    }
    
    // Déterminer quels champs sont spécifiques au type
    let specificFields = [];
    switch(type) {
        case 'facture':
            specificFields = ['date_facture'];
            break;
        case 'attestation_realisation':
            specificFields = ['date_signature'];
            break;
    }
    
    // Remplir tous les champs sauf ceux spécifiques
    document.querySelectorAll("#dynamic-fields input").forEach(input => {
        if (lastDevisData[input.name] && !specificFields.includes(input.name)) {
            input.value = lastDevisData[input.name];
        }
    });
    
    alert(`✅ Données du devis importées pour le ${type} !`);
}




function checkDevisDependencies() {
    console.log("=== ÉTAT DES DÉPENDANCES DEVIS ===");
    
    const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData"));
    
    if (!lastDevisData) {
        console.log("❌ AUCUN DEVIS SAUVEGARDÉ");
        return false;
    }
    
    console.log("✅ Devis sauvegardé:", lastDevisData.reference_devis);
    
    // Vérifier quels champs sont disponibles
    const allFields = new Set();
    Object.values(fileForms).forEach(form => {
        form.forEach(field => {
            allFields.add(field.name);
        });
    });
    
    console.log("📊 Champs disponibles dans le devis:");
    allFields.forEach(field => {
        const hasField = lastDevisData.hasOwnProperty(field);
        console.log(`  ${field}: ${hasField ? '✅ ' + lastDevisData[field] : '❌ Absent'}`);
    });
    
    return true;
}


function checkDocumentDependencies() {
    console.log("=== ÉTAT DES DÉPENDANCES ===");
    
    const lastDevis = JSON.parse(localStorage.getItem('lastDevisData'));
    const lastFacture = JSON.parse(localStorage.getItem('lastFactureData'));
    
    console.log("Devis:", lastDevis ? "✅ Présent" : "❌ Absent");
    console.log("Facture:", lastFacture ? "✅ Présente" : "❌ Absente");
    
    if (lastFacture) {
        console.log("📊 Données facture disponibles:");
        console.log("- Numéro:", lastFacture.numero_facture);
        console.log("- Date:", lastFacture.date_facture);
        console.log("- Puissance:", lastFacture.puissance_chaudiere);
        console.log("- Émetteurs:", lastFacture.nombre_emetteurs);
        console.log("- Volume:", lastFacture.volume_circuit);
    }
    
    return { hasDevis: !!lastDevis, hasFacture: !!lastFacture };
}





function reimportAllData(type) {
    const lastDevisData = JSON.parse(localStorage.getItem("lastDevisData"));
    const lastFactureData = JSON.parse(localStorage.getItem("lastFactureData"));
    
    if (!lastDevisData) {
        alert("❌ Aucun devis trouvé !");
        return;
    }
    
    // Déterminer quels champs ne pas écraser selon le type
    let excludedFields = [];
    switch(type) {
        case 'facture':
            excludedFields = ['date_facture'];
            break;
        case 'attestation_realisation':
            excludedFields = ['date_signature'];
            break;
        case 'cdc':
        case 'rapport':
            excludedFields = []; // Tous les champs peuvent être écrasés
            break;
    }
    
    // Remplir tous les champs sauf ceux exclus
    document.querySelectorAll("#dynamic-fields input").forEach(input => {
        // 1. Essayer avec les données de facture (pour le rapport)
        if (type === 'rapport' && input.name === "date_facture" && lastFactureData && lastFactureData[input.name]) {
            input.value = lastFactureData[input.name];
            console.log(`Rempli ${input.name} depuis facture: ${input.value}`);
        }
        // 2. Essayer avec les données du devis
        else if (lastDevisData[input.name] && !excludedFields.includes(input.name)) {
            input.value = lastDevisData[input.name];
            console.log(`Rempli ${input.name} depuis devis: ${input.value}`);
        }
    });
    
    let message = "✅ Données réimportées !";
    if (type === 'rapport' && lastFactureData) {
        message += "\n- Date de facture importée depuis la facture";
    } else if (type === 'rapport' && !lastFactureData) {
        message += "\n⚠️ Aucune facture trouvée (date de facture vide)";
    }
    
    alert(message);
}



function testAlignement() {
    const tests = [
        { value: "12345,67", expectedX: 526 },
        { value: "1 234,56", expectedX: 528 },
        { value: "123,45", expectedX: 530 },
        { value: "12,34", expectedX: 532 },
        { value: "1,23", expectedX: 534 }
    ];
    
    console.log("=== TEST ALIGNEMENT MONTANTS ===");
    tests.forEach(test => {
        const result = adjustXForAmount(test.value, 528);
        console.log(`${test.value} -> x=${result} (attendu: ${test.expectedX}) -> ${result === test.expectedX ? '✅' : '❌'}`);
    });
}

// Appelez cette fonction dans la console pour tester


