function getFieldValue(fieldName, formData) {
    // OPTIMISATION : Utiliser un cache pour éviter les recherches répétées
    if (!window.myhouseFieldCache) {
        window.myhouseFieldCache = new Map();
    }
    
    const cacheKey = `${fieldName}_${JSON.stringify(formData)}`;
    if (window.myhouseFieldCache.has(cacheKey)) {
        return window.myhouseFieldCache.get(cacheKey);
    }
    
    const fieldMapping = {
        'prime_cee': 'prime_cee',
        'prime_cee_dup': 'prime_cee',
        'prime_cee_dup2': 'prime_cee',
        'prime_cee_page3': 'prime_cee',
        'prime_cee_page3_dup3': 'prime_cee',
        'reference_devis': 'reference_devis', 
        'reference_devis_dup': 'reference_devis',
        'reference_facture': 'reference_facture',
        'reference_facture_dup': 'reference_facture',
        'total_tva': 'total_tva',
        'total_tva_dup': 'total_tva',
        'total_ttc': 'total_ttc',
        'total_ttc_dup': 'total_ttc',
        'nom_batiment': 'nom_residence',  
        'adresse_complete': 'adresse_travaux',  
        'numero_cadastral': 'numero_immatriculation',
        'date_etablissement': 'date_signature',
        'nombre_logements': 'nombre_logements',
        'nombre_logements_dup': 'nombre_logements',
        
        // Spécifique au CDC
        'date_cdc': 'date_devis',
        'date_cdc_dup': 'date_devis',
        'prime_cee_cdc': 'prime_cee'
    };
    
    const actualField = fieldMapping[fieldName] || fieldName;
    const value = formData[actualField] || "";
    
    // Mettre en cache
    window.myhouseFieldCache.set(cacheKey, value);
    
    return value;
}

let myhouseSelectedFileType = '';




const originalSelectDossier = window.selectDossier || function() {};

window.selectDossier = function(dossier) {
    window.selectedDossier = dossier;
    
    if (dossier === 'myhouse') {
        document.getElementById('selected-dossier-text').textContent = 'MYHOUSE - Dossier logement & propriété';
        document.getElementById('form-subtitle').textContent = 'Choisissez le document à ajouter à votre dossier MYHOUSE';
        
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        document.getElementById('step2').classList.add('fade-in');
        
        document.getElementById('backBtn').classList.remove('hidden');
        document.getElementById('submit-text').textContent = 'Ajouter le fichier';
        document.getElementById('help-text').textContent = 'Sélectionnez le type de fichier que vous souhaitez ajouter à votre dossier. Vous pourrez ensuite télécharger le document correspondant.';
        
        document.getElementById('submitBtn').disabled = true;
        
        localStorage.setItem("currentDossier", "myhouse");
        
        myhouseSelectedFileType = '';
        document.getElementById('selected_file_type').value = '';
        document.getElementById('selected-file-indicator').classList.add('hidden');
        
        document.querySelectorAll('.file-option').forEach(option => {
            option.classList.remove('border-blue-500', 'bg-blue-50');
            option.classList.add('border-gray-200');
        });
        
        document.getElementById("dynamic-form").classList.add("hidden");
        
    } else {
        originalSelectDossier(dossier);
    }
};



const originalLoadFormFor = window.loadFormFor || function() {};

window.loadFormFor = function(type) {
    if (window.selectedDossier === 'myhouse') {
        myhouseSelectedFileType = type;
        document.getElementById('selected_file_type').value = type;
        loadMyhouseForm(type);
    } else {
        originalLoadFormFor(type);
    }
};


const originalClearFileSelection = window.clearFileSelection || function() {};

window.clearFileSelection = function() {
    if (window.selectedDossier === 'myhouse') {
        myhouseSelectedFileType = '';
        document.getElementById('selected_file_type').value = '';
        document.getElementById('selected-file-indicator').classList.add('hidden');
        document.getElementById('submitBtn').disabled = true;
        
        document.querySelectorAll('.file-option').forEach(option => {
            option.classList.remove('border-green-500', 'bg-green-50', 'border-blue-500', 'bg-blue-50');
            option.classList.add('border-gray-200');
        });
        
        document.getElementById("dynamic-form").classList.add("hidden");
    } else {
        originalClearFileSelection();
    }
};

const originalCreateDevisFirst = window.createDevisFirst || function() {};

window.createDevisFirst = function() {
    if (window.selectedDossier === 'myhouse') {
        document.querySelector('.file-option[data-value="devis"]').click();
    } else {
        originalCreateDevisFirst();
    }
};

const originalGenerateFromDynamicForm = window.generateFromDynamicForm || function() {};

window.generateFromDynamicForm = async function(type) {
    if (window.selectedDossier === 'myhouse') {
        await generateMyhouseFromDynamicForm(type);
    } else {
        originalGenerateFromDynamicForm(type);
    }
};

