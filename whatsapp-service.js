// whatsapp-service.js
class WhatsAppService {
    constructor() {
        this.adminPhone = "+212772376608"; // Votre numéro
        this.templateMessages = {
            registration: {
                admin: `🔔 NOUVELLE INSCRIPTION MYHOUSE

👤 Nom: {nom}
📞 Téléphone: {phone}
📧 Email: {email}
📅 Date: {date}

✅ Lien de validation : {validationUrl}
❌ Lien de rejet : {rejectionUrl}

Message automatique - Plateforme MYHOUSE`,
                
                user_pending: `⏳ VOTRE INSCRIPTION EST EN ATTENTE

Bonjour {prenom},

Votre inscription sur MYHOUSE a bien été reçue.
L'administrateur va la valider sous peu.

Vous recevrez une notification WhatsApp une fois votre compte activé.

Merci pour votre confiance !`,
                
                user_approved: `✅ VOTRE COMPTE EST MAINTENANT VALIDÉ !

Bonjour {prenom},

Votre compte MYHOUSE a été validé avec succès !

Vous pouvez maintenant :
1. Vous connecter à votre compte
2. Créer vos dossiers
3. Générer vos documents

Lien de connexion : {loginUrl}

Merci et bienvenue !`,
                
                user_rejected: `❌ INSCRIPTION NON VALIDÉE

Bonjour {prenom},

Votre inscription n'a pas pu être validée.

Raison : {reason}

Veuillez contacter le support pour plus d'informations.

Cordialement,
L'équipe MYHOUSE`
            },
            
            otp: `🔐 CODE DE VÉRIFICATION MYHOUSE

Votre code OTP est : {otp}
Valable 10 minutes

Ne partagez jamais ce code.

L'équipe MYHOUSE`
        };
    }
    
    // Méthode principale pour envoyer un message
    sendMessage(phone, template, variables = {}) {
        let message = this.templateMessages[template];
        
        if (!message) {
            console.error("Template non trouvé:", template);
            return null;
        }
        
        // Remplacer les variables
        for (const [key, value] of Object.entries(variables)) {
            message = message.replace(new RegExp(`{${key}}`, 'g'), value);
        }
        
        // Encoder pour URL
        const encodedMessage = encodeURIComponent(message);
        
        // Créer le lien WhatsApp
        const whatsappLink = `https://wa.me/${phone.replace('+', '')}?text=${encodedMessage}`;
        
        return whatsappLink;
    }
    
    // Ouvrir WhatsApp avec le message
    openWhatsApp(link) {
        // Ouvrir dans un nouvel onglet
        const newWindow = window.open(link, '_blank', 'width=600,height=700');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            // Si les popups sont bloquées, afficher le lien
            alert(`📱 WhatsApp bloqué ! Cliquez sur ce lien : ${link}`);
            
            // Créer un lien cliquable
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; background: #25D366; color: white; padding: 15px; border-radius: 10px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <a href="${link}" target="_blank" style="color: white; text-decoration: none; font-weight: bold;">
                        <i class="fab fa-whatsapp"></i> Ouvrir WhatsApp
                    </a>
                </div>
            `;
            document.body.appendChild(tempDiv);
            
            // Supprimer après 10 secondes
            setTimeout(() => {
                if (tempDiv.parentNode) {
                    tempDiv.parentNode.removeChild(tempDiv);
                }
            }, 10000);
        }
        
        return newWindow;
    }
    
    // Envoyer OTP à l'utilisateur
    sendOTP(phone, otpCode) {
        const link = this.sendMessage(phone, 'otp', { otp: otpCode });
        if (link) {
            this.openWhatsApp(link);
        }
        return link;
    }
    
    // Notifier l'admin d'une nouvelle inscription
    notifyAdminRegistration(userData) {
        const link = this.sendMessage(this.adminPhone, 'registration.admin', {
            nom: `${userData.lastName} ${userData.firstName}`,
            phone: userData.phone,
            email: userData.email,
            date: new Date().toLocaleDateString('fr-FR'),
            validationUrl: `${window.location.origin}/admin.html?approve=${userData.id}`,
            rejectionUrl: `${window.location.origin}/admin.html?reject=${userData.id}`
        });
        
        if (link) {
            this.openWhatsApp(link);
        }
        return link;
    }
    
    // Notifier l'utilisateur que son compte est validé
    notifyUserApproval(userData) {
        const link = this.sendMessage(userData.phone, 'registration.user_approved', {
            prenom: userData.firstName,
            loginUrl: window.location.href
        });
        
        if (link) {
            this.openWhatsApp(link);
        }
        return link;
    }
    
    // Notifier l'utilisateur que son compte est rejeté
    notifyUserRejection(userData, reason = "Informations incomplètes") {
        const link = this.sendMessage(userData.phone, 'registration.user_rejected', {
            prenom: userData.firstName,
            reason: reason
        });
        
        if (link) {
            this.openWhatsApp(link);
        }
        return link;
    }
}

// Initialiser le service
const whatsappService = new WhatsAppService();
window.whatsappService = whatsappService;

