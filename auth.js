
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM chargé, initialisation de l'authentification...");
    
    try {
        // Initialiser le système d'authentification
        const auth = new AuthSystem();
        window.auth = auth;
        
        console.log("✅ Système d'authentification initialisé");
        
        // Vérifier si tout fonctionne
        setTimeout(() => {
            const user = auth.getCurrentUser();
            console.log("👤 Utilisateur actuel:", user);
            
            if (!user) {
                console.log("🔒 Aucun utilisateur connecté - Affichage du formulaire");
            } else {
                console.log("✅ Utilisateur connecté:", user.phone);
            }
        }, 100);
        
    } catch (error) {
        console.error("❌ ERREUR lors de l'initialisation:", error);
        
        // Fallback: Afficher un message d'erreur
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="max-w-md mx-auto mt-12">
                    <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div class="text-red-600 text-5xl mb-4">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-red-800 mb-4">
                            Erreur d'authentification
                        </h2>
                        <p class="text-red-600 mb-6">
                            Le système d'authentification n'a pas pu se charger correctement.
                        </p>
                        <div class="text-left bg-white p-4 rounded-lg border">
                            <p class="text-sm text-gray-700 mb-2">
                            <strong>Détails de l'erreur:</strong>
                            </p>
                            <code class="text-xs text-red-600">
                                ${error.toString()}
                            </code>
                        </div>
                        <button onclick="location.reload()" 
                                class="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                            <i class="fas fa-redo mr-2"></i>
                            Recharger la page
                        </button>
                    </div>
                </div>
            `;
        }
    }
});

// ... LE RESTE DE VOTRE CODE auth.js ICI ...





class AuthSystem {
 
   constructor() {
    this.adminCredentials = {
        name: "Ouedraogo Josue",
        phone: "+212772376608",
        email: "josueservicedigital@gmail.com",
        password: "Passw0rd6634"
    };
    
    this.users = JSON.parse(localStorage.getItem('myhouse_users')) || [];
    this.sessions = JSON.parse(localStorage.getItem('myhouse_sessions')) || {};
    this.pendingRegistrations = JSON.parse(localStorage.getItem('pending_registrations')) || [];
    
    console.log("🔄 Initialisation AuthSystem...");
    
    // FORCER la réinitialisation des hashs (à supprimer après)
    if (localStorage.getItem('reset_passwords') !== 'done') {
        console.log("🔄 Réinitialisation des mots de passe...");
        this.resetAllPasswords();
        localStorage.setItem('reset_passwords', 'done');
    }
    
    // Initialiser l'admin s'il n'existe pas
    this.initializeAdminUser();
    
    // Initialiser le DOM
    this.initializeAuth();
}

resetAllPasswords() {
    // Réinitialiser l'admin
    this.adminCredentials.password = "Passw0rd6634"; // Mot de passe en clair
    
    // Réinitialiser les utilisateurs existants
    this.users.forEach(user => {
        if (user.phone === "+21277986162") {
            // Mettre à jour avec le bon hash
            user.password = this.hashPassword("77986162jo"); // Mot de passe en clair
        }
    });
    
    // Sauvegarder
    localStorage.setItem('myhouse_users', JSON.stringify(this.users));
    console.log("✅ Mots de passe réinitialisés");
}




    
    initializeAuth() {
        // Vérifier si l'utilisateur est déjà connecté
        const currentUser = this.getCurrentUser();
        
        if (!currentUser) {
            // Pas connecté, afficher le formulaire d'authentification
            this.showAuthForm();
        } else {
            // Déjà connecté, afficher l'application
            this.showAppContent();
        }
    }
    
    showAuthForm() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="max-w-md mx-auto mt-12">
                <!-- En-tête -->
                <header class="text-center mb-12">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mb-6 shadow-2xl">
                        <i class="fas fa-lock text-white text-3xl"></i>
                    </div>
                    <h1 class="text-4xl font-bold text-gray-800 mb-3">
                        Plateforme Sécurisée MYHOUSE
                    </h1>
                    <p class="text-gray-600">
                        Authentification requise pour accéder aux services
                    </p>
                </header>
                
                <!-- Onglets -->
                <div class="mb-8">
                    <div class="flex border-b border-gray-200">
                        <button id="loginTab" 
                                class="flex-1 py-4 px-6 text-center font-medium text-blue-600 border-b-2 border-blue-600">
                            <i class="fas fa-sign-in-alt mr-2"></i>
                            Connexion
                        </button>
                        <button id="registerTab" 
                                class="flex-1 py-4 px-6 text-center font-medium text-gray-500 hover:text-gray-700">
                            <i class="fas fa-user-plus mr-2"></i>
                            Inscription
                        </button>
                    </div>
                </div>
                
                <!-- Formulaire de Connexion -->
                <!-- Formulaire de Connexion -->
<div id="loginForm" class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
    <div id="loginStep1">
        <h3 class="text-xl font-bold text-gray-800 mb-6">
            <i class="fas fa-key mr-2"></i>
            Identifiez-vous
        </h3>
        
        <div class="space-y-5">
            <div>
                <label for="loginPhone" class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-envelope mr-2"></i>
                    Email ou numéro de téléphone WhatsApp
                </label>
                <input type="text" 
                       id="loginPhone"
                       class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                       placeholder="votre@email.com ou +212612345678"
                       required>
                <p class="text-sm text-gray-500 mb-2">
                    <i class="fas fa-info-circle mr-1"></i>
                    Utilisez votre email ou numéro WhatsApp enregistré
                </p>
            </div>
            
            <div>
                <label for="loginPassword" class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-lock mr-2"></i>
                    Mot de passe
                </label>
                <input type="password" 
                       id="loginPassword"
                       class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                       placeholder="Votre mot de passe"
                       required
                       aria-describedby="passwordHelp">
                <p id="passwordHelp" class="sr-only">
                    Entrez votre mot de passe pour vous connecter
                </p>
            </div>
            
            <button type="button"
                    onclick="auth.login()"
                    class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-200"
                    aria-label="Se connecter avec téléphone et mot de passe">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Se connecter
            </button>
        </div>
    </div>
</div>
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <div class="text-center">
                                <button onclick="auth.adminLogin()"
                                        class="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition">
                                    <i class="fas fa-user-shield mr-2"></i>
                                    Connexion Administrateur
                                </button>
                                <p class="text-xs text-gray-500 mt-2">
                                    (Utilise les identifiants admin par défaut)
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Étape OTP -->
                    <div id="loginStep2" class="hidden">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">
                            <i class="fas fa-mobile-alt mr-2"></i>
                            Vérification OTP
                        </h3>
                        
                        <div class="space-y-5">
                            <div class="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <i class="fas fa-sms text-blue-600 text-2xl mb-2"></i>
                                <p class="text-gray-700">
                                    Un code OTP a été envoyé
                                </p>
                                <p id="otpPhone" class="font-bold text-lg mt-2"></p>
                                <p class="text-sm text-gray-600 mt-1">
                                    Code OTP : <span id="otpDisplay" class="font-bold text-blue-700"></span>
                                </p>
                            </div>
                            
                            <div>
                                <label class="block text-gray-700 font-medium mb-2">
                                    Entrez le code OTP à 6 chiffres
                                </label>
                                <input type="text" 
                                       id="otpInput"
                                       class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-center text-2xl font-bold tracking-widest"
                                       maxlength="6"
                                       placeholder="000000">
                                <p id="otpError" class="text-red-500 text-sm mt-2 hidden"></p>
                            </div>
                            
                            <div class="flex gap-3">
                                <button onclick="auth.verifyOTP()"
                                        class="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 hover:shadow-xl transition">
                                    <i class="fas fa-check mr-2"></i>
                                    Vérifier le code
                                </button>
                                <button onclick="auth.resendOTP()"
                                        class="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                                    <i class="fas fa-redo mr-2"></i>
                                    Renvoyer
                                </button>
                            </div>
                            
                            <div class="text-center">
                                <button onclick="auth.backToLogin()"
                                        class="text-blue-600 hover:text-blue-800 font-medium">
                                    <i class="fas fa-arrow-left mr-1"></i>
                                    Retour à la connexion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Formulaire d'Inscription -->
                <div id="registerForm" class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hidden">
                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <p class="text-blue-800 text-sm">
                            <i class="fas fa-info-circle mr-2"></i>
                            <strong>Important :</strong> L'authentification se fait désormais uniquement par numéro de téléphone WhatsApp. 
                            Si vous étiez déjà inscrit avec un email, veuillez vous réinscrire avec votre numéro de téléphone.
                        </p>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-6">
                        <i class="fas fa-user-plus mr-2"></i>
                        Créer un compte
                    </h3>
                    
                    <div class="space-y-5">
                        <div class="grid grid-cols-2 gap-4">
    <div>
        <label for="registerLastName" class="block text-gray-700 font-medium mb-2">
            <i class="fas fa-user mr-2"></i>
            Nom
        </label>
        <input type="text" 
               id="registerLastName"
               class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
               placeholder="Votre nom"
               required>
    </div>
    <div>
        <label for="registerFirstName" class="block text-gray-700 font-medium mb-2">
            <i class="fas fa-user mr-2"></i>
            Prénom
        </label>
        <input type="text" 
               id="registerFirstName"
               class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
               placeholder="Votre prénom"
               required>
    </div>
</div>

<div>
    <label for="registerPhone" class="block text-gray-700 font-medium mb-2">
        <i class="fas fa-phone mr-2"></i>
        Numéro de téléphone WhatsApp
    </label>
    <input type="tel" 
           id="registerPhone"
           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
           placeholder="+212612345678"
           required
           pattern="^\+[0-9]{10,15}$"
           title="Format international: +212612345678">
</div>

<div>
    <label for="registerPassword" class="block text-gray-700 font-medium mb-2">
        <i class="fas fa-lock mr-2"></i>
        Mot de passe
    </label>
    <input type="password" 
           id="registerPassword"
           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
           placeholder="Minimum 8 caractères"
           required
           minlength="8">
</div>

<div>
    <label for="registerConfirmPassword" class="block text-gray-700 font-medium mb-2">
        <i class="fas fa-lock mr-2"></i>
        Confirmer le mot de passe
    </label>
    <input type="password" 
           id="registerConfirmPassword"
           class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
           placeholder="Retapez votre mot de passe"
           required
           minlength="8">
</div>
                </div>
                
                <!-- Message d'attente validation -->
                <div id="pendingRegistration" class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hidden">
                    <div class="text-center py-8">
                        <div class="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                            <i class="fas fa-clock text-yellow-600 text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-4">
                            Demande envoyée !
                        </h3>
                        <p class="text-gray-600 mb-6">
                            Votre inscription a été envoyée à l'administrateur.
                            Un message WhatsApp lui a été envoyé pour validation.
                        </p>
                        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                            <p class="text-gray-700 mb-2">
                                <i class="fab fa-whatsapp text-green-600 mr-2"></i>
                                Message envoyé à l'administrateur :
                            </p>
                            <div class="bg-white p-3 rounded-lg border text-sm text-left">
                                <p><strong>Nouvelle inscription :</strong></p>
                                <p>👤 <span id="pendingName"></span></p>
                                <p>📞 <span id="pendingPhone"></span></p>
                            </div>
                        </div>
                        <button onclick="auth.switchToLogin()"
                                class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                            <i class="fas fa-sign-in-alt mr-2"></i>
                            Revenir à la connexion
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Initialiser les écouteurs d'onglets
        document.getElementById('loginTab').addEventListener('click', () => this.switchTab('login'));
        document.getElementById('registerTab').addEventListener('click', () => this.switchTab('register'));
    }
    
    switchTab(tab) {
        document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
        document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
        document.getElementById('pendingRegistration').classList.add('hidden');
        
        // Mettre à jour les styles des onglets
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        
        if (loginTab && registerTab) {
            if (tab === 'login') {
                loginTab.classList.add('text-blue-600', 'border-blue-600');
                loginTab.classList.remove('text-gray-500');
                registerTab.classList.add('text-gray-500');
                registerTab.classList.remove('text-blue-600', 'border-blue-600');
            } else {
                registerTab.classList.add('text-blue-600', 'border-blue-600');
                registerTab.classList.remove('text-gray-500');
                loginTab.classList.add('text-gray-500');
                loginTab.classList.remove('text-blue-600', 'border-blue-600');
            }
        }
         setTimeout(() => {
        const loginBtn = document.querySelector('#loginForm button[onclick*="login"]');
        if (loginBtn) {
            loginBtn.removeAttribute('onclick');
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.login();
            });
        }
    }, 100);
}
    
    switchToLogin() {
        this.switchTab('login');
    }
    
// auth.js - CORRIGÉ

// ... garder tout le début jusqu'à la fonction login ...

// auth.js - CORRIGÉ

// ... garder tout le début jusqu'à la fonction login ...
async login() {
    try {
        console.log("🔍 login() appelé");
        
        const identifierInput = document.getElementById('loginPhone');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!identifierInput || !passwordInput) {
            throw new Error("Champs de formulaire non trouvés");
        }
        
        // Récupérer et nettoyer les valeurs
        const identifier = identifierInput.value.replace(/\s+/g, '');
        const password = passwordInput.value;
        
        console.log("🔑 Identifiant saisi:", identifier);
        console.log("🔑 Mot de passe saisi:", password ? "***" : "vide");
        
        // Validation basique
        if (!identifier || !password) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        
        // DEBUG : Afficher l'état actuel
        console.log("👥 Utilisateurs enregistrés:", this.users);
        console.log("⏳ Inscriptions en attente:", this.pendingRegistrations);
        
        // 1. VÉRIFICATION ADMIN (par téléphone uniquement maintenant)
        if (identifier === this.adminCredentials.phone) {
            console.log("👑 Tentative de connexion admin");
            
            // Vérifier mot de passe admin (EN CLAIR - comme défini dans adminCredentials)
            if (password === this.adminCredentials.password) {
                console.log("✅ Mot de passe admin correct");
                
                // Créer/obtenir l'utilisateur admin
                let adminUser = this.users.find(u => u.phone === this.adminCredentials.phone);
                
                if (!adminUser) {
                    console.log("➕ Création du compte admin...");
                    adminUser = {
                        id: 1,
                        lastName: "Ouedraogo",
                        firstName: "Josue",
                        phone: this.adminCredentials.phone,
                        password: this.hashPassword(password), // Hashé avec la nouvelle méthode
                        validated: true,
                        role: 'admin',
                        registrationDate: new Date().toISOString(),
                        validationDate: new Date().toISOString()
                    };
                    
                    this.users.push(adminUser);
                    localStorage.setItem('myhouse_users', JSON.stringify(this.users));
                } else {
                    console.log("✅ Compte admin existant");
                }
                
                console.log("👤 Admin user:", adminUser);
                console.log("🔐 Hash admin:", adminUser.password);
                
                // Envoyer OTP
                console.log("📱 Envoi OTP à:", adminUser.phone);
                await this.sendOTP(adminUser.phone, adminUser);
                return;
                
            } else {
                console.log("❌ Mot de passe admin incorrect");
                alert("❌ Mot de passe administrateur incorrect");
                return;
            }
        }
        
        // 2. VÉRIFICATION UTILISATEUR NORMAL
        console.log("🔍 Recherche utilisateur par téléphone:", identifier);
        
        // Chercher d'abord dans les utilisateurs validés
        let user = this.users.find(u => u.phone === identifier);
        
        if (user) {
            console.log("✅ Utilisateur trouvé dans users:", user);
            
            // Vérifier validation
            if (!user.validated) {
                alert("⚠️ Votre compte n'est pas encore validé par l'administrateur.");
                return;
            }
            
            // Vérifier mot de passe
            const hashedInput = this.hashPassword(password);
            console.log("🔑 Comparaison mot de passe:", {
                saisiHash: hashedInput,
                stocke: user.password,
                egal: user.password === hashedInput
            });
            
            if (user.password !== hashedInput) {
                alert("❌ Mot de passe incorrect");
                return;
            }
            
            // Connexion réussie
            console.log("✅ Connexion réussie, envoi OTP à:", user.phone);
            await this.sendOTP(user.phone, user);
            
        } else {
            // Vérifier dans les inscriptions en attente
            const pendingUser = this.pendingRegistrations.find(u => u.phone === identifier);
            
            if (pendingUser) {
                console.log("⏳ Utilisateur trouvé dans pending:", pendingUser);
                alert("⚠️ Votre compte n'est pas encore validé par l'administrateur.");
            } else {
                console.log("❌ Utilisateur non trouvé");
                alert("❌ Téléphone non trouvé. Veuillez vous inscrire d'abord.");
            }
        }
        
    } catch (error) {
        console.error("❌ Erreur lors de la connexion:", error);
        alert("Une erreur est survenue: " + error.message);
    }
}

// CORRIGEZ aussi adminLogin() pour utiliser le téléphone
async adminLogin() {
    // Remplir avec le téléphone admin (pas l'email)
    const adminPhoneInput = document.getElementById('loginPhone');
    const adminPasswordInput = document.getElementById('loginPassword');
    
    if (adminPhoneInput && adminPasswordInput) {
        adminPhoneInput.value = this.adminCredentials.phone; // ← TÉLÉPHONE, pas email
        adminPasswordInput.value = this.adminCredentials.password;
        
        console.log("👑 Connexion admin pré-remplie avec téléphone");
        alert("Champs admin pré-remplis. Cliquez sur 'Se connecter'.");
    } else {
        alert("Erreur: champs de connexion non trouvés");
    }
}
    
 async sendOTP(phone, user) {
    try {
        const cleanPhone = phone.replace(/\s+/g, '');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000;
        
        console.log("📱 Génération OTP:", {
            phone: cleanPhone,
            otp: otp,
            user: user
        });
        
        // Stocker en session
        this.sessions[cleanPhone] = {
            otp,
            otpExpiry,
            user
        };
        localStorage.setItem('myhouse_sessions', JSON.stringify(this.sessions));
        
        // Afficher l'étape OTP
        const loginStep1 = document.getElementById('loginStep1');
        const loginStep2 = document.getElementById('loginStep2');
        
        if (loginStep1 && loginStep2) {
            loginStep1.classList.add('hidden');
            loginStep2.classList.remove('hidden');
            
            const otpPhone = document.getElementById('otpPhone');
            const otpDisplay = document.getElementById('otpDisplay');
            const otpInput = document.getElementById('otpInput');
            
            if (otpPhone) otpPhone.textContent = cleanPhone;
            if (otpDisplay) otpDisplay.textContent = otp;
            if (otpInput) {
                otpInput.value = '';
                setTimeout(() => otpInput.focus(), 100);
            }
        } else {
            console.error("❌ Éléments OTP non trouvés");
        }
        
        // Envoyer WhatsApp
        this.sendWhatsAppOTP(cleanPhone, otp, user);
        
    } catch (error) {
        console.error("❌ Erreur dans sendOTP:", error);
        alert("Erreur lors de l'envoi du code OTP");
    }
}

initializeAdminUser() {
    console.log("👑 Initialisation du compte administrateur...");
    
    // Vérifier si l'admin existe déjà
    let adminExists = this.users.some(u => u.phone === this.adminCredentials.phone);
    
    if (!adminExists) {
        console.log("➕ Création du compte administrateur...");
        
        const adminUser = {
            id: 1,
            lastName: "Ouedraogo",
            firstName: "Josue",
            phone: "+212772376608",
            password: this.hashPassword("Passw0rd6634"),
            validated: true,
            role: 'admin',
            registrationDate: new Date().toISOString(),
            validationDate: new Date().toISOString()
        };
        
        this.users.push(adminUser);
        localStorage.setItem('myhouse_users', JSON.stringify(this.users));
        
        console.log("✅ Compte admin créé :", adminUser);
    } else {
        console.log("✅ Compte admin déjà existant");
    }
}






    
    sendWhatsAppOTP(phone, otp, user) {
        const message = `🔐 CODE OTP MYHOUSE\n\n` +
                       `Bonjour ${user.firstName || 'Utilisateur'},\n\n` +
                       `Votre code de vérification est : ${otp}\n` +
                       `Valable 10 minutes\n\n` +
                       `Ne partagez pas ce code.\n` +
                       `Plateforme MYHOUSE`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${phone.replace('+', '')}?text=${encodedMessage}`;
        
        // Ouvrir WhatsApp
        window.open(whatsappLink, '_blank');
        
        console.log(`📱 OTP ${otp} envoyé à ${phone}`);
        alert(`📱 WhatsApp ouvert ! Le code OTP est ${otp}`);
    }
    
    verifyOTP() {
        const phone = document.getElementById('otpPhone').textContent;
        const enteredOTP = document.getElementById('otpInput').value.trim();
        const session = this.sessions[phone];
        
        if (!session) {
            alert("Session expirée. Veuillez vous reconnecter.");
            this.backToLogin();
            return;
        }
        
        if (Date.now() > session.otpExpiry) {
            alert("OTP expiré. Veuillez en demander un nouveau.");
            this.resendOTP();
            return;
        }
        
        if (enteredOTP === session.otp) {
            // Connexion réussie
            this.createSession(session.user);
            this.showAppContent();
        } else {
            document.getElementById('otpError').textContent = "Code OTP incorrect";
            document.getElementById('otpError').classList.remove('hidden');
        }
    }
    
    resendOTP() {
        const phone = document.getElementById('otpPhone').textContent;
        const session = this.sessions[phone];
        
        if (session) {
            this.sendOTP(phone, session.user);
            alert("Nouveau OTP envoyé !");
        }
    }
    
    backToLogin() {
        document.getElementById('loginStep1').classList.remove('hidden');
        document.getElementById('loginStep2').classList.add('hidden');
    }
    
    createSession(user) {
        const session = {
            user,
            loginTime: Date.now(),
            token: this.generateToken()
        };
        
        localStorage.setItem('current_user', JSON.stringify(session));
        console.log("✅ Session créée pour :", user.phone);
    }
    
   getCurrentUser() {
    const sessionStr = localStorage.getItem('current_user');
    if (!sessionStr) return null;
    
    const session = JSON.parse(sessionStr);
    const sessionDuration = 24 * 60 * 60 * 1000; // 24h
    
    if (Date.now() - session.loginTime > sessionDuration) {
        localStorage.removeItem('current_user');
        return null;
    }
    
    return session.user;
}
   async register() {
    const lastName = document.getElementById('registerLastName').value.trim();
    const firstName = document.getElementById('registerFirstName').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    console.log("📝 Tentative d'inscription:", { lastName, firstName, phone });
    
    // Validation
    if (!lastName || !firstName || !phone || !password || !confirmPassword) {
        alert("❌ Veuillez remplir tous les champs");
        return;
    }
    
    // Valider format téléphone
    if (!phone.startsWith('+')) {
        alert("❌ Le numéro doit commencer par + (format international)");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("❌ Les mots de passe ne correspondent pas");
        return;
    }
    
    if (password.length < 8) {
        alert("❌ Le mot de passe doit contenir au moins 8 caractères");
        return;
    }
    
    // Nettoyer le téléphone
    const cleanPhone = phone.replace(/\s+/g, '');
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = this.users.some(u => u.phone === cleanPhone);
    const pendingExists = this.pendingRegistrations.some(u => u.phone === cleanPhone);
    
    console.log("🔍 Vérification existence:", { 
        users: this.users.length, 
        pending: this.pendingRegistrations.length,
        userExists, 
        pendingExists 
    });
    
    if (userExists || pendingExists) {
        alert("❌ Un compte avec ce téléphone existe déjà");
        return;
    }
    
    // Créer l'utilisateur
    const newUser = {
        id: Date.now(),
        lastName,
        firstName,
        phone: cleanPhone,
        password: this.hashPassword(password), // Hash avec la méthode simple
        validated: false,
        role: 'user',
        registrationDate: new Date().toISOString()
    };
    
    console.log("✅ Nouvel utilisateur créé:", newUser);
    
    // Ajouter à la liste des inscriptions en attente
    this.pendingRegistrations.push(newUser);
    localStorage.setItem('pending_registrations', JSON.stringify(this.pendingRegistrations));
    
    console.log("💾 Inscription sauvegardée:", this.pendingRegistrations);
    
    // Afficher le message d'attente
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('pendingRegistration').classList.remove('hidden');
    
    // Afficher les informations
    document.getElementById('pendingName').textContent = `${lastName} ${firstName}`;
    document.getElementById('pendingPhone').textContent = cleanPhone;
    
    // Envoyer notification WhatsApp à l'admin
    this.sendAdminNotification(newUser);
    
    alert("✅ Demande d'inscription envoyée !\n\n" +
          "L'administrateur a été notifié par WhatsApp et validera votre compte sous peu.");
}
    sendAdminNotification(user) {
        const adminPhone = this.adminCredentials.phone;
        const message = `🔔 NOUVELLE INSCRIPTION MYHOUSE\n\n` +
                       `👤 Nom: ${user.lastName} ${user.firstName}\n` +
                       `📞 Téléphone: ${user.phone}\n` +
                       ` Date: ${new Date().toLocaleDateString('fr-FR')}\n\n` +
                       `✅ Pour valider, ouvrez le panel admin\n` +
                       `❌ Pour rejeter, contactez l'utilisateur`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${adminPhone.replace('+', '')}?text=${encodedMessage}`;
        
        // Ouvrir WhatsApp pour l'admin
        window.open(whatsappLink, '_blank');
        
        console.log("📱 Notification admin envoyée :", whatsappLink);
    }
   hashPassword(password) {
    if (!password) return '';
    
    // Salt FIXE - NE CHANGEZ JAMAIS CETTE VALEUR !
    const SALT = "myhouse_secure_salt_2024_@j0su3";
    
    // Concaténer et encoder en Base64
    try {
        return btoa(password + SALT);
    } catch (e) {
        // Fallback pour certains navigateurs
        return window.btoa(password + SALT);
    }
}


    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    showAppContent() {
        const user = this.getCurrentUser();
        const container = document.querySelector('.container');
        
        if (!container) return;
        
        // Restaurer le contenu original de l'application
        container.innerHTML = `
            <!-- Header Section -->
            <header class="text-center mb-12">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
                    <i class="fas fa-folder-open text-white text-2xl"></i>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                    Constitution du Dossier
                </h1>
                <p class="text-gray-600 text-lg max-w-2xl mx-auto">
                    Plateforme sécurisée pour la création et la gestion de vos dossiers administratifs
                </p>
                
                <!-- Barre utilisateur -->
                <div class="mt-6 flex justify-center">
                    <div class="flex items-center gap-3 bg-white rounded-full shadow-lg px-6 py-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-blue-600"></i>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-800">
                                ${user.firstName} ${user.lastName}
                            </p>
                            <p class="text-xs text-gray-500">${user.role === 'admin' ? '👑 Administrateur' : '👤 Utilisateur'}</p>
                        </div>
                        <button onclick="auth.logout()" 
                                class="ml-4 text-gray-500 hover:text-red-600 transition px-3 py-1 rounded-lg hover:bg-gray-100">
                            <i class="fas fa-sign-out-alt"></i> Déconnexion
                        </button>
                        ${user.role === 'admin' ? `
                        <a href="admin.html" target="_blank"
                           class="ml-2 text-green-600 hover:text-green-800 transition px-3 py-1 rounded-lg hover:bg-green-50">
                            <i class="fas fa-user-shield"></i> Admin Panel
                        </a>
                        ` : ''}
                    </div>
                </div>
            </header>

            <!-- Main Form Card -->
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                
                <!-- Card Header -->
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                    <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                        <i class="fas fa-file-alt"></i>
                        <span id="form-title">Sélectionnez le type de dossier</span>
                    </h2>
                    <p class="text-blue-100 mt-2" id="form-subtitle">
                        Choisissez parmi les options disponibles pour démarrer la constitution de votre dossier
                    </p>
                </div>

                <!-- Form Content -->
                <form action="#" method="post" class="p-8 md:p-10">
                    <div class="space-y-8">
                        
                        <!-- Step 1: Dossier Type Selection -->
                        <div id="step1" class="fade-in">
                            <div class="space-y-4">
                                <label class="block">
                                    <span class="text-gray-700 font-semibold text-lg mb-2 block">
                                        Type de dossier <span class="text-red-500">*</span>
                                    </span>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i class="fas fa-list-ul text-blue-500"></i>
                                        </div>
                                        <select 
                                            name="dossier_type" 
                                            id="dossier_type"
                                            class="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 font-medium cursor-pointer bg-white hover:border-gray-300"
                                        >
                                            <option value="" disabled selected class="text-gray-400">
                                                Sélectionnez une option
                                            </option>
                                            <option value="energinova" class="py-3">
                                                <span class="font-medium">ENERGINOVA</span>
                                                <span class="text-gray-500 text-sm ml-2">- Dossier énergie & innovation</span>
                                            </option>
                                            <option value="myhouse" class="py-3">
                                                <span class="font-medium">MYHOUSE</span>
                                                <span class="text-gray-500 text-sm ml-2">- Dossier logement & propriété</span>
                                            </option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <i class="fas fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </label>

                                <!-- Info Cards -->
                                <div class="grid md:grid-cols-2 gap-6 mt-8">
                                    <div class="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer" onclick="selectDossier('energinova')">
                                        <div class="flex items-center gap-3 mb-3">
                                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <i class="fas fa-bolt text-blue-600"></i>
                                            </div>
                                            <h3 class="font-bold text-gray-800">ENERGINOVA</h3>
                                        </div>
                                        <p class="text-gray-600 text-sm">
                                            Pour les projets d'innovation énergétique, rénovation et amélioration de l'efficacité énergétique.
                                        </p>
                                    </div>

                                    <div class="border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer" onclick="selectDossier('myhouse')">
                                        <div class="flex items-center gap-3 mb-3">
                                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <i class="fas fa-home text-green-600"></i>
                                            </div>
                                            <h3 class="font-bold text-gray-800">MYHOUSE</h3>
                                        </div>
                                        <p class="text-gray-600 text-sm">
                                            Pour les dossiers relatifs à l'achat, la construction ou la rénovation de votre logement.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: File Type Selection -->
                        <div id="step2" class="hidden fade-in">
                            <div class="space-y-6">
                                <div class="mb-6">
                                    <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-3">
                                        <i class="fas fa-folder mr-2"></i>
                                        <span id="selected-dossier-text"></span>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                                        Sélectionnez le type de fichier à ajouter
                                    </h3>
                                    <p class="text-gray-600">
                                        Choisissez parmi les types de documents disponibles pour votre dossier
                                    </p>
                                </div>

                                <!-- File Type Grid -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <!-- Attestation de réalisation -->
                                    <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="attestation_realisation">
                                        <div class="flex flex-col items-center text-center">
                                            <div class="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <i class="fas fa-file-certificate text-blue-600 text-2xl"></i>
                                            </div>
                                            <h4 class="font-bold text-gray-800 mb-1">Attestation de réalisation</h4>
                                            <p class="text-gray-500 text-sm">Document attestant de la réalisation des travaux</p>
                                        </div>
                                    </div>

                                    <!-- Attestation signataire -->
                                    <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="attestation_signataire">
                                        <div class="flex flex-col items-center text-center">
                                            <div class="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <i class="fas fa-signature text-blue-600 text-2xl"></i>
                                            </div>
                                            <h4 class="font-bold text-gray-800 mb-1">Attestation signataire</h4>
                                            <p class="text-gray-500 text-sm">Document avec signature des parties prenantes</p>
                                        </div>
                                    </div>

                                    <!-- CDC (Cahier des charges) -->
                                    <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="cdc">
                                        <div class="flex flex-col items-center text-center">
                                            <div class="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <i class="fas fa-clipboard-list text-blue-600 text-2xl"></i>
                                            </div>
                                            <h4 class="font-bold text-gray-800 mb-1">Cahier des charges</h4>
                                            <p class="text-gray-500 text-sm">Spécifications techniques et fonctionnelles</p>
                                        </div>
                                    </div>

                                    <!-- Devis -->
                                    <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="devis">
                                        <div class="flex flex-col items-center text-center">
                                            <div class="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <i class="fas fa-file-invoice-dollar text-blue-600 text-2xl"></i>
                                            </div>
                                            <h4 class="font-bold text-gray-800 mb-1">Devis</h4>
                                            <p class="text-gray-500 text-sm">Estimation des coûts et prestations proposées</p>
                                        </div>
                                    </div>

                                    <!-- Facture -->
                                    <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="facture">
                                        <div class="flex flex-col items-center text-center">
                                            <div class="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <i class="fas fa-receipt text-blue-600 text-2xl"></i>
                                            </div>
                                            <h4 class="font-bold text-gray-800 mb-1">Facture</h4>
                                            <p class="text-gray-500 text-sm">Document comptable pour règlement des prestations</p>
                                        </div>
                                    </div>

                                    <!-- Rapport -->
                                    <div class="file-option border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group" data-value="rapport">
                                        <div class="flex flex-col items-center text-center">
                                            <div class="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <i class="fas fa-chart-bar text-blue-600 text-2xl"></i>
                                            </div>
                                            <h4 class="font-bold text-gray-800 mb-1">Rapport</h4>
                                            <p class="text-gray-500 text-sm">Document d'analyse et de synthèse des travaux</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Hidden input for selected file type -->
                                <input type="hidden" id="selected_file_type" name="file_type" value="">

                                <!-- Selected file indicator -->
                                <div id="selected-file-indicator" class="hidden p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <i class="fas fa-check text-blue-600"></i>
                                            </div>
                                            <div>
                                                <p class="font-medium text-gray-800">Type de fichier sélectionné :</p>
                                                <p id="selected-file-name" class="text-blue-700 font-semibold"></p>
                                            </div>
                                        </div>
                                        <button type="button" onclick="clearFileSelection()" class="text-gray-500 hover:text-gray-700">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation & Action Buttons -->
                        <div class="pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-gray-100">
                            <button 
                                type="button"
                                id="backBtn"
                                onclick="goBackToStep1()"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 hidden"
                            >
                                <i class="fas fa-arrow-left"></i>
                                Retour
                            </button>
                            
                            <div class="flex gap-4">
                                <button 
                                    type="button"
                                    id="cancelBtn"
                                    class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <i class="fas fa-times"></i>
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    id="submitBtn"
                                    disabled
                                    class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
                                >
                                    <i class="fas fa-arrow-right"></i>
                                    <span id="submit-text">Continuer</span>
                                </button>
                            </div>
                        </div>

                        <!-- Help Text -->
                        <div class="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                            <span id="help-text">
                                Sélectionnez d'abord le type de dossier pour continuer
                            </span>
                        </div>
                    </div>

                    <!-- FORMULAIRE DYNAMIQUE QUI APPARAÎT APRÈS LE CHOIX DU FICHIER -->
                    <div id="dynamic-form" class="hidden mt-10 p-6 border-2 border-blue-100 rounded-xl bg-blue-50">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">
                            Remplissez les informations du document
                        </h3>
                        <div id="dynamic-fields" class="space-y-4">
                            <!-- Champs générés en JS selon le type de fichier -->
                        </div>
                    </div>
                </form>
            </div>

            <!-- Footer Info -->
            <footer class="mt-10 text-center text-gray-500 text-sm">
                <p class="flex items-center justify-center gap-2">
                    <i class="fas fa-shield-alt"></i>
                    Vos données sont sécurisées et traitées de manière confidentielle
                </p>
                <p class="mt-2">
                    Connecté en tant que : ${user.firstName} ${user.lastName}
                </p>
            </footer>
        `;
        
        // Réinitialiser les scripts de l'application
        this.initializeAppScripts();
    }
    
    initializeAppScripts() {
        // Réinitialiser les écouteurs d'événements pour l'application
        if (typeof initApp === 'function') {
            initApp();
        }
    }
    
    logout() {
        if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            localStorage.removeItem('current_user');
            this.showAuthForm();
        }
    }

    debugAuth() {
        console.log("=== DEBUG AUTHENTIFICATION ===");
        console.log("1. Utilisateurs dans localStorage:", this.users);
        console.log("2. Inscriptions en attente:", this.pendingRegistrations);
        console.log("3. Sessions:", this.sessions);
        console.log("4. Admin credentials:", this.adminCredentials);
        
        // Test hash
        const testPassword = "test123";
        const hash = this.hashPassword(testPassword);
        console.log("5. Test hash 'test123':", hash);
        console.log("6. Même hash deux fois:", this.hashPassword(testPassword) === hash);
        
        // Vérifier un utilisateur spécifique
        const testPhone = "+21277986162";
        const testUser = this.users.find(u => u.phone === testPhone);
        console.log("7. Utilisateur +21277986162:", testUser);
        
        if (testUser) {
            console.log("8. Test mot de passe '77986162jo':", 
                this.hashPassword("77986162jo") === testUser.password);
        }
    }
}

// Initialiser le système d'authentification
const auth = new AuthSystem();
window.auth = auth;
