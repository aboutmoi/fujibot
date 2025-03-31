const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

// Configuration
const TOKEN = 'XXXXX';
const URL_PRODUIT = 'https://eshop.fujifilm-x.com/fr/fujifilm-x100vi.html';
const INTERVAL_VERIFICATION = 5 * 60 * 1000; // 5 minutes en millisecondes
const CHANNEL_ID = 'XXXXX';

// État précédent de disponibilité
let etatPrecedent = false;

// Création du client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Fonction pour vérifier la disponibilité du produit
async function verifierDisponibilite() {
    try {
        const response = await axios.get(URL_PRODUIT);
        const $ = cheerio.load(response.data);
        
        // Pour les produits en stock, il y a un div avec la classe "stock available" et le texte "En stock"
        // Pour les produits en rupture, il y a un div avec la classe "stock unavailable" et le texte "En rupture"
        const stockElement = $('.product-info-stock-sku .stock');
        const estDisponible = stockElement.hasClass('available');
        const statusText = stockElement.text().trim();
        
        // Affichage du statut dans la console
        const heure = new Date().toLocaleTimeString();
        console.log(`[${heure}] Vérification effectuée - Statut: ${estDisponible ? 'Disponible' : 'Indisponible'} (${statusText})`);
        
        // Envoyer dispo dans le canal Discord
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (channel) {
            await channel.send(`[${heure}] État du Fujifilm X100VI : ${estDisponible ? '✅ Disponible' : '❌ Indisponible'} (${statusText})`);
            
            // Si le produit vient de passer en stock, envoyer une notification spéciale
            if (estDisponible && !etatPrecedent) {
                await channel.send(`@everyone 🎉 **ALERTE DISPONIBILITÉ** 🎉\nLe Fujifilm X100VI est maintenant disponible !\nLien direct : ${URL_PRODUIT}`);
            }
        }
        
        etatPrecedent = estDisponible;
        
    } catch (error) {
        console.error('Erreur lors de la vérification:', error.message);
        
        // Envoyer un message d'erreur dans le canal Discord
        try {
            const channel = await client.channels.fetch(CHANNEL_ID);
            if (channel) {
                await channel.send(`⚠️ Erreur lors de la vérification : ${error.message}`);
            }
        } catch (e) {
            console.error('Impossible d\'envoyer le message d\'erreur:', e.message);
        }
    }
}

// Événement de connexion du bot
client.once('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    
    // Envoyer un message de démarrage
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (channel) {
            await channel.send('@everyone Le bot de surveillance du Fujifilm X100VI est maintenant en ligne ! 🤖');
        }
    } catch (error) {
        console.error('Impossible d\'envoyer le message de démarrage:', error.message);
    }
    
    // Première vérification immédiate
    verifierDisponibilite();
    
    // Démarrage de la vérification périodique
    setInterval(verifierDisponibilite, INTERVAL_VERIFICATION);
});

// Gestion des erreurs
client.on('error', (error) => {
    console.error('Erreur Discord.js:', error.message);
});

// Connexion du bot
client.login(TOKEN); 
