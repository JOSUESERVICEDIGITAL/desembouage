
let selectedDossier = '';
let selectedFileType = '';

function selectDossier(dossier) {
    selectedDossier = dossier;
    
    // UNIQUEMENT gérer ENERGINOVA
    if (dossier === 'energinova') {
        // Logique ENERGINOVA
        document.getElementById('selected-dossier-text').textContent = 'ENERGINOVA - Dossier énergie & innovation';
        document.getElementById('form-subtitle').textContent = 'Choisissez le document à ajouter à votre dossier ENERGINOVA';
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('step2').classList.add('fade-in');
            
            document.getElementById('backBtn').classList.remove('hidden');
            document.getElementById('submit-text').textContent = 'Ajouter le fichier';
            document.getElementById('help-text').textContent = 'Sélectionnez le type de fichier que vous souhaitez ajouter à votre dossier. Vous pourrez ensuite télécharger le document correspondant.';
            
            document.getElementById('submitBtn').disabled = true;
        }
        // Si c'est MYHOUSE, NE RIEN FAIRE ici
    }

    // ... toutes les autres fonctions ENERGINOVA


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

document.addEventListener('DOMContentLoaded', function() {
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
    
    const select = document.getElementById('dossier_type');
    select.addEventListener('change', function() {
        if (this.value) {
            selectDossier(this.value);
        }
    });
    
    document.getElementById('cancelBtn').addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les sélections seront perdues.')) {
            goBackToStep1();
        }
    });
    
    // FORM SUBMIT MODIFIÉ
    document.querySelector('form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!selectedDossier) {
            alert('Veuillez sélectionner un type de dossier.');
            return;
        }
        
        if (!selectedFileType) {
            alert('Veuillez sélectionner un type de fichier.');
            return;
        }
        
        if (selectedFileType === 'facture' || selectedFileType === 'rapport') {
            // Pour la facture et le rapport, on ne fait rien ici, c'est géré par les boutons spécifiques
            return;
        }
        
        // Pour les autres types, on génère le PDF
        try {
            const formData = {};
            document.querySelectorAll("#dynamic-fields input").forEach(input => {
                formData[input.name] = input.value;
            });
            
            if (selectedFileType === 'devis') {
                // SAUVEGARDER LE DEVIS POUR LA FACTURE
                localStorage.setItem("lastDevisData", JSON.stringify(formData));
                console.log("✅ Devis sauvegardé pour facture:", formData);
                
                // Générer le PDF de devis
                await generatePdfWithPdfLib(formData, 'devis');
                
                alert(`✅ Devis généré avec succès !\n\nLes données sont sauvegardées pour la facture.`);
                
                setTimeout(() => {
                    const generateFactureNow = confirm("Voulez-vous générer une facture maintenant avec les mêmes informations ?");
                    
                    if (generateFactureNow) {
                        document.querySelector('.file-option[data-value="facture"]').click();
                    } else {
                        goBackToStep1();
                    }
                }, 500);
                
            } else {
                // Pour les attestations
                await generatePdfWithPdfLib(formData, selectedFileType);
                alert(`✅ Document généré avec succès !`);
                setTimeout(() => goBackToStep1(), 2000);
            }
            
        } catch (error) {
            console.error("Erreur:", error);
            alert("❌ Erreur lors de la génération du PDF.");
        }
    });
    
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
});

function clearFileSelection() {
    selectedFileType = '';
    document.getElementById('selected_file_type').value = '';
    document.getElementById('selected-file-indicator').classList.add('hidden');
    document.getElementById('submitBtn').disabled = true;
    
    document.querySelectorAll('.file-option').forEach(option => {
        option.classList.remove('border-blue-500', 'bg-blue-50');
        option.classList.add('border-gray-200');
    });
    
    document.getElementById("dynamic-form").classList.add("hidden");
}