const myhouseFileForms = {
   attestation_signataire: [
        { name: "nom_residence", label: "Nom de la résidence", readonly: true },
        { name: "adresse_travaux", label: "Adresse des travaux / bâtiment", readonly: true },
        { name: "numero_immatriculation", label: "Numéro d'immatriculation", readonly: true },
        
        { 
            name: "date_signature", 
            label: "Date de signature", 
            type: "date", 
            required: true, 
            example: "15/10/2025" 
        }
    ],


   attestation_realisation: [
        { name: "date_signature", label: "Date de signature", type: "date", required: true, example: "15/10/2025" },
        
        { name: "adresse_travaux", label: "Adresse des travaux", readonly: true },
        { name: "nombre_logements", label: "Nombre de logements", readonly: true },
        { name: "puissance_nominale", label: "Puissance nominale de la chaudière (kW)", readonly: true },
        { name: "nombre_emetteurs", label: "Nombre d'émetteurs", readonly: true },
        { name: "volume_total", label: "Volume total du circuit (L)", readonly: true },
        { name: "zone_climatique", label: "Zone climatique", readonly: true },
        { name: "date_travaux", label: "Période d'exécution", readonly: true },
        { name: "nombre_batiments", label: "Nombre de bâtiments", readonly: true },
        { name: "details_batiment", label: "Détails du bâtiment", readonly: true },
        { name: "reference_devis", label: "Référence du devis", readonly: true },
        { name: "date_devis", label: "Date du devis", type: "date", readonly: true },
        { name: "date_facture", label: "Date de la facture", type: "date", readonly: true }
    ],


    devis: [
        { name: "reference_devis", label: "Référence du devis", required: true, example: "MH-DEV-2025-001" },
        { name: "date_devis", label: "Date du devis", type: "date", required: true, example: "15/10/2025" },
        { name: "adresse_travaux", label: "Adresse des travaux", required: true, example: "123 Rue des Chênes, 75000 Paris" },
        { name: "parcelle_cadastrale", label: "Parcelle cadastrale", required: true, example: "AB 1234 56789" },
        { name: "numero_immatriculation", label: "Numéro d'immatriculation", required: true, example: "123456789" },
        { name: "nombre_batiments", label: "Nombre de bâtiments", required: true, example: "2" },
        { name: "details_batiment", label: "Détails du bâtiment", required: true, example: "Bâtiment A: 10 logements, Bâtiment B: 8 logements" },
        { name: "nom_residence", label: "Nom de la résidence", required: true, example: "Résidence Les Tilleuls" },
        { name: "date_travaux", label: "Date des travaux", required: true, example: "01/11/2025 au 02/11/2025" },
        { name: "montant_cumac", label: "Montant CUMAC (€)", required: true, example: "45 000,00 €" },
        { name: "prime_cee", label: "Prime CEE (€)", required: true, example: "15 000,00 €" },
        { name: "puissance_nominale", label: "Puissance nominale de la chaudière (kW)", required: true, example: "250 kW" },
        { name: "nombre_logements", label: "Nombre de logements", required: true, example: "18" },
        { name: "nombre_emetteurs", label: "Nombre d'émetteurs", required: true, example: "72" },
        { name: "volume_total", label: "Volume total du circuit (L)", required: true, example: "3 600 L" },
        { name: "zone_climatique", label: "Zone climatique", required: true, example: "H2, H3, etc." },
        { name: "total_tva", label: "Total TVA (€)", required: true, example: "5 600,00 €" },
        { name: "total_ttc", label: "Total TTC (€)", required: true, example: "37 600,00 €" }
    ],

    facture: [
        { 
            name: "date_facture", 
            label: "Date de la facture", 
            type: "date", 
            required: true, 
            example: "15/10/2025" 
        }
    ],

    rapport: [
        { 
            name: "adresse_travaux_1", 
            label: "Adresse des travaux (ligne 1)", 
            required: true, 
            example: "123 Rue des Chênes, 75000 Paris" 
        },
        { 
            name: "boite_postale_1", 
            label: "Boîte postale + Zone (ligne 1)", 
            required: true, 
            example: "BP 1234, Zone Industrielle Nord" 
        },
        { 
            name: "adresse_travaux_2", 
            label: "Adresse des travaux (ligne 2) - Facultatif", 
            required: false,
            example: "Résidence Les Tilleuls, Batiment B" 
        },
        { 
            name: "boite_postale_2", 
            label: "Boîte postale + Zone (ligne 2) - Facultatif", 
            required: false,
            example: "BP 5678, Zone Résidentielle Sud" 
        }
    ],

    cdc: [
        { name: "reference_cdc", label: "Référence CDC", required: true, example: "MH-CDC-2025-001" },
        { name: "date_cdc", label: "Date du CDC", type: "date", required: true, example: "15/10/2025" },
        { name: "objet_cdc", label: "Objet du cahier des charges", required: true, example: "Spécifications pour travaux de rénovation" },
        { name: "specifications_techniques", label: "Spécifications techniques", type: "textarea", required: true },
        { name: "contraintes", label: "Contraintes particulières", type: "textarea", required: false },
        { name: "delais", label: "Délais à respecter", required: true, example: "3 mois" },
        { name: "garanties", label: "Garanties demandées", type: "textarea", required: true },
    ]
};



