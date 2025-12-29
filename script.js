
let selectedDossier = '';
let selectedFileType = '';
const pdfCache = new Map();


function selectDossier(dossier) {
    const user = JSON.parse(localStorage.getItem('current_user'));
    
    if (!user) {
        alert("🔒 Veuillez vous connecter pour accéder aux dossiers.");
        return;
    }
    
    if (!user.user.validated) {
        alert("⚠️ Votre compte n'est pas encore validé.");
        return;
    }
    
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
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="devis">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-invoice-dollar text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Devis</h4>
                    <p class="text-gray-500 text-sm">Estimation des coûts MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="facture">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-invoice text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Facture</h4>
                    <p class="text-gray-500 text-sm">Document comptable MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="attestation_realisation">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-certificate text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Attestation de réalisation</h4>
                    <p class="text-gray-500 text-sm">Document attestant des travaux MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="attestation_signataire">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-file-signature text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Attestation signataire</h4>
                    <p class="text-gray-500 text-sm">Document avec signature MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="cdc">
                <div class="flex flex-col items-center text-center">
                    <div class="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <i class="fas fa-clipboard-list text-green-600 text-2xl"></i>
                    </div>
                    <h4 class="font-bold text-gray-800 mb-1">Cahier des charges</h4>
                    <p class="text-gray-500 text-sm">Spécifications techniques MYHOUSE</p>
                </div>
            </div>
            
            <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="rapport">
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

// ============================================
// FORMULAIRES DYNAMIQUES
// ============================================
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
        { name: "wh_cumac", label: "WH CUMAC", required: true, example: "1 751 400" }
    ],
    
    facture: [
        { name: "date_facture", label: "Date de la facture", type: "date", required: true, example: "10/10/2025" },
    ],
    
    rapport: [
        { name: "adresse_travaux_1", label: "Adresse des travaux (1)", required: true },
        { name: "boite_postale_1", label: "Boîte postale + Zone (1)", required: true },
        { name: "adresse_travaux_2", label: "Adresse des travaux (2) - Facultatif", required: false },
        { name: "boite_postale_2", label: "Boîte postale + Zone (2) - Facultatif", required: false }
    ]
};