const fileForms = {
    attestation_signataire: [
        { name: "residence_nom", label: "Nom de la résidence / bâtiment", required: true },
        { name: "adresse_batiment", label: "Adresse du bâtiment", required: true },
        { name: "numero_immatriculation", label: "Numéro d'immatriculation", required: true },
        { name: "date_fait", label: "Date du document", type: "date", required: true },
    ],

    attestation_realisation: [
        // Champs qui doivent être remplis manuellement
        { name: "date_signature", label: "Date de signature", type: "date", required: true, example: "07/10/2025" },
        { name: "nombre_logements", label: "Nombre de logements", required: true, example: "139" },
        
        // Champs qui seront automatiquement remplis depuis le devis (en lecture seule)
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
        { name: "parcelle_1", label: "Parcelle cadastrale 1", required: true, example: "000 0T 001" },
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

    document.getElementById("dynamic-form").classList.add("hidden");

    // CAS SPÉCIAL : CDC (même logique que facture)
    if (type === "cdc") {
        const lastDevisData = localStorage.getItem("lastDevisData");

        if (!lastDevisData) {
            container.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">Devis requis !</h4>
                            <p class="text-red-600 mb-3">
                                Vous devez d'abord générer un devis avant de pouvoir créer un Cahier des Charges.
                            </p>
                            <div class="flex gap-3">
                                <button onclick="createDevisFirst()"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-2"></i>
                                    Créer un devis d'abord
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
        

        let parsedData;
        try {
            parsedData = JSON.parse(lastDevisData);
            
            container.innerHTML = `
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-file-contract text-blue-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-blue-700 mb-2">Cahier des Charges prêt !</h4>
                            <p class="text-blue-600 mb-3">
                                Votre CDC peut être généré automatiquement à partir du devis existant.
                                <br><small class="text-blue-500">Les informations du devis seront utilisées.</small>
                            </p>
                            <div class="mb-4 p-3 bg-white rounded-lg border">
                                <p class="font-medium text-gray-800 mb-2">Informations du devis :</p>
                                <div class="grid grid-cols-2 gap-2 text-sm">
                                    <div class="text-gray-600">Référence:</div>
                                    <div class="font-medium">${parsedData.reference_devis || 'Non spécifié'}</div>
                                    <div class="text-gray-600">Date:</div>
                                    <div class="font-medium">${parsedData.date_devis || 'Non spécifié'}</div>
                                    <div class="text-gray-600">Adresse:</div>
                                    <div class="font-medium">${parsedData.adresse_travaux || 'Non spécifié'}</div>
                                    <div class="text-gray-600">Prime CEE:</div>
                                    <div class="font-medium">${parsedData.prime_cee || 'Non spécifié'}</div>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <button onclick="generateCdcFromDevis()"
                                    class="px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold">
                                    <i class="fas fa-file-contract mr-2"></i>
                                    📄 Télécharger le Cahier des Charges
                                </button>
                                <button onclick="goBackToStep1()"
                                    class="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                                    <i class="fas fa-times mr-2"></i>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("dynamic-form").classList.remove("hidden");
            document.getElementById('submitBtn').disabled = true;

        } catch (error) {
            console.error("Erreur données:", error);
            container.innerHTML = `<p class="text-red-600">Erreur de données. Veuillez recréer un devis.</p>`;
            document.getElementById("dynamic-form").classList.remove("hidden");
        }
        return;
    }

    // CAS SPÉCIAL : FACTURE
    if (type === "facture") {
        const lastDevisData = localStorage.getItem("lastDevisData");

        if (!lastDevisData) {
            container.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">Devis requis !</h4>
                            <p class="text-red-600 mb-3">
                                Vous devez d'abord générer un devis avant de pouvoir créer une facture.
                            </p>
                            <div class="flex gap-3">
                                <button onclick="createDevisFirst()"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-2"></i>
                                    Créer un devis d'abord
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

        let parsedData;
        try {
            parsedData = JSON.parse(lastDevisData);
            
            // Créer le formulaire avec un seul champ pour la date
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
                        >
                        ${field.example ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                    </label>
                `;
            });

            // Ajouter un aperçu des données du devis
            container.innerHTML += `
                <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div class="flex items-start gap-2">
                        <i class="fas fa-info-circle text-blue-500 mt-1"></i>
                        <div>
                            <p class="text-sm text-blue-700 mb-2">
                                <strong>Les autres informations seront automatiquement remplies depuis le devis :</strong>
                            </p>
                            <div class="grid grid-cols-2 gap-2 text-sm bg-white p-2 rounded">
                                <div class="text-gray-600">Référence:</div>
                                <div class="font-medium">${parsedData.reference_devis || 'Non spécifié'}</div>
                                <div class="text-gray-600">Date devis:</div>
                                <div class="font-medium">${parsedData.date_devis || 'Non spécifié'}</div>
                                <div class="text-gray-600">Montant TTC:</div>
                                <div class="font-medium">${parsedData.montant_ttc || 'Non spécifié'}</div>
                                <div class="text-gray-600">Adresse:</div>
                                <div class="font-medium">${parsedData.adresse_travaux || 'Non spécifié'}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="pt-4 border-t border-gray-200">
                    <button type="button"
                        onclick="generateFactureWithDate()"
                        class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                        <i class="fas fa-file-pdf mr-2"></i>
                        📄 Télécharger la facture
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-2">
                        Cliquez pour générer la facture avec la date spécifiée
                    </p>
                </div>
            `;

            document.getElementById("dynamic-form").classList.remove("hidden");
            document.getElementById('submitBtn').disabled = true;

        } catch (error) {
            console.error("Erreur données:", error);
            container.innerHTML = `<p class="text-red-600">Erreur de données. Veuillez recréer un devis.</p>`;
            document.getElementById("dynamic-form").classList.remove("hidden");
        }
        return;
    }

    // CAS SPÉCIAL : RAPPORT
    if (type === "rapport") {
        const lastDevisData = localStorage.getItem("lastDevisData");

        if (!lastDevisData) {
            container.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-red-700 mb-2">Devis requis !</h4>
                            <p class="text-red-600 mb-3">
                                Vous devez d'abord générer un devis avant de pouvoir créer un rapport.
                            </p>
                            <div class="flex gap-3">
                                <button onclick="createDevisFirst()"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    <i class="fas fa-file-invoice-dollar mr-2"></i>
                                    Créer un devis d'abord
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

        let parsedData;
        try {
            parsedData = JSON.parse(lastDevisData);
            
            // Afficher d'abord les données automatiques (non modifiables)
            container.innerHTML = `
                <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-info-circle text-blue-600 text-xl mt-1"></i>
                        <div>
                            <h4 class="font-bold text-blue-700 mb-2">Informations automatiques</h4>
                            <p class="text-blue-600 mb-3">
                                Ces informations sont automatiquement récupérées depuis le devis/facture :
                            </p>
                            <div class="grid grid-cols-2 gap-3 text-sm bg-white p-3 rounded-lg border">
                                <div class="text-gray-600">Date facture:</div>
                                <div class="font-medium">${parsedData.date_devis || 'Non spécifié'}</div>
                                <div class="text-gray-600">Référence:</div>
                                <div class="font-medium">${parsedData.reference_devis || 'Non spécifié'}</div>
                                <div class="text-gray-600">Puissance nominale:</div>
                                <div class="font-medium">${parsedData.puissance_chaudiere || 'Non spécifié'}</div>
                                <div class="text-gray-600">Nombre d'émetteurs:</div>
                                <div class="font-medium">${parsedData.nombre_emetteurs || 'Non spécifié'}</div>
                                <div class="text-gray-600">Volume circuit:</div>
                                <div class="font-medium">${parsedData.volume_circuit || 'Non spécifié'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Ajouter les champs du formulaire (modifiables)
            fileForms[type].forEach(field => {
                container.innerHTML += `
                    <label class="block mb-4">
                        <span class="text-gray-700 font-medium">
                            ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                        </span>
                        <input
                            type="text"
                            name="${field.name}"
                            class="w-full mt-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                            ${field.required ? 'required' : ''}
                            placeholder="${field.name.includes('adresse') ? 'Ex: 123 Rue Principale' : 'Ex: BP 1234, Zone Industrielle'}"
                        >
                        ${!field.required ? `<p class="text-xs text-gray-500 mt-1">Champ facultatif</p>` : ''}
                    </label>
                `;
            });

            // Bouton de génération
            container.innerHTML += `
                <div class="pt-4 border-t border-gray-200">
                    <button type="button"
                        onclick="generateRapport()"
                        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                        <i class="fas fa-file-alt mr-2"></i>
                        📄 Générer le Rapport
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-2">
                        Cliquez pour générer le rapport avec toutes les informations
                    </p>
                </div>
            `;

            document.getElementById("dynamic-form").classList.remove("hidden");
            document.getElementById('submitBtn').disabled = true;

        } catch (error) {
            console.error("Erreur données:", error);
            container.innerHTML = `<p class="text-red-600">Erreur de données. Veuillez recréer un devis.</p>`;
            document.getElementById("dynamic-form").classList.remove("hidden");
        }
        return;
    }

    // CAS SPÉCIAL : ATTESTATION DE RÉALISATION
    if (type === "attestation_realisation") {
        document.getElementById("dynamic-form").classList.remove("hidden");

        // Vérifier s'il y a un devis existant
        const lastDevisData = localStorage.getItem("lastDevisData");
        let devisData = {};
        
        if (lastDevisData) {
            try {
                devisData = JSON.parse(lastDevisData);
                console.log("Données du devis pour attestation:", devisData);
            } catch (error) {
                console.error("Erreur parsing devis:", error);
            }
        }

        // Créer les champs du formulaire
        fileForms[type].forEach(field => {
            const placeholder = field.example || "";
            const valueFromDevis = devisData[field.name] || "";
            
            // Déterminer si le champ doit être en lecture seule
            const isReadOnly = field.readonly;
            const fieldValue = isReadOnly ? valueFromDevis : "";
            
            container.innerHTML += `
                <label class="block mb-4">
                    <span class="text-gray-700 font-medium">
                        ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                        ${isReadOnly ? '<span class="text-blue-500 text-xs ml-2">(auto-rempli depuis le devis)</span>' : ''}
                    </span>
                    <input
                        type="${field.type || 'text'}"
                        name="${field.name}"
                        value="${fieldValue}"
                        placeholder="${placeholder}"
                        class="w-full mt-1 px-4 py-3 border-2 ${isReadOnly ? 'border-blue-200 bg-blue-50 text-gray-600' : 'border-gray-300'} rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        ${field.required ? 'required' : ''}
                        ${isReadOnly ? 'readonly' : ''}
                    >
                    ${field.example && !isReadOnly ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                    ${isReadOnly && !valueFromDevis ? `<p class="text-xs text-yellow-500 mt-1">⚠️ Aucun devis trouvé. Veuillez d'abord créer un devis.</p>` : ''}
                </label>
            `;
        });

        // Ajouter un message d'information
        if (lastDevisData) {
            container.innerHTML += `
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <div class="flex items-start gap-2">
                        <i class="fas fa-info-circle text-blue-500 mt-1"></i>
                        <div>
                            <p class="text-sm text-blue-700">
                                <strong>Information :</strong> Les champs en bleu sont automatiquement remplis depuis le devis existant.
                                <br>Référence du devis : <strong>${devisData.reference_devis || 'Non spécifié'}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML += `
                <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <div class="flex items-start gap-2">
                        <i class="fas fa-exclamation-triangle text-yellow-500 mt-1"></i>
                        <div>
                            <p class="text-sm text-yellow-700">
                                <strong>Attention :</strong> Aucun devis trouvé. Les champs ne pourront pas être automatiquement remplis.
                                <br>Vous pouvez quand même créer l'attestation, mais vous devrez remplir tous les champs manuellement.
                            </p>
                            <button onclick="createDevisFirst()" 
                                    class="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                                <i class="fas fa-file-invoice-dollar mr-1"></i>
                                Créer un devis d'abord
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Bouton de génération
        container.innerHTML += `
            <div class="pt-4 border-t border-gray-200">
                <button type="button"
                    onclick="generateFromDynamicForm('${type}')"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                    <i class="fas fa-file-pdf mr-2"></i>
                    Générer l'Attestation
                </button>
                <p class="text-xs text-gray-500 text-center mt-2">
                    Cliquez pour générer et télécharger l'attestation de réalisation
                </p>
            </div>
        `;

        document.getElementById('submitBtn').disabled = false;
        return;
    }

    // CAS SPÉCIAL : ATTESTATION SIGNATAIRE
    if (type === "attestation_signataire") {
        document.getElementById("dynamic-form").classList.remove("hidden");

        // Créer les champs du formulaire
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
                    >
                    ${field.example ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                </label>
            `;
        });

        // Bouton de génération
        container.innerHTML += `
            <div class="pt-4 border-t border-gray-200">
                <button type="button"
                    onclick="generateFromDynamicForm('${type}')"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                    <i class="fas fa-file-pdf mr-2"></i>
                    Générer l'Attestation Signataire
                </button>
                <p class="text-xs text-gray-500 text-center mt-2">
                    Cliquez pour générer et télécharger l'attestation signataire
                </p>
            </div>
        `;

        document.getElementById('submitBtn').disabled = false;
        return;
    }

    // CAS NORMAL : DEVIS
    if (fileForms[type]) {
        document.getElementById("dynamic-form").classList.remove("hidden");

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
                    >
                    ${field.example ? `<p class="text-xs text-gray-500 mt-1">Exemple: ${field.example}</p>` : ''}
                </label>
            `;
        });

        // Bouton de génération
        container.innerHTML += `
            <div class="pt-4 border-t border-gray-200">
                <button type="button"
                    onclick="generateFromDynamicForm('${type}')"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                    <i class="fas fa-file-pdf mr-2"></i>
                    Générer le PDF
                </button>
                <p class="text-xs text-gray-500 text-center mt-2">
                    Cliquez pour générer et télécharger le document
                </p>
            </div>
        `;

        document.getElementById('submitBtn').disabled = false;
    } else {
        // Type non supporté
        container.innerHTML = `
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div class="flex items-center gap-3">
                    <i class="fas fa-info-circle text-yellow-600"></i>
                    <p class="text-yellow-700">Ce type de document n'est pas encore disponible.</p>
                </div>
            </div>
        `;
        document.getElementById("dynamic-form").classList.remove("hidden");
        document.getElementById('submitBtn').disabled = true;
    }
}

async function generateFactureWithDate() {
    const lastDevisData = localStorage.getItem("lastDevisData");
    
    if (!lastDevisData) {
        alert("❌ Aucun devis trouvé.");
        return;
    }
    
    try {
        // Récupérer les données du devis
        const devisData = JSON.parse(lastDevisData);
        
        // Récupérer la date de la facture depuis l'input
        const dateFactureInput = document.querySelector('input[name="date_facture"]');
        if (!dateFactureInput || !dateFactureInput.value) {
            alert("❌ Veuillez saisir la date de la facture.");
            return;
        }
        
        // Fusionner les données : devis + date_facture
        const factureData = {
            ...devisData,
            date_facture: dateFactureInput.value
        };
        
        console.log("Données pour la facture:", factureData);
        
        await generatePdfWithPdfLib(factureData, 'facture');
        alert("✅ Facture générée avec succès !");
        setTimeout(() => goBackToStep1(), 2000);
    } catch (error) {
        console.error("Erreur facture:", error);
        alert("❌ Erreur lors de la génération de la facture.");
    }
}

async function generateRapport() {
    const lastDevisData = localStorage.getItem("lastDevisData");
    
    if (!lastDevisData) {
        alert("❌ Aucun devis trouvé.");
        return;
    }
    
    try {
        // Récupérer les données du devis
        const devisData = JSON.parse(lastDevisData);
        
        // Récupérer les données du formulaire
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        // Fusionner toutes les données
        const rapportData = {
            // Données automatiques du devis
            date_facture: devisData.date_devis,
            reference_devis: devisData.reference_devis,
            puissance_chaudiere: devisData.puissance_chaudiere,
            nombre_emetteurs: devisData.nombre_emetteurs,
            volume_circuit: devisData.volume_circuit,
            
            // Données du formulaire
            ...formData
        };
        
        console.log("Données pour le rapport:", rapportData);
        
        await generatePdfWithPdfLib(rapportData, 'rapport');
        alert("✅ Rapport généré avec succès !");
        setTimeout(() => goBackToStep1(), 2000);
    } catch (error) {
        console.error("Erreur rapport:", error);
        alert("❌ Erreur lors de la génération du rapport.");
    }
}

// NOUVELLE FONCTION POUR GÉNÉRER DEPUIS LE FORMULAIRE DYNAMIQUE
async function generateFromDynamicForm(type) {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        if (type === 'devis') {
            localStorage.setItem("lastDevisData", JSON.stringify(formData));
            console.log("Devis sauvegardé avec tous les champs:", formData);
        } 
        else if (type === 'attestation_realisation') {
            // Pour l'attestation, fusionner avec les données du devis si disponibles
            const lastDevisData = localStorage.getItem("lastDevisData");
            if (lastDevisData) {
                const devisData = JSON.parse(lastDevisData);
                
                // Récupérer les données manquantes depuis le devis
                const fieldsToAutoFill = [
                    'adresse_travaux', 'puissance_chaudiere', 'nombre_emetteurs',
                    'volume_circuit', 'nombre_batiments', 'details_batiments',
                    'reference_devis'
                ];
                
                fieldsToAutoFill.forEach(field => {
                    if (!formData[field] && devisData[field]) {
                        formData[field] = devisData[field];
                        console.log(`Champ ${field} auto-rempli depuis devis: ${devisData[field]}`);
                    }
                });
                
                // S'assurer que le nombre de logements est présent
                if (!formData.nombre_logements && devisData.nombre_logements) {
                    formData.nombre_logements = devisData.nombre_logements;
                }
            }
        }
        
        await generatePdfWithPdfLib(formData, type);
        
        if (type === 'devis') {
            alert("✅ Devis généré et sauvegardé pour la facture et les attestations !");
            setTimeout(() => {
                const makeFacture = confirm("Voulez-vous créer une facture maintenant avec ces mêmes données ?");
                if (makeFacture) {
                    document.querySelector('.file-option[data-value="facture"]').click();
                }
            }, 500);
        } else {
            alert(`✅ ${type === 'attestation_realisation' ? 'Attestation de réalisation' : 'Attestation signataire'} générée avec succès !`);
        }
        
    } catch (error) {
        console.error("Erreur:", error);
        alert("❌ Erreur lors de la génération.");
    }
}

function createDevisFirst() {
    document.querySelector('.file-option[data-value="devis"]').click();
}

async function generateFactureFromDevis() {
    const lastDevisData = localStorage.getItem("lastDevisData");
    
    if (!lastDevisData) {
        alert("❌ Aucun devis trouvé.");
        return;
    }
    
    try {
        const devisData = JSON.parse(lastDevisData);
        await generatePdfWithPdfLib(devisData, 'facture');
        alert("✅ Facture générée avec succès !");
        setTimeout(() => goBackToStep1(), 2000);
    } catch (error) {
        console.error("Erreur facture:", error);
        alert("❌ Erreur lors de la génération de la facture.");
    }
}

const PDFColors = {
    WHITE: 'white',
    BLACK: 'black',
    DARK_BLUE: 'dark_blue',
    BOLD: 'black'
};

// COORDONNÉES MISE À JOUR - FACTURE A 4 PAGES COMME LE DEVIS
const pdfCoordinates = {
    devis: {
        page1: {
            reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_devis: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true },
            adresse_travaux: { x: 104, y: 505, size: 8, color: PDFColors.BLACK },
            numero_immatriculation: { x: 205, y: 495, size: 8, color: PDFColors.BLACK },
            nom_residence: { x: 268, y: 495, size: 8, color: PDFColors.BLACK },
            parcelle_1: { x: 84, y: 462, size: 7, color: PDFColors.BLACK },
            parcelle_2: { x: 224, y: 462, size: 7, color: PDFColors.BLACK },
            parcelle_3: { x: 84, y: 449, size: 7, color: PDFColors.BLACK },
            parcelle_4: { x: 224, y: 449, size: 7, color: PDFColors.BLACK },
            dates_previsionnelles: { x: 174, y: 428, size: 7, color: PDFColors.BLACK },
            nombre_batiments: { x: 124, y: 400, size: 8, color: PDFColors.BLACK },
            details_batiments: { x: 72, y: 391, size: 8, color: PDFColors.BLACK },
            prime_cee: { x: 410, y: 348, size: 7, color: PDFColors.BLACK },
            prime_cee_dup: { x: 468, y: 348, size: 7, color: PDFColors.BLACK }
        },
        page2: {
            reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_devis: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true },
            puissance_chaudiere: { x: 198, y: 632, size: 7, color: PDFColors.BLACK },
            nombre_logements: { x: 189, y: 622, size: 7, color: PDFColors.BLACK },
            nombre_emetteurs: { x: 195, y: 611, size: 7, color: PDFColors.BLACK },
            volume_circuit: { x: 179, y: 590, size: 7, color: PDFColors.BLACK },
            nombre_filtres: { x: 102, y: 569, size: 7, color: PDFColors.BLACK },
            wh_cumac: { x: 127, y: 548, size: 7, color: PDFColors.BLACK },
            prime_cee: { x: 120, y: 538, size: 7, color: PDFColors.BLACK }
        },
        page3: {
            reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_devis: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true }
        },
        page4: {
            reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_devis: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true },
            montant_ht: { x: 522, y: 383, size: 8, color: PDFColors.DARK_BLUE,bold: true },
            montant_tva: { x: 522, y: 371, size: 8, color: PDFColors.DARK_BLUE,bold: true },
            montant_ttc: { x: 522, y: 361, size: 8, color: PDFColors.DARK_BLUE,bold: true},
            prime_cee: { x: 522, y: 350, size: 8, color: PDFColors.DARK_BLUE,bold: true },
            reste_a_charge: { x: 522, y: 315, size: 8, color: PDFColors.DARK_BLUE ,bold: true},
            montant_ht_dup: { x: 77, y: 277, size: 7, color: PDFColors.BLACK }
        },
        page5: {
            reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_devis: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true }
        }
    },
    
    // COORDONNÉES POUR LA FACTURE - MÊME QUE DEVIS POUR LES 4 PAGES
    facture: {
        page1: {
            reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_facture: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true }, // Remplace date_devis
            adresse_travaux: { x: 104, y: 505, size: 8, color: PDFColors.BLACK },
            numero_immatriculation: { x: 205, y: 495, size: 8, color: PDFColors.BLACK },
            nom_residence: { x: 268, y: 495, size: 8, color: PDFColors.BLACK },
            parcelle_1: { x: 84, y: 462, size: 7, color: PDFColors.BLACK },
            parcelle_2: { x: 224, y: 462, size: 7, color: PDFColors.BLACK },
            parcelle_3: { x: 84, y: 449, size: 7, color: PDFColors.BLACK },
            parcelle_4: { x: 224, y: 449, size: 7, color: PDFColors.BLACK },
            dates_previsionnelles: { x: 174, y: 428, size: 7, color: PDFColors.BLACK },
            nombre_batiments: { x: 124, y: 400, size: 8, color: PDFColors.BLACK },
            details_batiments: { x: 72, y: 391, size: 8, color: PDFColors.BLACK },
            prime_cee: { x: 410, y: 348, size: 7, color: PDFColors.BLACK },
            prime_cee_dup: { x: 468, y: 348, size: 7, color: PDFColors.BLACK }
        },
        page2: {
           reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_facture: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true }, // Remplace date_devis
            puissance_chaudiere: { x: 198, y: 632, size: 7, color: PDFColors.BLACK },
            nombre_logements: { x: 189, y: 622, size: 7, color: PDFColors.BLACK },
            nombre_emetteurs: { x: 195, y: 611, size: 7, color: PDFColors.BLACK },
            volume_circuit: { x: 179, y: 590, size: 7, color: PDFColors.BLACK },
            nombre_filtres: { x: 102, y: 569, size: 7, color: PDFColors.BLACK },
            wh_cumac: { x: 127, y: 548, size: 7, color: PDFColors.BLACK },
            prime_cee: { x: 120, y: 538, size: 7, color: PDFColors.BLACK }
        },
        page3: {
           reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_facture: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true } // Remplace date_devis
        },
        page4: {
           reference_devis: { x: 215, y: 733, size: 10, color: PDFColors.WHITE, bold: true },
            date_facture: { x: 139, y: 718, size: 10, color: PDFColors.WHITE, bold: true }, // Remplace date_devis
            montant_ht: { x: 522, y: 383, size: 8, color: PDFColors.DARK_BLUE },
            montant_tva: { x: 522, y: 371, size: 8, color: PDFColors.DARK_BLUE },
            montant_ttc: { x: 522, y: 361, size: 8, color: PDFColors.DARK_BLUE },
            prime_cee: { x: 522, y: 350, size: 8, color: PDFColors.DARK_BLUE },
            reste_a_charge: { x: 522, y: 315, size: 8, color: PDFColors.DARK_BLUE },
            montant_ht_dup: { x: 77, y: 277, size: 7, color: PDFColors.BLACK }
        }
        
    },
    // COORDONNÉES POUR ATTESTATION SIGNATAIRE
    attestation_signataire: {
        page1: {
            residence_nom: { x: 85, y: 503, size: 11, color: PDFColors.BLACK },
            adresse_batiment: { x: 100, y: 490, size: 11, color: PDFColors.BLACK },
            numero_immatriculation: { x: 253, y: 477, size: 11, color: PDFColors.BLACK },
            date_fait: { x: 155, y: 385, size: 10, color: PDFColors.BLACK }
        }




    },
    // COORDONNÉES POUR L'ATTESTATION DE RÉALISATION
    attestation_realisation: {
         page1: {
            nombre_logements: { x: 186, y: 419, size: 8, color: PDFColors.BLACK },
            adresse_travaux: { x: 186, y: 449, size: 8, color: PDFColors.BLACK },
            puissance_chaudiere: { x: 186, y: 395, size: 8, color: PDFColors.BLACK },
            nombre_emetteurs: { x: 186, y: 385, size: 8, color: PDFColors.BLACK },
            volume_circuit: { x: 186 , y: 364, size: 8, color: PDFColors.BLACK },
            nombre_batiments: { x: 186, y: 314, size: 8, color: PDFColors.BLACK },
            details_batiments: { x: 186, y: 300, size: 8, color: PDFColors.BLACK },
            dates_previsionnelles: { x: 195, y: 340, size: 8, color: PDFColors.BLACK },
        },
         page2: {
            reference_devis: { x: 224, y: 469, size: 8 , color: PDFColors.BLACK, bold: true},
            date_signature: { x: 389, y: 399, size: 8},
            date_devis: { x: 248, y: 469, size: 8,color: PDFColors.BLACK, bold: true},
        }
    },
    cdc: {
        page1: {
            prime_cee: { x: 192, y: 674, size: 10, color: PDFColors.BLACK },
            date_devis: { x: 323, y: 371, size: 8, color: PDFColors.BLACK },
            date_devis_dup: { x: 143, y: 197, size: 8, color: PDFColors.BLACK }
        }
    },
    // COORDONNÉES POUR LE RAPPORT
    rapport: {
        page1: {
            date_facture: { x: 412, y: 729, size: 8, color: PDFColors.BLACK },
            reference_devis: { x: 464, y: 707.5, size: 7.5, color: PDFColors.BLACK },
            puissance_chaudiere: { x: 244, y: 400, size: 9, color: PDFColors.BLACK },
            nombre_emetteurs: { x: 367, y: 510, size: 9, color: PDFColors.BLACK },
            volume_circuit: { x: 370, y: 402, size: 9, color: PDFColors.BLACK },
            adresse_travaux_1: { x: 8, y: 740, size: 9},
            boite_postale_1: { x: 8, y: 724, size: 9, color: PDFColors.BLACK },
            adresse_travaux_2: { x: 8, y: 710, size: 9, color: PDFColors.BLACK },
            boite_postale_2: { x: 8, y: 694, size: 9, color: PDFColors.BLACK }
        }
    }
};

function prefillAttestationFromDevis() {
    const lastDevisData = localStorage.getItem("lastDevisData");
    if (!lastDevisData) return;
    
    try {
        const devisData = JSON.parse(lastDevisData);
        const inputs = document.querySelectorAll("#dynamic-fields input");
        
        inputs.forEach(input => {
            if (input.readOnly && devisData[input.name]) {
                input.value = devisData[input.name];
            }
            
            // Pré-remplir aussi le nombre de logements si vide
            if (input.name === 'nombre_logements' && !input.value && devisData[input.name]) {
                input.value = devisData[input.name];
                input.classList.add('border-green-300', 'bg-green-50');
                setTimeout(() => {
                    input.classList.remove('border-green-300', 'bg-green-50');
                }, 2000);
            }
        });
        
    } catch (error) {
        console.error("Erreur pré-remplissage:", error);
    }
}

// FONCTION PRINCIPALE
async function generatePdfWithPdfLib(formData, type = null) {
    // Si type n'est pas fourni, le récupérer depuis l'input
    const selectedType = type || document.getElementById('selected_file_type').value;
    if (!selectedType) {
        alert("Veuillez sélectionner un type de fichier.");
        return;
    }

    console.log(`=== GÉNÉRATION ${selectedType.toUpperCase()} ===`);
    console.log("Type:", selectedType);
    console.log("Données reçues:", formData);
    
    // Si c'est une facture, utiliser date_facture au lieu de date_devis
    if (selectedType === 'facture') {
        // Utiliser date_facture si disponible, sinon date_devis
        if (formData.date_facture) {
            formData.date_devis = formData.date_facture; // Remplacer la date
            console.log("Utilisation date facture:", formData.date_facture);
        }
    }
    
    // VALIDATION POUR ATTESTATION SIGNATAIRE
    if (selectedType === 'attestation_signataire') {
        const requiredFields = ['residence_nom', 'adresse_batiment', 'numero_immatriculation', 'date_fait'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            const fieldNames = {
                'residence_nom': 'Nom de la résidence',
                'adresse_batiment': 'Adresse du bâtiment',
                'numero_immatriculation': 'Numéro d\'immatriculation',
                'date_fait': 'Date du document'
            };
            
            const missingNames = missingFields.map(field => fieldNames[field] || field);
            alert(`❌ Veuillez remplir tous les champs requis pour l'attestation signataire.\n\nChamps manquants:\n- ${missingNames.join('\n- ')}`);
            return;
        }
    }
    
    // VALIDATION POUR ATTESTATION RÉALISATION
    if (selectedType === 'attestation_realisation') {
        const requiredFields = ['date_signature', 'nombre_logements'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            const fieldNames = {
                'date_signature': 'Date de signature',
                'nombre_logements': 'Nombre de logements'
            };
            
            const missingNames = missingFields.map(field => fieldNames[field] || field);
            alert(`❌ Veuillez remplir les champs requis pour l'attestation de réalisation.\n\nChamps manquants:\n- ${missingNames.join('\n- ')}`);
            return;
        }
    }

    const pdfMap = {
    attestation_signataire: "PDFS/attestation_signataire.pdf",
    attestation_realisation: "PDFS/attestation_realisation.pdf",
    devis: "PDFS/devis.pdf",
    facture: "PDFS/facture.pdf",
    cdc: "PDFS/cdc.pdf",
    rapport: "PDFS/rapport.pdf"
};

    if (!pdfMap[selectedType]) {
        alert("Type de document non supporté.");
        return;
    }

    try {
        const existingPdf = await fetch(pdfMap[selectedType]).then(res => res.arrayBuffer());
        const { PDFDocument, StandardFonts, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.load(existingPdf);
        const pages = pdfDoc.getPages();

        const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Récupérer les coordonnées selon le type
        const coords = pdfCoordinates[selectedType];
        if (!coords) {
            console.error(`Coordonnées non définies pour ${selectedType}`);
            alert(`❌ Pas de coordonnées définies pour ${selectedType}`);
            return;
        }

        console.log(`Nombre de pages ${selectedType}:`, pages.length);
        console.log("Coordonnées disponibles pour:", selectedType, coords);

        // DEBUG: Vérifier que les champs correspondent
        console.log("=== CORRESPONDANCE CHAMPS ===");
        Object.keys(coords.page1 || {}).forEach(fieldName => {
            console.log(`Champ coord: ${fieldName}, Valeur: "${formData[fieldName] || 'VIDE'}"`);
        });
        console.log("============================");

        // Remplir chaque page
        pages.forEach((page, index) => {
            const pageKey = `page${index + 1}`;
            
            if (coords[pageKey]) {
                Object.entries(coords[pageKey]).forEach(([fieldName, coord]) => {
                    // Pour les attestations, gérer les noms de champs spéciaux
                    let value = "";
                    
                    if (selectedType === 'attestation_signataire') {
                        // Les champs sont exactement les mêmes
                        value = formData[fieldName] || "";
                    } else if (selectedType === 'attestation_realisation') {
                        // Certains champs peuvent avoir des noms différents
                        value = formData[fieldName] || "";
                    } else {
                        // Pour devis et facture, gérer les champs dupliqués
                        const realFieldName = fieldName.replace(/_dup$/, '');
                        value = formData[realFieldName] || "";
                        
                        // Pour les champs dupliqués
                        if (!value && fieldName.includes('_dup')) {
                            const originalField = fieldName.replace('_dup', '');
                            value = formData[originalField] || "";
                        }
                    }

                    // Conversion date
                    if (fieldName.includes("date") || fieldName.includes("signature") || fieldName.includes("fait")) {
                        value = formatDateFR(value);
                    }

                    if (value && value.trim() !== "") {
                        const font = coord.bold ? fontBold : fontNormal;
                        
                        let color;
                        switch(coord.color) {
                            case 'white':
                                color = rgb(1, 1, 1);
                                break;
                            case 'dark_blue':
                                color = rgb(0, 0.2, 0.4);
                                break;
                            case 'black':
                            default:
                                color = rgb(0, 0, 0);
                        }
                        
                        console.log(`Écriture ${selectedType} - ${fieldName}: "${value}" à (${coord.x}, ${coord.y})`);
                        
                        try {
                            page.drawText(value, {
                                x: coord.x,
                                y: coord.y,
                                size: coord.size,
                                font: font,
                                color: color
                            });
                        } catch (error) {
                            console.error(`Erreur écriture ${fieldName}:`, error);
                        }
                    } else {
                        console.log(`Champ vide: ${fieldName}`);
                    }
                });
            } else {
                console.log(`Aucune coordonnée pour ${pageKey}`);
            }
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        
        // Nom du fichier
        let fileName;
        if (selectedType === 'facture') {
            fileName = `facture_${formData.reference_devis || 'devis'}_${Date.now()}.pdf`;
        } else if (selectedType === 'devis') {
            fileName = `devis_${formData.reference_devis || Date.now()}.pdf`;
        } else if (selectedType === 'attestation_signataire') {
            fileName = `attestation_signataire_${formData.residence_nom || Date.now()}.pdf`;
        } else if (selectedType === 'attestation_realisation') {
            fileName = `attestation_realisation_${formData.reference_devis || Date.now()}.pdf`;
        } else {
            fileName = `${selectedType}_${Date.now()}.pdf`;
        }
        
        link.download = fileName;
        link.click();
        
        console.log(`✅ ${selectedType.toUpperCase()} généré: ${fileName}`);
        return true;

    } catch (error) {
        console.error("❌ Erreur PDF:", error);
        alert(`❌ Erreur lors de la génération du ${selectedType}. Vérifiez la console pour plus de détails.`);
        throw error;
    }
}

async function generateCdcFromDevis() {
    const lastDevisData = localStorage.getItem("lastDevisData");
    
    if (!lastDevisData) {
        alert("❌ Aucun devis trouvé.");
        return;
    }
    
    try {
        const devisData = JSON.parse(lastDevisData);
        await generatePdfWithPdfLib(devisData, 'cdc');
        alert("✅ Cahier des Charges généré avec succès !");
        setTimeout(() => goBackToStep1(), 2000);
    } catch (error) {
        console.error("Erreur CDC:", error);
        alert("❌ Erreur lors de la génération du Cahier des Charges.");
    }
}

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

// FONCTION POUR LE BOUTON ORIGINAL (au cas où)
function generatePdfWithPdfLibOriginal() {
    const selectedType = document.getElementById('selected_file_type').value;
    if (!selectedType) return alert("Veuillez sélectionner un type de fichier.");
    
    const formData = {};
    document.querySelectorAll("#dynamic-fields input").forEach(input => {
        formData[input.name] = input.value;
    });
    
    generatePdfWithPdfLib(formData, selectedType);
}

// FONCTION POUR GÉNÉRER L'ATTESTATION AVEC FUSION AUTOMATIQUE
async function generateAttestationRealisation() {
    try {
        const formData = {};
        document.querySelectorAll("#dynamic-fields input").forEach(input => {
            formData[input.name] = input.value;
        });
        
        // Fusionner avec les données du devis
        const lastDevisData = localStorage.getItem("lastDevisData");
        if (lastDevisData) {
            const devisData = JSON.parse(lastDevisData);
            
            // Liste des champs à auto-remplir depuis le devis
            const autoFillFields = {
                'adresse_travaux': 'adresse_travaux',
                'puissance_chaudiere': 'puissance_chaudiere',
                'nombre_emetteurs': 'nombre_emetteurs',
                'volume_circuit': 'volume_circuit',
                'nombre_batiments': 'nombre_batiments',
                'details_batiments': 'details_batiments',
                'reference_devis': 'reference_devis'
            };
            
            // Remplir les champs manquants
            Object.entries(autoFillFields).forEach(([attestationField, devisField]) => {
                if (!formData[attestationField] && devisData[devisField]) {
                    formData[attestationField] = devisData[devisField];
                    console.log(`Auto-remplissage: ${attestationField} = ${devisData[devisField]}`);
                }
            });
            
            // Si nombre_logements est vide dans l'attestation mais présent dans le devis
            if (!formData.nombre_logements && devisData.nombre_logements) {
                formData.nombre_logements = devisData.nombre_logements;
            }
        }
        
        await generatePdfWithPdfLib(formData, 'attestation_realisation');
        alert("✅ Attestation de réalisation générée avec succès !");
        
    } catch (error) {
        console.error("Erreur attestation:", error);
        alert("❌ Erreur lors de la génération de l'attestation.");
    }
}

// Dès le chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
  console.log("🔄 Préchargement des templates...");
  
  // Précharger uniquement les templates nécessaires
  const essentialTemplates = [
    'PDFS/devis.pdf',
    'PDFS/facture.pdf'
  ];
  
  // Charger en arrière-plan sans bloquer
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


// TOP de votre script.js
const pdfCache = new Map();

async function getPdfTemplate(path) {
  // Vérifier le cache d'abord
  if (pdfCache.has(path)) {
    console.log("📦 Utilisation cache pour", path);
    return pdfCache.get(path);
  }
  
  console.time(`Chargement ${path}`);
  
  // Version optimisée pour GitHub Pages
  const response = await fetch(`${path}?v=1.0`, { // Versionnage
    cache: 'force-cache', // Force la mise en cache
    headers: {
      'Accept-Encoding': 'gzip' // Demande la compression
    }
  });
  
  if (!response.ok) {
    throw new Error(`Template non trouvé: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  console.timeEnd(`Chargement ${path}`);
  console.log(`📊 Taille: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} Mo`);
  
  // Mettre en cache
  pdfCache.set(path, arrayBuffer);
  
  return arrayBuffer;
}