function loadMyhouseForm(type) {
    const container = document.getElementById("dynamic-fields");
    container.innerHTML = "";

    document.getElementById("dynamic-form").classList.add("hidden");
    if (!myhouseFileForms[type]) {
        container.innerHTML = `
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div class="flex items-center gap-3">
                    <i class="fas fa-info-circle text-yellow-600"></i>
                    <p class="text-yellow-700">Ce type de document n'est pas encore disponible pour MYHOUSE.</p>
                </div>
            </div>
        `;
        document.getElementById("dynamic-form").classList.remove("hidden");
        document.getElementById('submitBtn').disabled = true;
        return;
    }

   if (type === "cdc") {
    const lastDevisData = localStorage.getItem("lastMyhouseDevisData");

    if (!lastDevisData) {
        container.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div class="flex items-start gap-3">
                    <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                    <div>
                        <h4 class="font-bold text-red-700 mb-2">Devis MYHOUSE requis !</h4>
                        <p class="text-red-600 mb-3">
                            Vous devez d'abord générer un devis MYHOUSE avant de pouvoir créer un Cahier des Charges.
                        </p>
                        <div class="flex gap-3">
                            <button onclick="createMyhouseDevisFirst()"
                                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                <i class="fas fa-file-invoice-dollar mr-2"></i>
                                Créer un devis MYHOUSE d'abord
                            </button>
                            <button onclick="goBackToStep1()"
                                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                <i class="fas fa-arrow-left mr-2"></i>
                                Retour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("dynamic-form").classList.remove("hidden");
        document.getElementById('submitBtn').disabled = true;
        return;
    }

    // Afficher seulement le tableau avec les données du devis
    const devisData = JSON.parse(lastDevisData);
    
    container.innerHTML = `
        <div class="mb-6">
            <h3 class="text-lg font-bold text-green-700 mb-3">📊 Données du devis disponibles pour le CDC</h3>
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Information</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Valeur</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        
                        <tr class="bg-green-50">
                            <td class="px-4 py-3 text-sm font-medium text-green-700">Prime CEE</td>
                            <td class="px-4 py-3 font-bold text-green-800">${devisData.prime_cee || 'Non spécifiée'}</td>
                            <td class="px-4 py-3">
                                <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    <i class="fas fa-sync-alt mr-1"></i> 
                                </span>
                            </td>
                        </tr>
                        <tr class="bg-blue-50">
                            <td class="px-4 py-3 text-sm font-medium text-blue-700">Date du devis</td>
                            <td class="px-4 py-3 font-bold text-blue-800">${devisData.date_devis || 'Non spécifiée'}</td>
                            <td class="px-4 py-3">
                                <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    <i class="fas fa-copy mr-1"></i> 
                                </span>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
                
                <div class="p-4 bg-green-50 border-t border-green-200">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-info-circle text-green-600 text-xl mt-1"></i>
                        <div>
                            <p class="text-green-700 font-medium mb-1">Informations importées depuis le devis. assurez vous que les informations du devis sont correct</p>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>

    `;

    // Bouton de génération seulement (pas de formulaire)
    container.innerHTML += `
        <div class="pt-4 border-t border-gray-200">
            <button type="button"
                onclick="generateMyhouseCdc()"
                class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                <i class="fas fa-file-contract mr-2"></i>
                📄 Générer le Cahier des Charges MYHOUSE
            </button>
            <p class="text-xs text-gray-500 text-center mt-2">
                Cliquez pour générer et télécharger le CDC MYHOUSE avec les données importées du devis
            </p>
        </div>
    `;

    document.getElementById("dynamic-form").classList.remove("hidden");
    document.getElementById('submitBtn').disabled = true;
    return;
}
  
    if (type === "facture") {
        const lastDevisData = localStorage.getItem("lastMyhouseDevisData");

        if (!lastDevisData) {
            container.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">Devis MYHOUSE requis !</h4>
                            <p class="text-red-600 mb-3">
                                Vous devez d'abord générer un devis MYHOUSE avant de pouvoir créer une facture.
                                Toutes les informations seront automatiquement importées depuis le devis.
                            </p>
                            <div class="flex gap-3">
                                <button onclick="createMyhouseDevisFirst()"
                                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-2"></i>
                                    Créer un devis MYHOUSE d'abord
                                </button>
                                <button onclick="goBackToStep1()"
                                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                    <i class="fas fa-arrow-left mr-2"></i>
                                    Retour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("dynamic-form").classList.remove("hidden");
            document.getElementById('submitBtn').disabled = true;
            return;
        }

        const devisData = JSON.parse(lastDevisData);
        
        container.innerHTML = `
            <div class="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                <div class="flex items-start gap-3">
                    <i class="fas fa-info-circle text-green-600 text-xl mt-1"></i>
                    <div>
                        <h4 class="font-bold text-green-700 mb-2">Informations importées depuis le devis</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm text-green-600">
                            <div><strong>Référence devis:</strong> ${devisData.reference_devis || 'Non définie'}</div>
                            <div><strong>Adresse travaux:</strong> ${devisData.adresse_travaux || 'Non définie'}</div>
                            <div><strong>Montant TTC:</strong> ${devisData.total_ttc || 'Non défini'}</div>
                            <div><strong>Prime CEE:</strong> ${devisData.prime_cee || 'Non définie'}</div>
                        </div>
                        <p class="text-xs text-green-500 mt-2">
                            Toutes les informations du devis seront automatiquement reportées sur la facture.
                        </p>
                    </div>
                </div>
            </div>
        `;

        myhouseFileForms[type].forEach(field => {
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
                        class="w-full mt-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                        ${field.required ? 'required' : ''}
                    >
                    ${field.example ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                </label>
            `;
        });

        container.innerHTML += `
            <div class="pt-4 border-t border-gray-200">
                <button type="button"
                    onclick="generateMyhouseFacture()"
                    class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                    <i class="fas fa-file-invoice mr-2"></i>
                    📄 Générer la Facture MYHOUSE
                </button>
                <p class="text-xs text-gray-500 text-center mt-2">
                    Cliquez pour générer et télécharger la facture MYHOUSE avec toutes les informations importées du devis
                </p>
            </div>
        `;

        document.getElementById("dynamic-form").classList.remove("hidden");
        document.getElementById('submitBtn').disabled = true;
        return;
    }



    if (type === "rapport") {
        const lastFactureData = localStorage.getItem("lastMyhouseFactureData");

        if (!lastFactureData) {
            container.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">Facture MYHOUSE requise !</h4>
                            <p class="text-red-600 mb-3">
                                Vous devez d'abord générer une facture MYHOUSE avant de pouvoir créer un rapport.
                                Les informations techniques seront automatiquement importées depuis la facture.
                            </p>
                            <div class="flex gap-3">
                                <button onclick="createMyhouseFactureFirst()"
                                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    <i class="fas fa-file-invoice mr-2"></i>
                                    Créer une facture MYHOUSE d'abord
                                </button>
                                <button onclick="goBackToStep1()"
                                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                    <i class="fas fa-arrow-left mr-2"></i>
                                    Retour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("dynamic-form").classList.remove("hidden");
            document.getElementById('submitBtn').disabled = true;
            return;
        }

        let factureData;
        try {
            factureData = JSON.parse(lastFactureData);
            
            container.innerHTML = `
                <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-info-circle text-purple-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-purple-700 mb-2">Informations automatiques importées depuis la facture</h4>
                            <p class="text-purple-600 mb-3">
                                Ces informations sont automatiquement récupérées depuis la facture MYHOUSE :
                            </p>
                            <div class="grid grid-cols-2 gap-3 text-sm bg-white p-3 rounded-lg border">
                                <div class="text-gray-600">Référence facture:</div>
                                <div class="font-medium">${factureData.reference_facture || 'Non spécifié'}</div>
                                <div class="text-gray-600">Date facture:</div>
                                <div class="font-medium">${factureData.date_facture || 'Non spécifié'}</div>
                                <div class="text-gray-600">Puissance nominale:</div>
                                <div class="font-medium">${factureData.puissance_nominale || 'Non spécifié'}</div>
                                <div class="text-gray-600">Nombre d'émetteurs:</div>
                                <div class="font-medium">${factureData.nombre_emetteurs || 'Non spécifié'}</div>
                                <div class="text-gray-600">Volume circuit:</div>
                                <div class="font-medium">${factureData.volume_total || 'Non spécifié'}</div>
                                <div class="text-gray-600">Référence devis:</div>
                                <div class="font-medium">${factureData.reference_devis || 'Non spécifié'}</div>
                            </div>
                            <p class="text-xs text-purple-500 mt-2">
                                Ces données seront automatiquement incluses dans le rapport.
                            </p>
                        </div>
                    </div>
                </div>
            `;

            myhouseFileForms[type].forEach(field => {
                const placeholder = field.example || "";
                const isRequired = field.required ? 'required' : '';
                
                container.innerHTML += `
                    <label class="block mb-4">
                        <span class="text-gray-700 font-medium">
                            ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                        </span>
                        <input
                            type="text"
                            name="${field.name}"
                            class="w-full mt-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            ${isRequired}
                            placeholder="${placeholder}"
                        >
                        ${!field.required ? `<p class="text-xs text-gray-500 mt-1">Champ facultatif</p>` : ''}
                    </label>
                `;
            });

            container.innerHTML += `
                <div class="pt-4 border-t border-gray-200">
                    <button type="button"
                        onclick="generateMyhouseRapport()"
                        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                        <i class="fas fa-file-alt mr-2"></i>
                        📄 Générer le Rapport MYHOUSE
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-2">
                        Cliquez pour générer le rapport avec toutes les informations importées de la facture
                    </p>
                </div>
            `;

            document.getElementById("dynamic-form").classList.remove("hidden");
            document.getElementById('submitBtn').disabled = true;

        } catch (error) {
            console.error("Erreur données facture:", error);
            container.innerHTML = `<p class="text-red-600">Erreur de données. Veuillez recréer une facture MYHOUSE.</p>`;
            document.getElementById("dynamic-form").classList.remove("hidden");
        }
        return;
    }


if (type === "attestation_realisation") {
        document.getElementById("dynamic-form").classList.remove("hidden");

        const lastDevisData = localStorage.getItem("lastMyhouseDevisData");
        const lastFactureData = localStorage.getItem("lastMyhouseFactureData");
        
        let devisData = {};
        let factureData = {};
        
        if (lastDevisData) {
            try {
                devisData = JSON.parse(lastDevisData);
                console.log("Données du devis pour attestation:", devisData);
            } catch (error) {
                console.error("Erreur parsing devis:", error);
            }
        }
        
        if (lastFactureData) {
            try {
                factureData = JSON.parse(lastFactureData);
                console.log("Données de la facture pour attestation:", factureData);
            } catch (error) {
                console.error("Erreur parsing facture:", error);
            }
        }

        myhouseFileForms[type].forEach(field => {
            const placeholder = field.example || "";
            let valueFromData = "";
            
            if (field.readonly) {
                if (field.name === "date_facture") {
                    valueFromData = factureData[field.name] || factureData.date_facture || "";
                } else {
                    valueFromData = devisData[field.name] || "";
                }
            }
            
            const fieldValue = field.readonly ? valueFromData : "";
            
            container.innerHTML += `
                <label class="block mb-4">
                    <span class="text-gray-700 font-medium">
                        ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                        ${field.readonly ? '<span class="text-green-500 text-xs ml-2">(auto-rempli)</span>' : ''}
                    </span>
                    <input
                        type="${field.type || 'text'}"
                        name="${field.name}"
                        value="${fieldValue}"
                        placeholder="${placeholder}"
                        class="w-full mt-1 px-4 py-3 border-2 ${field.readonly ? 'border-green-200 bg-green-50 text-gray-600' : 'border-gray-300'} rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                        ${field.required ? 'required' : ''}
                        ${field.readonly ? 'readonly' : ''}
                    >
                    ${field.example && !field.readonly ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                    ${field.readonly && !valueFromData ? `<p class="text-xs text-yellow-500 mt-1">⚠️ Information non disponible</p>` : ''}
                </label>
            `;
        });

        let infoMessage = "";
        if (lastDevisData && lastFactureData) {
            infoMessage = `
                <div class="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-check-circle text-green-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-green-700 mb-2">✅ Toutes les données disponibles</h4>
                            <p class="text-green-600">
                                Les informations sont importées depuis le devis et la facture MYHOUSE.
                                <br><strong>Devis:</strong> ${devisData.reference_devis || 'Non spécifié'}
                                <br><strong>Facture:</strong> ${factureData.reference_facture || 'Non spécifiée'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else if (lastDevisData && !lastFactureData) {
            infoMessage = `
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-yellow-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-yellow-700 mb-2">⚠️ Facture manquante</h4>
                            <p class="text-yellow-600 mb-2">
                                Le devis est disponible mais pas la facture.
                                <br><strong>Devis:</strong> ${devisData.reference_devis || 'Non spécifié'}
                            </p>
                            <button onclick="createMyhouseFactureFirst()" 
                                    class="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                                <i class="fas fa-file-invoice mr-1"></i>
                                Créer une facture MYHOUSE d'abord
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            infoMessage = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-circle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">❌ Données manquantes</h4>
                            <p class="text-red-600 mb-2">
                                Aucun devis ou facture MYHOUSE trouvé. Veuillez d'abord créer un devis.
                            </p>
                            <div class="flex gap-2">
                                <button onclick="createMyhouseDevisFirst()" 
                                        class="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-1"></i>
                                    Créer un devis MYHOUSE d'abord
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = infoMessage + container.innerHTML;

        container.innerHTML += `
            <div class="pt-4 border-t border-gray-200">
                <button type="button"
                    onclick="generateMyhouseAttestationRealisation()"
                    class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                    <i class="fas fa-file-certificate mr-2"></i>
                    📄 Générer l'Attestation de Réalisation MYHOUSE
                </button>
                <p class="text-xs text-gray-500 text-center mt-2">
                    Cliquez pour générer et télécharger l'attestation de réalisation
                </p>
            </div>
        `;

        document.getElementById('submitBtn').disabled = false;
        return;
    }

  if (type === "attestation_signataire") {
        document.getElementById("dynamic-form").classList.remove("hidden");

        const lastDevisData = localStorage.getItem("lastMyhouseDevisData");
        
        let devisData = {};
        
        if (lastDevisData) {
            try {
                devisData = JSON.parse(lastDevisData);
                console.log("Données du devis pour attestation signataire:", devisData);
            } catch (error) {
                console.error("Erreur parsing devis:", error);
            }
        }

        let infoMessage = "";
        if (lastDevisData) {
            infoMessage = `
                <div class="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-check-circle text-green-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-green-700 mb-2">✅ Données du devis disponibles</h4>
                            <p class="text-green-600">
                                Les informations sont importées depuis le devis MYHOUSE.
                                <br><strong>Devis:</strong> ${devisData.reference_devis || 'Non spécifié'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            infoMessage = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-circle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">❌ Devis manquant</h4>
                            <p class="text-red-600 mb-2">
                                Aucun devis MYHOUSE trouvé. Veuillez d'abord créer un devis.
                            </p>
                            <div class="flex gap-2">
                                <button onclick="createMyhouseDevisFirst()" 
                                        class="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-1"></i>
                                    Créer un devis MYHOUSE d'abord
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = infoMessage;

        myhouseFileForms[type].forEach(field => {
            const placeholder = field.example || "";
            let valueFromData = "";
            
            if (field.readonly) {
                valueFromData = devisData[field.name] || "";
            }
            
            const fieldValue = field.readonly ? valueFromData : "";
            
            container.innerHTML += `
                <label class="block mb-4">
                    <span class="text-gray-700 font-medium">
                        ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                        ${field.readonly ? '<span class="text-green-500 text-xs ml-2">(auto-rempli)</span>' : ''}
                    </span>
                    <input
                        type="${field.type || 'text'}"
                        name="${field.name}"
                        value="${fieldValue}"
                        placeholder="${placeholder}"
                        class="w-full mt-1 px-4 py-3 border-2 ${field.readonly ? 'border-green-200 bg-green-50 text-gray-600' : 'border-gray-300'} rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                        ${field.required ? 'required' : ''}
                        ${field.readonly ? 'readonly' : ''}
                    >
                    ${field.example && !field.readonly ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                    ${field.readonly && !valueFromData ? `<p class="text-xs text-yellow-500 mt-1">⚠️ Information non disponible</p>` : ''}
                </label>
            `;
        });

        container.innerHTML += `
            <div class="pt-4 border-t border-gray-200">
                <button type="button"
                    onclick="generateMyhouseAttestationSignataire()"
                    class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                    <i class="fas fa-file-signature mr-2"></i>
                    📄 Générer l'Attestation Signataire MYHOUSE
                </button>
                <p class="text-xs text-gray-500 text-center mt-2">
                    Cliquez pour générer et télécharger l'attestation signataire
                </p>
            </div>
        `;

        document.getElementById('submitBtn').disabled = false;
        return;
    }






    document.getElementById("dynamic-form").classList.remove("hidden");

    myhouseFileForms[type].forEach(field => {
        const placeholder = field.example || "";
        
        container.innerHTML += `
            <label class="block mb-4">
                <span class="text-gray-700 font-medium">
                    ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                </span>
                ${field.type === 'textarea' ? 
                    `<textarea
                        name="${field.name}"
                        placeholder="${placeholder}"
                        class="w-full mt-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                        rows="4"
                        ${field.required ? 'required' : ''}
                    ></textarea>` :
                    `<input
                        type="${field.type || 'text'}"
                        name="${field.name}"
                        placeholder="${placeholder}"
                        class="w-full mt-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                        ${field.required ? 'required' : ''}
                    >`
                }
                ${field.example ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
            </label>
        `;
    });

    container.innerHTML += `
        <div class="pt-4 border-t border-gray-200">
            <button type="button"
                onclick="generateMyhouseDocument('${type}')"
                class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                <i class="fas fa-file-pdf mr-2"></i>
                📄 Générer le document MYHOUSE
            </button>
            <p class="text-xs text-gray-500 text-center mt-2">
                Cliquez pour générer et télécharger le document MYHOUSE
            </p>
        </div>
    `;

    document.getElementById('submitBtn').disabled = false;
}



function createMyhouseDevisFirst() {
    document.querySelector('.file-option[data-value="devis"]').click();
}

async function generateMyhouseAttestationRealisation() {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        if (!formData.date_signature) {
            alert("❌ Veuillez saisir la date de signature.");
            return;
        }
        
        const lastDevisData = localStorage.getItem("lastMyhouseDevisData");
        const lastFactureData = localStorage.getItem("lastMyhouseFactureData");
        
        if (!lastDevisData) {
            alert("❌ Aucun devis MYHOUSE trouvé. Veuillez d'abord créer un devis.");
            return;
        }
        
        const devisData = JSON.parse(lastDevisData);
        const factureData = lastFactureData ? JSON.parse(lastFactureData) : {};
        
       
        const attestationData = {
            date_signature: formData.date_signature,
            
            adresse_travaux: devisData.adresse_travaux || "",
            nombre_logements: devisData.nombre_logements || "",
            puissance_nominale: devisData.puissance_nominale || "",
            nombre_emetteurs: devisData.nombre_emetteurs || "",
            volume_total: devisData.volume_total || "",
            // CORRECTION : Ces champs doivent provenir du devis, pas de valeurs par défaut
            zone_climatique: devisData.zone_climatique || "", // Doit être saisi dans le devis
            date_travaux: devisData.date_travaux || "", // Doit être saisi dans le devis
            nombre_batiments: devisData.nombre_batiments || "",
            details_batiment: devisData.details_batiment || "",
            
            reference_devis: devisData.reference_devis || "",
            date_devis: devisData.date_devis || "",
            date_facture: factureData.date_facture || "",
            
            nom_residence: devisData.nom_residence || "",
            parcelle_cadastrale: devisData.parcelle_cadastrale || "",
            numero_immatriculation: devisData.numero_immatriculation || "",
            prime_cee: devisData.prime_cee || "",
            total_ttc: devisData.total_ttc || ""
        };
        
        console.log("📊 Données de l'attestation de réalisation:", attestationData);
        
        await generateMyhousePdf(attestationData, 'attestation_realisation');
        
        alert("✅ Attestation de réalisation MYHOUSE générée avec succès !\n" +
              `Devis: ${attestationData.reference_devis || 'Non spécifié'}\n` +
              `Date signature: ${attestationData.date_signature || 'Non spécifiée'}`);
        
    } catch (error) {
        console.error("Erreur attestation réalisation MYHOUSE:", error);
        alert("❌ Erreur lors de la génération de l'attestation de réalisation MYHOUSE.");
    }
}




async function generateMyhouseAttestationSignataire() {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        if (!formData.date_signature) {
            alert("❌ Veuillez saisir la date de signature.");
            return;
        }
        
        const lastDevisData = localStorage.getItem("lastMyhouseDevisData");
        
        if (!lastDevisData) {
            alert("❌ Aucun devis MYHOUSE trouvé. Veuillez d'abord créer un devis.");
            return;
        }
        
        const devisData = JSON.parse(lastDevisData);
        
        const attestationData = {
            date_signature: formData.date_signature,
            
            nom_residence: devisData.nom_residence || "",
            adresse_travaux: devisData.adresse_travaux || "",
            numero_immatriculation: devisData.numero_immatriculation || "",
            
  
        };
        
        console.log("📊 Données de l'attestation signataire:", attestationData);
        
        await generateMyhousePdf(attestationData, 'attestation_signataire');
        
        alert("✅ Attestation signataire MYHOUSE générée avec succès !\n" +
              `Résidence: ${attestationData.nom_residence || 'Non spécifiée'}\n` +
              `Date signature: ${attestationData.date_signature || 'Non spécifiée'}`);
        
    } catch (error) {
        console.error("Erreur attestation signataire MYHOUSE:", error);
        alert("❌ Erreur lors de la génération de l'attestation signataire MYHOUSE.");
    }
}






async function generateMyhouseDocument(type) {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input, #dynamic-fields textarea").forEach(input => {
            formData[input.name] = input.value;
        });
        
        if (type === 'devis') {
            localStorage.setItem("lastMyhouseDevisData", JSON.stringify(formData));
            console.log("✅ Devis MYHOUSE sauvegardé:", formData);
        } else if (type === 'facture') {
            localStorage.setItem("lastMyhouseFactureData", JSON.stringify(formData));
            console.log("✅ Facture MYHOUSE sauvegardée:", formData);
        }
        
        if (type === 'attestation_signataire') {
            await generateMyhouseAttestationSignataire();
            return;
        }
        
        if (type === 'attestation_realisation') {
            await generateMyhouseAttestationRealisation();
            return;
        }
        
        await generateMyhousePdf(formData, type);
        
        let message = '';
        switch(type) {
            case 'devis':
                message = "✅ Devis MYHOUSE généré et sauvegardé !";
                setTimeout(() => {
                    const makeFacture = confirm("Voulez-vous créer une facture MYHOUSE maintenant avec ces mêmes données ?");
                    if (makeFacture) {
                        document.querySelector('.file-option[data-value="facture"]').click();
                    }
                }, 500);
                break;
            case 'facture':
                message = "✅ Facture MYHOUSE générée et sauvegardée !";
                setTimeout(() => {
                    const makeAttestation = confirm("Voulez-vous créer une attestation de réalisation maintenant avec ces données ?");
                    if (makeAttestation) {
                        document.querySelector('.file-option[data-value="attestation_realisation"]').click();
                    }
                }, 500);
                break;
            case 'attestation_signataire':
                message = "✅ Attestation signataire MYHOUSE générée avec succès !";
                break;
            case 'attestation_realisation':
                message = "✅ Attestation de réalisation MYHOUSE générée avec succès !";
                break;
            case 'rapport':
                message = "✅ Rapport MYHOUSE généré avec succès !";
                break;
            default:
                message = "✅ Document MYHOUSE généré avec succès !";
        }
        
        alert(message);
        
    } catch (error) {
        console.error("Erreur MYHOUSE:", error);
        alert("❌ Erreur lors de la génération du document MYHOUSE.");
    }
}

async function generateMyhouseFacture() {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        const lastDevisData = localStorage.getItem("lastMyhouseDevisData");
        if (!lastDevisData) {
            alert("❌ Aucun devis MYHOUSE trouvé. Veuillez d'abord créer un devis.");
            return;
        }
        
        const devisData = JSON.parse(lastDevisData);
        
        let referenceFacture = "";
        if (devisData.reference_devis) {
            referenceFacture = devisData.reference_devis.replace('DEV', 'FAC');
        } else {
            referenceFacture = `MH-FAC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
        }
        
        const factureData = {
            ...devisData,
            
            date_facture: formData.date_facture,
            reference_facture: referenceFacture,
            reference_devis: devisData.reference_devis || "",
            
            conditions_paiement: "30 jours net",
            mode_paiement: "Virement bancaire"
        };
        
      console.log("📊 Données de la facture:", factureData);
        
        localStorage.setItem("lastMyhouseFactureData", JSON.stringify(factureData));
        
        await generateMyhousePdf(factureData, 'facture');
        
        alert("✅ Facture MYHOUSE générée et sauvegardée !\n" +
              `Référence: ${referenceFacture}\n` +
              `Basée sur le devis: ${devisData.reference_devis || 'Non spécifié'}\n\n` +
              `La facture est maintenant sauvegardée pour générer un rapport.`);
        
    } catch (error) {
        console.error("Erreur facture MYHOUSE:", error);
        alert("❌ Erreur lors de la génération de la facture MYHOUSE.");
    }
}

async function generateMyhouseRapport() {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        const lastFactureData = localStorage.getItem("lastMyhouseFactureData");
        if (!lastFactureData) {
            alert("❌ Aucune facture MYHOUSE trouvée. Veuillez d'abord créer une facture.");
            return;
        }
        
        const factureData = JSON.parse(lastFactureData);
        
        if (!formData.adresse_travaux_1 || !formData.boite_postale_1) {
            alert("❌ Veuillez remplir les champs requis du rapport (adresse ligne 1 et boîte postale ligne 1).");
            return;
        }
        
        let referenceRapport = "";
        if (factureData.reference_facture) {
            referenceRapport = factureData.reference_facture.replace('FAC', 'RAP');
        } else {
            referenceRapport = `MH-RAP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
        }
        
        const rapportData = {
            reference_facture: factureData.reference_facture || "",
            date_facture: factureData.date_facture || "",
            puissance_nominale: factureData.puissance_nominale || "",
            nombre_emetteurs: factureData.nombre_emetteurs || "",
            volume_total: factureData.volume_total || "",
            reference_devis: factureData.reference_devis || "",
            adresse_travaux: factureData.adresse_travaux || "",
            nom_residence: factureData.nom_residence || "",
            prime_cee: factureData.prime_cee || "",
            total_ttc: factureData.total_ttc || "",
            
            ...formData,
            
            reference_rapport: referenceRapport,
            date_rapport: factureData.date_facture || new Date().toISOString().split('T')[0]
        };
        
        console.log("📊 Données du rapport MYHOUSE:", rapportData);
        
        await generateMyhousePdf(rapportData, 'rapport');
        
        alert("✅ Rapport MYHOUSE généré avec succès !\n" +
              `Référence: ${referenceRapport}\n` +
              `Basé sur la facture: ${factureData.reference_facture || 'Non spécifiée'}\n` +
              `Date: ${rapportData.date_rapport || 'Non spécifiée'}`);
        
    } catch (error) {
        console.error("Erreur rapport MYHOUSE:", error);
        alert("❌ Erreur lors de la génération du rapport MYHOUSE.");
    }
}



async function generateMyhouseCdc() {
    try {
        // Récupérer les données du devis depuis localStorage
        const lastDevisData = localStorage.getItem("lastMyhouseDevisData");
        if (!lastDevisData) {
            alert("❌ Aucun devis MYHOUSE trouvé. Veuillez d'abord créer un devis.");
            return;
        }
        
        const devisData = JSON.parse(lastDevisData);
        
        // Créer les données du CDC (juste les données du devis, pas de formulaire)
        const cdcData = {
            // Champs importés du devis
            'prime_cee': devisData.prime_cee || "",
            'date_devis': devisData.date_devis || "",
          
            
            // Pour le mapping des duplications dans le CDC
           
            'date_cdc': devisData.date_devis || "",
            'date_cdc_dup': devisData.date_devis || "",
            
           
        };
        
        console.log("📊 Données du CDC MYHOUSE:", cdcData);
        console.log("📍 Prime CEE:", cdcData.prime_cee);
        console.log("📍 Date (position 1):", cdcData.date_cdc);
        console.log("📍 Date (position 2 - dupliquée):", cdcData.date_cdc_dup);
        
        // Générer le PDF
        await generateMyhousePdf(cdcData, 'cdc');
        
        alert("✅ Cahier des Charges MYHOUSE généré avec succès !\n" +
              `Devis de référence: ${devisData.reference_devis || 'Non spécifié'}\n` +
              `Prime CEE importée: ${devisData.prime_cee || 'Non spécifiée'}\n` +
              `Date dupliquée en 2 positions`);
        
    } catch (error) {
        console.error("Erreur CDC MYHOUSE:", error);
        alert("❌ Erreur lors de la génération du Cahier des Charges MYHOUSE.");
    }
}



async function generateMyhousePdf(formData, type) {
    // OPTIMISATION : Validation préalable
    if (!formData || typeof formData !== 'object') {
        console.error("❌ Données MYHOUSE invalides");
        alert("❌ Les données du formulaire sont invalides.");
        return;
    }
    
    // Valider les dates
    Object.keys(formData).forEach(key => {
        if (key.includes('date') && formData[key]) {
            // Vérifier que la date n'est pas en 5256 (erreur dans vos logs)
            const year = formData[key].split('-')[0];
            if (year && parseInt(year) > 2100) {
                console.warn(`⚠️ Date suspecte détectée pour ${key}: ${formData[key]}`);
                // Corriger automatiquement ou demander à l'utilisateur
            }
        }
    });
    
    const myhousePdfMap = {
    attestation_signataire: "PDFS/attestation_signataire.pdf",
    attestation_realisation: "PDFS/attestation_realisation.pdf",
    devis: "PDFS/myhouse_devis.pdf",
    facture: "PDFS/myhouse_facture.pdf",
    cdc: "PDFS/myhouse_cdc.pdf",
    rapport: "PDFS/myhouse_rapport.pdf"
};

    if (!myhousePdfMap[type]) {
        alert("Type de document MYHOUSE non supporté.");
        return;
    }

    try {
        const existingPdf = await fetch(myhousePdfMap[type]).then(res => res.arrayBuffer());
        const { PDFDocument, StandardFonts, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.load(existingPdf); // Déclaré ici
        const pages = pdfDoc.getPages();

        const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const coords = myhousePdfCoordinates[type];
        if (!coords) {
            console.error(`Coordonnées MYHOUSE non définies pour ${type}`);
            alert(`❌ Pas de coordonnées définies pour ${type} MYHOUSE`);
            return;
        }

        console.log(`=== GÉNÉRATION MYHOUSE ${type.toUpperCase()} ===`);
        console.log("Données MYHOUSE:", formData);

        pages.forEach((page, index) => {
            const pageKey = `page${index + 1}`;
            
            if (coords[pageKey]) {
                Object.entries(coords[pageKey]).forEach(([fieldName, coord]) => {
                 let value = getFieldValue(fieldName, formData);
                    
                    if (fieldName.includes("date")) {
                        value = formatDateFR(value);
                    }

                    if (value && value.trim() !== "") {
                        const font = coord.bold ? fontBold : fontNormal;
                        
                        let color;
                        switch(coord.color) {
                            case 'white':
                                color = rgb(1, 1, 1);
                                break;
                            case 'dark_green':
                                color = rgb(0, 0.4, 0.2);
                                case 'olive_green':
                                color = rgb(0.45, 0.50, 0.19);  // Vert olive foncé comme "Reste à payer"
                                break;
                            
                            case 'black':
                            default:
                                color = rgb(0, 0, 0);
                        }
                        
                        console.log(`Écriture MYHOUSE ${type} - ${fieldName}: "${value}" à (${coord.x}, ${coord.y})`);
                        
                        try {
                            page.drawText(value, {
                                x: coord.x,
                                y: coord.y,
                                size: coord.size,
                                font: font,
                                color: color
                            });
                        } catch (error) {
                            console.error(`Erreur écriture MYHOUSE ${fieldName}:`, error);
                        }
                    }
                });
            }
            
          
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        
        const fileName = `myhouse_${type}_${formData.reference_devis || formData.reference_facture || Date.now()}.pdf`;
        link.download = fileName;
        link.click();
        
        console.log(`✅ MYHOUSE ${type.toUpperCase()} généré: ${fileName}`);
        return true;

    } catch (error) {
        console.error("❌ Erreur PDF MYHOUSE:", error);
        alert(`❌ Erreur lors de la génération du document MYHOUSE ${type}.`);
        throw error;
    }
}

const myhousePdfCoordinates = {
    devis: {
        page1: {
            reference_devis: { x: 163, y: 767, size: 13, color: 'white', bold: true },
            date_devis: { x: 49, y: 752, size: 9, color: 'black' },
            adresse_travaux: { x: 20, y: 735, size: 7, color: 'black' },
            parcelle_cadastrale: { x: 135, y: 726, size: 7, color: 'black' },
            numero_immatriculation: { x: 100, y: 717, size: 7, color: 'black' },
            nombre_batiments: { x: 100, y: 708, size: 7, color: 'black' },
            details_batiment: { x: 94, y: 699, size: 7, color: 'black' },
            nom_residence: { x: 106, y: 690, size: 7, color: 'black' },
            date_travaux: { x: 90, y: 680, size: 7, color: 'black' },
            nombre_logements: { x: 390, y: 483, size: 8, color: 'red', bold: false }, 
            nombre_logements_dup: { x: 140, y: 459, size: 8, color: 'red', bold: false }, 
            montant_cumac: { x: 70, y: 540, size: 7, color: 'black' },
            prime_cee: { x: 66, y: 527, size: 7, color: 'black' },
            prime_cee_dup: { x: 438, y: 483, size: 7, color: 'black' },
            prime_cee_dup2: { x: 492, y: 483, size: 7, color: 'black' },
            puissance_nominale: { x: 150, y: 470, size: 7, color: 'black' },
            nombre_emetteurs: { x: 145, y: 447, size:7, color: 'black' },
            volume_total: { x: 106, y: 423, size: 7, color: 'black' },
          
            
        },
        page2: {
            reference_devis: { x: 178, y: 756, size: 13, color: 'white', bold: true },
           
        },
        page3: {
            reference_devis: { x: 163, y: 706, size: 12, color: 'white', bold: true },
            prime_cee: { x: 530, y: 158, size: 7, color: 'black' },
            prime_cee_dup: { x: 525,y: 124, size: 8, color: 'black' },
            prime_cee_page3_dup3: { x: 175, y: 230, size: 7, color: 'black' },
            total_tva: { x: 530, y: 146, size: 8, color: 'black' },
            total_tva_dup: { x: 529, y: 112, size: 8, color: 'olive_green' , bold: true },
            total_ttc: { x: 526, y: 135, size: 8, color: 'black', bold: true },
        }
    },
    facture: {
       page1: {
            reference_devis: { x: 163, y: 767, size: 13, color: 'white', bold: true },
            date_devis: { x: 49, y: 752, size: 9, color: 'black' },
            adresse_travaux: { x: 20, y: 735, size: 7, color: 'black' },
            parcelle_cadastrale: { x: 135, y: 726, size: 7, color: 'black' },
            numero_immatriculation: { x: 100, y: 717, size: 7, color: 'black' },
            nombre_batiments: { x: 100, y: 708, size: 7, color: 'black' },
            details_batiment: { x: 94, y: 699, size: 7, color: 'black' },
            nom_residence: { x: 106, y: 690, size: 7, color: 'black' },
            date_travaux: { x: 90, y: 680, size: 7, color: 'black' },
            nombre_logements: { x: 390, y: 483, size: 8, color: 'red', bold: false }, 
            nombre_logements_dup: { x: 140, y: 459, size: 8, color: 'red', bold: false }, 
            montant_cumac: { x: 70, y: 540, size: 7, color: 'black' },
            prime_cee: { x: 66, y: 527, size: 7, color: 'black' },
            prime_cee_dup: { x: 438, y: 483, size: 7, color: 'black' },
            prime_cee_dup2: { x: 492, y: 483, size: 7, color: 'black' },
            puissance_nominale: { x: 150, y: 470, size: 7, color: 'black' },
            nombre_emetteurs: { x: 145, y: 447, size:7, color: 'black' },
            volume_total: { x: 106, y: 423, size: 7, color: 'black' },
          
            
        },
        page2: {
            reference_devis: { x: 178, y: 756, size: 13, color: 'white', bold: true },
           
        },
        page3: {
            reference_devis: { x: 163, y: 706, size: 12, color: 'white', bold: true },
            prime_cee: { x: 530, y: 158, size: 7, color: 'black' },
            prime_cee_dup: { x: 525,y: 124, size: 8, color: 'black' },
            prime_cee_page3_dup3: { x: 175, y: 230, size: 7, color: 'black' },
            total_tva: { x: 530, y: 146, size: 8, color: 'black' },
            total_tva_dup: { x: 529, y: 112, size: 8, color: 'olive_green' , bold: true },
            total_ttc: { x: 526, y: 135, size: 8, color: 'black', bold: true },
        }
    },
    attestation_signataire: {
        page1: {
            nom_residence: { x: 198, y: 521, size: 10, color: PDFColors.BLACK, bold: true },
            adresse_travaux: { x: 88, y: 507, size: 10, color: PDFColors.BLACK, bold: true },
            numero_immatriculation: { x: 228, y: 492, size: 10, color: PDFColors.BLACK, bold: true },
            date_signature: { x: 170, y: 375, size: 8, color: PDFColors.BLACK, bold: true }
            
        }
    },
     attestation_realisation: {
        page1: {
            adresse_travaux: { x: 188, y: 446, size: 7, color: 'black' },
            nombre_logements: { x: 187, y: 420, size: 7, color: 'black' },
            puissance_nominale: { x: 187, y: 400, size: 7, color: 'black' },
            nombre_emetteurs: { x: 187, y: 388, size: 7, color: 'black' },
            volume_total: { x: 187, y: 368, size: 6, color: 'black' },
            zone_climatique: { x: 187, y: 358, size: 7, color: 'black' },
            date_travaux: { x: 199, y: 345, size: 7, color: 'black' },
            nombre_batiments: { x: 187, y: 319, size: 7, color: 'black' },
            details_batiment: { x: 187, y: 306, size: 7, color: 'black' },
           
        },
        
        page2: {
            reference_devis: { x: 230, y: 469, size: 7, color: 'black', bold: true },
            date_devis: { x: 260, y: 469, size: 7, color: 'black',bold: true },
            date_facture: { x: 390, y: 398, size: 7, color: 'black' },
        }
    },
    cdc: {
        page1: {
           
            'prime_cee_cdc': { x: 194, y: 675, size: 8, color: 'light_blue', bold: true },
            
           
            'date_cdc': { x: 328, y: 371, size: 9, color: 'red' },
            
           
            'date_cdc_dup': { x: 149, y: 196, size: 8, color: 'black' },
        }
    },
    rapport: {
        page1: {
  
            date_rapport: { x: 412, y: 728, size: 8, color: 'black' },
            reference_facture: { x: 472, y: 707, size: 8, color: 'black' },
          
            
            puissance_nominale: { x: 245, y: 401, size: 9, color: 'black' },
            nombre_emetteurs: { x: 375, y: 510, size: 9, color: 'black' },
            volume_total: { x: 367, y: 402, size: 9, color: 'black' },
           
            
            adresse_travaux_1: { x: 9, y: 740, size: 7, color: 'black' },
            boite_postale_1: { x: 9, y: 710, size: 7, color: 'black' },
            adresse_travaux_2: { x: 9, y: 725, size: 7, color: 'black' },
        }
    }
};
function formatDateFR(dateValue) {
    if (!dateValue) return "";
    
    if (dateValue.includes("-")) {
        const [y, m, d] = dateValue.split("-");
        return `${d}/${m}/${y}`;
    }
    
    if (dateValue.includes("/")) {
        return dateValue;
    }
    
    return dateValue;
}

document.addEventListener('DOMContentLoaded', function() {
    const lastDossier = localStorage.getItem("currentDossier");
    if (lastDossier === 'myhouse') {
    }
    
    const originalFormSubmit = window.handleFormSubmit;
    
    if (document.querySelector('form')) {
        document.querySelector('form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (window.selectedDossier === 'myhouse') {
                if (!myhouseSelectedFileType) {
                    alert('Veuillez sélectionner un type de fichier MYHOUSE.');
                    return;
                }
                
                return;
            }
        });
    }
    
    console.log("✅ Module MYHOUSE chargé avec succès");
});

async function generateMyhouseFromDynamicForm(type) {
    await generateMyhouseDocument(type);
}

async function generateMyhousePdf(formData, type) {
    try {
        console.time(`Génération PDF MYHOUSE ${type}`);
        
        // ... votre code existant ...
        
        console.timeEnd(`Génération PDF MYHOUSE ${type}`);
        
    } catch (error) {
        console.timeEnd(`Génération PDF MYHOUSE ${type}`);
        throw error;
    }
}