function loadFormFor(type) {
    const container = document.getElementById("dynamic-fields");
    container.innerHTML = "";
    document.getElementById("dynamic-form").classList.remove("hidden");

    // Logique spécifique pour chaque type
    if (type === "cdc" || type === "facture" || type === "rapport") {
        const lastDevisData = localStorage.getItem("lastDevisData");
        if (!lastDevisData) {
            container.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">Devis requis !</h4>
                            <p class="text-red-600 mb-3">Vous devez d'abord générer un devis.</p>
                            <div class="flex gap-3">
                                <button onclick="createDevisFirst()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-2"></i>Créer un devis
                                </button>
                                <button onclick="goBackToStep1()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                    <i class="fas fa-arrow-left mr-2"></i>Retour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('submitBtn').disabled = true;
            return;
        }
    }

    // Créer les champs du formulaire
    if (fileForms[type]) {
        fileForms[type].forEach(field => {
            const placeholder = field.example || "";
            container.innerHTML += `
                <label class="block mb-4">
                    <span class="text-gray-700 font-medium">
                        ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                    </span>
                    <input
                        type="${field.type || 'text'}"
                        name="${field.name}"
                        placeholder="${placeholder}"
                        class="w-full mt-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        ${field.required ? 'required' : ''}
                        ${field.readonly ? 'readonly' : ''}
                    >
                    ${field.example ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                </label>
            `;
        });

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

// ============================================
// COORDONNÉES PDF AVEC CALIBRI
// ============================================
const pdfCoordinates = {
    devis: {
           page1: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 10.5, color: 'white', bold: true },
            adresse_travaux: { x: 105, y: 505, size: 8, color: 'black' },
            numero_immatriculation: { x: 205, y: 495.5, size: 8, color: 'black' },
            nom_residence: { x: 268, y: 495.5, size: 8, color: 'black' },
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
            date_devis: { x: 139, y: 718, size: 10.5, color: 'white', bold: true },
            puissance_chaudiere: { x: 198, y: 632, size: 7, color: 'black' },
            zone_climatique: { x: 135, y: 579.5, size: 8, color: 'black' },
            nombre_logements: { x: 189, y: 622, size: 7, color: 'black' },
            nombre_emetteurs: { x: 195, y: 611, size: 7, color: 'black' },
            volume_circuit: { x: 179, y: 590, size: 7, color: 'black' },
            nombre_filtres: { x: 102, y: 569, size: 7, color: 'black' },
            wh_cumac: { x: 127, y: 548, size: 7, color: 'black' },
            prime_cee: { x: 120, y: 538, size: 7, color: 'black' }
        },
        page3: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 10.5, color: 'white', bold: true }
        },
        page4: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 10.5, color: 'white', bold: true },
            montant_ht: { x: 522, y: 383, size: 8, color: 'darkblue', bold: false },
            montant_tva: { x: 522, y: 371, size: 8, color: 'darkblue', bold: true },
            montant_ttc: { x: 522, y: 361, size: 8, color: 'darkblue', bold: true },
            prime_cee: { x: 522, y: 350, size: 8, color: 'darkblue', bold: true },
            prime_cee_dup: { x: 78.5, y: 277.5, size: 7, color: 'black', bold: true },
            reste_a_charge: { x: 522, y: 315, size: 8, color: 'darkblue', bold: true },
            montant_ht_dup: { x: 77, y: 277, size: 7, color: 'black' }
        },
        page5: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_devis: { x: 139, y: 718, size: 10.5, color: 'white', bold: true }
        }
    },
    
    facture: {
         page1: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 10.5, color: 'white', bold: true }, // Remplace date_devis
            adresse_travaux: { x: 104, y: 505, size: 8, color: 'black' },
            numero_immatriculation: { x: 205, y: 495, size: 8, color: 'black' },
            nom_residence: { x: 268, y: 495, size: 8, color: 'black' },
            parcelle_1: { x: 84, y: 462, size: 7, color: 'black' },
            parcelle_2: { x: 224, y: 462, size: 7, color: 'black' },
            parcelle_3: { x: 84, y: 449, size: 7, color: 'black' },
            parcelle_4: { x: 224, y: 449, size: 7, color: 'black' },
            dates_previsionnelles: { x: 174, y: 428, size: 7, color: 'black' },
            nombre_batiments: { x: 124, y: 400, size: 8, color: 'black' },
            details_batiments: { x: 72, y: 391, size: 8, color: 'black' },
            prime_cee: { x: 410, y: 348, size: 7, color: 'black' },
            prime_cee_dup: { x: 468, y: 348, size: 7, color: 'black' }
        },
        page2: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 10.5, color: 'white', bold: true }, // Remplace date_devis
            puissance_chaudiere: { x: 198, y: 632, size: 7, color: 'black' },
            nombre_logements: { x: 189, y: 622, size: 7, color: 'black' },
            nombre_emetteurs: { x: 195, y: 611, size: 7, color: 'black' },
            volume_circuit: { x: 179, y: 590, size: 7, color: 'black' },
            nombre_filtres: { x: 102, y: 569, size: 7, color: 'black' },
            wh_cumac: { x: 127, y: 548, size: 7, color: 'black' },
            prime_cee: { x: 120, y: 538, size: 7, color: 'black' }
        },
        page3: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 10.5, color: 'white', bold: true } // Remplace date_devis
        },
        page4: {
            reference_devis: { x: 216, y: 733, size: 12, color: 'white', bold: true },
            date_facture: { x: 139, y: 718, size: 10.5, color: 'white', bold: true }, // Remplace date_devis
            montant_ht: { x: 522, y: 383, size: 8, color: 'darkblue', bold: true },
            montant_tva: { x: 522, y: 371, size: 8, color: 'darkblue', bold: true },
            montant_ttc: { x: 522, y: 361, size: 8, color: 'darkblue', bold: true },
            prime_cee: { x: 522, y: 350, size: 8, color: 'darkblue', bold: true },
            reste_a_charge: { x: 522, y: 315, size: 8, color: 'darkblue', bold: true },
            montant_ht_dup: { x: 77, y: 277, size: 7, color: 'black' }
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
            adresse_travaux: { x: 186, y: 449, size: 8, color: 'black', bold: false },
            puissance_chaudiere: { x: 186, y: 395, size: 8, color: 'black', bold: false },
            nombre_emetteurs: { x: 186, y: 385, size: 8, color: 'black', bold: false },
            volume_circuit: { x: 186, y: 364, size: 8, color: 'black', bold: false },
            nombre_batiments: { x: 186, y: 314, size: 8, color: 'black', bold: false },
            details_batiments: { x: 186, y: 300, size: 8, color: 'black', bold: false },
            dates_previsionnelles: { x: 195, y: 340, size: 8, color: 'black', bold: false }
        },
        page2: {
            reference_devis: { x: 224, y: 469, size: 8, color: 'black', bold: true },
            date_signature: { x: 389, y: 399, size: 8, color: 'black', bold: false },
            date_devis: { x: 248, y: 469, size: 8, color: 'black', bold: true }
        }
    }
};

// ============================================
// FONCTION PRINCIPALE DE GÉNÉRATION PDF AVEC CALIBRI
// ============================================
async function generatePdfWithPdfLib(formData, type = null) {
    const selectedType = type || document.getElementById('selected_file_type').value;
    if (!selectedType) {
        alert("Veuillez sélectionner un type de fichier.");
        return;
    }

    console.log(`=== GÉNÉRATION ${selectedType.toUpperCase()} AVEC CALIBRI ===`);

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
        const { PDFDocument, StandardFonts, rgb } = PDFLib;
        
        // 2. Créer le document PDF avec fontkit
        const pdfDoc = await PDFDocument.load(existingPdf);
        
        // VÉRIFIER ET ENREGISTRER FONTKIT
        if (typeof fontkit !== 'undefined') {
            pdfDoc.registerFontkit(fontkit);
            console.log("✅ Fontkit enregistré");
        } else {
            console.warn("⚠️ Fontkit non disponible");
        }
        
        const pages = pdfDoc.getPages();

        // 3. Charger les polices Calibri
        console.log("🔄 Chargement des polices Calibri...");
        let calibriRegular, calibriBold;
        
        try {
            // Essayer de charger Calibri Regular
            console.log("Tentative de chargement:", calibriUrls.regular);
            const regularResponse = await fetch(calibriUrls.regular);
            if (!regularResponse.ok) throw new Error(`Calibri Regular non trouvé (${regularResponse.status})`);
            const regularBytes = await regularResponse.arrayBuffer();
            calibriRegular = await pdfDoc.embedFont(regularBytes);
            
            // Essayer de charger Calibri Bold
            console.log("Tentative de chargement:", calibriUrls.bold);
            const boldResponse = await fetch(calibriUrls.bold);
            if (!boldResponse.ok) throw new Error(`Calibri Bold non trouvé (${boldResponse.status})`);
            const boldBytes = await boldResponse.arrayBuffer();
            calibriBold = await pdfDoc.embedFont(boldBytes);
            
            console.log("✅ Calibri chargée avec succès !");
            
        } catch (fontError) {
            console.warn("❌ Échec chargement Calibri:", fontError.message);
            console.log("↪️ Utilisation d'Helvetica comme fallback");
            
            // Fallback sur Helvetica
            calibriRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
            calibriBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        }

        // 4. Récupérer les coordonnées
        const coords = pdfCoordinates[selectedType];
        if (!coords) {
            alert(`❌ Pas de coordonnées définies pour ${selectedType}`);
            return;
        }

       // Dans la fonction generatePdfWithPdfLib, avant d'écrire le texte :
        pages.forEach((page, index) => {
            const pageKey = `page${index + 1}`;
            
            if (coords[pageKey]) {
                Object.entries(coords[pageKey]).forEach(([fieldName, coord]) => {
                    let value = formData[fieldName] || "";
                    
                    // Si c'est prime_cee_dup mais non présent dans formData, prendre prime_cee
                    if (fieldName === "prime_cee_dup" && !formData[fieldName] && formData["prime_cee"]) {
                        value = formData["prime_cee"];
                    }
                    
                    // Formater les dates
                    if (fieldName.includes("date") || fieldName.includes("signature") || fieldName.includes("fait")) {
                        value = formatDateFR(value);
                    }
                    
                    if (value && value.trim() !== "") {
                        // Choisir la police (bold ou regular)
                        const font = coord.bold ? calibriBold : calibriRegular;
                        
                        // Choisir la couleur
                        let color;
                        switch(coord.color) {
                            case 'white':
                                color = rgb(1, 1, 1);
                                break;
                            case 'dark_blue':
                                color = rgb(23, 61, 215);
                                break;
                            case 'black':
                            default:
                                color = rgb(0, 0, 0);
                        }
                        
                        // Écrire le texte
                        try {
                            page.drawText(value, {
                                x: coord.x,
                                y: coord.y,
                                size: coord.size,
                                font: font,
                                color: color
                            });
                        } catch (drawError) {
                            console.warn(`⚠️ Erreur écriture ${fieldName}:`, drawError);
                        }
                    }
                });
            }
        });

        // 6. Générer et télécharger le PDF
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
        alert(`✅ Document généré avec succès !\n\nFichier: ${fileName}`);
        
        // Retour à l'accueil
        setTimeout(() => {
            goBackToStep1();
        }, 1000);

    } catch (error) {
        console.error("❌ ERREUR:", error);
        alert(`❌ Erreur lors de la génération du ${selectedType}.\n\nDétails: ${error.message}`);
    } finally {
        // Restaurer le bouton
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = false;
        const submitText = document.querySelector('#submit-text');
        if (submitText) submitText.textContent = "Ajouter le fichier";
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================
function formatDateFR(dateStr) {
    if (!dateStr) return "";
    
    if (dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }
    
    return dateStr;
}

async function generateFromDynamicForm(type) {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        if (type === 'devis') {
            localStorage.setItem("lastDevisData", JSON.stringify(formData));
            console.log("Devis sauvegardé:", formData);
        }
        
        await generatePdfWithPdfLib(formData, type);
        
    } catch (error) {
        console.error("Erreur:", error);
        alert("❌ Erreur lors de la génération.");
    }
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
