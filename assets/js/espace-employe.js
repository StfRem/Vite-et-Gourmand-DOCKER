// --- UTILITAIRES DE STOCKAGE ---
// Cette fonction récupère les données et les transforme en liste utilisable
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Cette fonction enregistre les listes dans le navigateur
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// -------------------------------
// Vérification de l'accès employé
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "employe") {
    alert("Accès réservé aux employés.");
    location.href = "./login.html";
}

// DONNÉES
let commandes = [];
let avisRecus = [];
//let users = []; a supprimer pour l'employé
let menusFromDB = []; // Menus depuis la base de données
let plats = getFromLocalStorage("plats");
let horaires = [];

// SÉLECTEURS
const listeMenus = document.getElementById("liste-menus");
const listePlats = document.getElementById("liste-plats");
const listeHoraires = document.getElementById("liste-horaires");
const listeCommandes = document.getElementById("liste-commandes");
const listeAvis = document.getElementById("liste-avis");
const filtreStatut = document.getElementById("filtre-statut");
const filtreClient = document.getElementById("filtre-client");

// FONCTIONS GÉNÉRIQUES
function afficherListe(listeElement, data, renderItem, emptyMessage) {
    listeElement.innerHTML = data.length === 0 ? `<p>${emptyMessage}</p>` : "";
    data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = renderItem(item);
        listeElement.appendChild(li);
    });
}

function supprimerElement(data, setData, id, message) {
    if (confirm(message)) {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        return true;
    }
    return false;
}

// CHARGER LES MENUS DEPUIS LA BDD
async function chargerMenusDepuisServeur() {
    try {
        const response = await fetch("../PHP/getMenus.php");
        const tousLesMenus = await response.json();
        const idsPermanents = [1, 2, 3]; 
        
        // Filtrage des menus personnalisés
        menusFromDB = tousLesMenus.filter(menu => !idsPermanents.includes(Number(menu.id)));
        afficherMenus();
    } catch (error) {
        console.error("Erreur chargement menus :", error);
    }
}

// AFFICHAGE MENUS (Uniquement les menus créés en BDD)
function afficherMenus() {
    afficherListe(
        listeMenus,
        menusFromDB,
        (menu) => {
            const nomAffiche = menu.titre || menu.nom;
            return `
                <div class="admin-item-info">
                    <strong>${nomAffiche}</strong><br>
                    ${menu.description}<br>
                    Prix : ${menu.prix} €
                </div>
                <div class="admin-actions">
                    <button class="btn-modifier-menu" data-id="${menu.id}">Modifier</button>
                    <button class="btn-danger btn-supprimer-menu" data-id="${menu.id}">Supprimer</button>
                </div>
            `;
        },
        "Aucun menu personnalisé n'a été créé."
    );
}

// AFFICHAGE PLATS
function afficherPlats() {
    afficherListe(
        listePlats,
        plats,
        (plat) => `
            <div class="admin-item-info">
                <strong>${plat.nom}</strong>
                <span>${plat.description}</span>
            </div>
            <div class="admin-actions">
                <button class="btn-action btn-modifier-plat" data-id="${plat.id}">Modifier</button>
                <button class="btn-danger btn-supprimer-plat" data-id="${plat.id}">Supprimer</button>
            </div>
        `,
        "Aucun plat enregistré."
    );
}

// AFFICHAGE COMMANDES
async function chargerCommandesDepuisServeur() {
    try {
        const response = await fetch("../PHP/getCommandesAdmin.php");
        const result = await response.json();

        if (result.status === "success") {
            commandes = result.data;
            afficherCommandes();
        } else {
            console.error("Erreur chargement commandes :", result.message);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

// ON AFFICHE LA COMMANDE AVEC LES FILTRES APPLIQUÉS
function afficherCommandes() {
    const recherche = filtreClient.value.toLowerCase();
    const statutFiltre = filtreStatut.value;

    const commandesFiltrees = commandes.filter(cmd => {
        const matchStatut = statutFiltre === "" || cmd.statut === statutFiltre;
        const matchNom = cmd.client_nom.toLowerCase().includes(recherche);
        return matchStatut && matchNom;
    });

    listeCommandes.innerHTML = commandesFiltrees.length === 0
        ? "<p>Aucune commande trouvée.</p>"
        : "";

    commandesFiltrees.forEach(cmd => {
        const li = document.createElement("li");
        li.classList.add("admin-item");

        li.innerHTML = `
            <div class="admin-item-info">
                    <strong>Commande #${cmd.id}</strong>
                    <span>Client : ${cmd.client_nom}</span>
                    <span>Menu : ${cmd.menuTitre}</span>
                    <span>Nombre de personnes : ${cmd.nbPersonnes}</span>
                    <span>Prix total : ${cmd.prixTotal} €</span>
                    <span>Prestation : ${cmd.datePrestation.split('-').reverse().join('-')} à ${cmd.heurePrestation}</span>
                    <span>Adresse : ${cmd.adresse}, ${cmd.cp}, ${cmd.ville}</span>
                    <span>Téléphone : ${cmd.gsm}</span>
                    <span class="statut-ligne">Statut actuel : <strong>${cmd.statut}</strong></span>
                    ${cmd.materiel ? '<span style="color:red;">⚠️ Matériel en prêt</span>' : ''}
            </div>


            <div class="admin-actions">
                <select class="select-statut" data-id="${cmd.id}">
                    <option value="">Changer statut</option>
                    <option value="accepté">Accepté</option>
                    <option value="en préparation">En préparation</option>
                    <option value="en cours de livraison">En cours de livraison</option>
                    <option value="livré">Livré</option>
                    <option value="terminée">Terminée</option>
                    ${cmd.materiel ? '<option value="en attente du retour de matériel">Retour matériel</option>' : ''}
                </select>

                <button class="btn-danger btn-annuler" data-id="${cmd.id}">Annuler</button>
            </div>
        `;

        listeCommandes.appendChild(li);
    });
}

// AFFICHAGE AVIS
async function chargerAvisDepuisServeur() {
    try {
        const response = await fetch("../PHP/getAvis.php");
        const result = await response.json();

        if (result.status === "success") {
            avisRecus = result.data;
            afficherAvis();
        } else {
            console.error("Erreur serveur :", result.message);
        }
    } catch (error) {
        console.error("Erreur réseau lors du chargement des avis :", error);
    }
}
function afficherAvis() {
    const listeAvis = document.getElementById("liste-avis");
    listeAvis.innerHTML = avisRecus.length === 0 ? "<p>Aucun avis en attente.</p>" : "";

    avisRecus.forEach(a => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${a.nom_client}</strong> (Commande #${a.commande_id})<br>
            Note : ${a.note}/5<br>
            "${a.commentaire}"<br>
            <button class="btn-valider-avis" data-id="${a.id}">Valider</button>
            <button class="btn-refuser-avis btn-danger" data-id="${a.id}">Supprimer</button>
        `;
        listeAvis.appendChild(li);
    });
}

// AFFICHAGE HORAIRES
function afficherHoraires() {

    // Ordre logique des jours pour le tri
    const ordreJours = [
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi",
        "dimanche"
    ];

    // Tri des horaires selon l’ordre des jours écrit en Majuscule ou minuscule
    const horairesTries = [...horaires].sort((a, b) => {
        const ja = a.jour.toLowerCase();
        const jb = b.jour.toLowerCase();
        return ordreJours.indexOf(ja) - ordreJours.indexOf(jb);
    });


    afficherListe(
        listeHoraires,
        horairesTries,
        (h) => `
            <strong>${h.jour}</strong> : ${h.ouverture} - ${h.fermeture}<br>
            <button class="btn-modifier-horaire" data-id="${h.id}">Modifier</button>
            <button class="btn-supprimer-horaire" data-id="${h.id}">Supprimer</button>
        `,
        "Aucun horaire enregistré."
    );
}

// ÉCOUTEURS D'ÉVÉNEMENTS (les boutons)
document.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // --- SUPPRIMER MENU ---
    if (e.target.classList.contains("btn-supprimer-menu")) {
        if (confirm("Supprimer ce menu définitivement ?")) {
            const response = await fetch("../PHP/supprimerMenu.php", {
                method: "POST",
                credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if (result.success) chargerMenusDepuisServeur();
            else alert("Erreur : " + result.message);
        }
    }

    // --- MODIFIER MENU ---
    if (e.target.classList.contains("btn-modifier-menu")) {
        const menu = menusFromDB.find(m => m.id == id);
        if (!menu) return;

        const nouveauTitre = prompt("Titre du menu :", menu.titre || menu.nom);
        const nouvelleDesc = prompt("Description :", menu.description);
        const nouveauPrix = prompt("Prix :", menu.prix);

        if (nouveauTitre && nouvelleDesc && nouveauPrix) {
            const response = await fetch("../PHP/modifierMenu.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: id, titre: nouveauTitre, description: nouvelleDesc, prix: parseFloat(nouveauPrix) 
                })
            });
            const result = await response.json();
            if (result.success) {
                alert("Menu mis à jour !");
                chargerMenusDepuisServeur();
            }
        }
    }

    // 3 - PLATS
    if (e.target.classList.contains("btn-supprimer-plat")) {
        if (supprimerElement(plats, (newData) => { plats = newData; }, id, "Supprimer ce plat ?")) {
            saveToLocalStorage("plats", plats);
            afficherPlats();
        }
    }
    if (e.target.classList.contains("btn-modifier-plat")) {
        const plat = plats.find(p => p.id === id);
        if (!plat) return;
        const nom = prompt("Nom du plat :", plat.nom);
        const description = prompt("Description :", plat.description);
        if (!nom || !description) {
            alert("Tous les champs sont obligatoires.");
            return;
        }
        plat.nom = nom;
        plat.description = description;
        saveToLocalStorage("plats", plats);
        afficherPlats();
    }

    // 4 - COMMANDES
    if (e.target.classList.contains("btn-annuler")) {
        const commande = commandes.find(cmd => cmd.id == id);
        if (!commande) return;

        const contact = prompt("Mode de contact utilisé pour prévenir le client (appel ou mail) :");
        const motif = prompt("Motif de l'annulation :");

        if (!contact || !motif) {
            alert("Annulation annulée : tous les champs sont obligatoires.");
            return;
        }

        // On envoie au backend pour mettre à jour la commande en BDD
        fetch("../PHP/annulerCommande.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, contact, motif })
        })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert("Commande annulée avec succès !");
                    chargerCommandesDepuisServeur(); // recharge depuis MySQL
                } else {
                    alert("Erreur : " + result.message);
                }
            });
    }

    // 5 - AVIS   (different de l'employé) a verifier
    if (e.target.classList.contains("btn-valider-avis") || e.target.classList.contains("btn-refuser-avis")) {
        const idAvis = e.target.dataset.id;
        const action = e.target.classList.contains("btn-valider-avis") ? 'valider' : 'supprimer';

        if (action === 'supprimer' && !confirm("Supprimer cet avis ?")) return;

        fetch("../PHP/modifierStatutAvis.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: idAvis, action: action })
        })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    chargerAvisDepuisServeur(); // Rafraîchit la liste
                }
            });
    }

    // 6 - HORAIRES
    if (e.target.classList.contains("btn-supprimer-horaire")) {

        const id = e.target.dataset.id; // ← Récupération de l'ID

        if (confirm("Supprimer cet horaire ?")) {
            fetch("../PHP/supprimerHoraire.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
                .then(r => r.json())
                .then(() => chargerHorairesDepuisServeur());
        }
    }

    if (e.target.classList.contains("btn-modifier-horaire")) {

        const id = e.target.dataset.id;

        const h = horaires.find(h => h.id == id);
        if (!h) return;

        const jour = prompt("Jour :", h.jour);
        const ouverture = prompt("Heure d'ouverture :", h.ouverture);
        const fermeture = prompt("Heure de fermeture :", h.fermeture);

        if (!jour || !ouverture || !fermeture) {
            alert("Tous les champs sont obligatoires.");
            return;
        }

        fetch("../PHP/modifierHoraire.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, jour, ouverture, fermeture })
        })
            .then(r => r.json())
            .then(() => chargerHorairesDepuisServeur());
    }
});

// CRÉATION MENU (Uniquement BDD)
document.getElementById("btn-ajout-menu").addEventListener("click", async () => {
    const nom = prompt("Nom du menu :");
    const description = prompt("Description :");
    const prixStr = prompt("Prix :");
    const prix = parseFloat(prixStr);

    if (!nom || !description || isNaN(prix) || prix <= 0) {
        alert("Saisie invalide.");
        return;
    }

    try {
        const response = await fetch("../PHP/creationmenu-admin_employe.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
            body: JSON.stringify({
                nom: nom.trim(),
                description: description.trim(),
                prix: prix
            })
        });

        const result = await response.json();
        if (result.success) {
            alert("Menu créé avec succès !");
            await chargerMenusDepuisServeur(); // Recharge uniquement la BDD
        } else {
            alert("Erreur BDD : " + result.message);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Impossible de contacter le serveur.");
    }
});

// CRÉATION PLAT
document.getElementById("btn-ajout-plat").addEventListener("click", () => {
    const ajouterPlat = (type) => {
        const nom = prompt(`Nom du ${type} (laisser vide si aucun) :`);
        if (nom) {
            const description = prompt(`Description du ${type} :`);
            plats.push({
                id: "PLAT-" + Date.now(),
                nom: nom.trim(),
                description: description.trim()
            });
        }
    };
    ajouterPlat("entrée");
    ajouterPlat("plat principal");
    ajouterPlat("dessert");
    saveToLocalStorage("plats", plats);
    afficherPlats();
    alert("Plat(s) ajouté(s) avec succès !");
});

// CHANGEMENT DE STATUT COMMANDE
document.addEventListener("change", (e) => {
    // On cible uniquement les menus déroulants de statut des commandes
    if (e.target.classList.contains("select-statut")) {
        const id = e.target.dataset.id;
        const nouveauStatut = e.target.value;

        if (!nouveauStatut) return;

        // Diagnostic : Si tu vois ce message, c'est que le JS fonctionne !
        console.log("Tentative de modification BDD - ID:", id, "Statut:", nouveauStatut);

        if (nouveauStatut === "en attente du retour de matériel") {
            alert(`Email envoyé :
Objet : Retour de matériel
Bonjour,
Vous avez 10 jours pour restituer le matériel. Sinon, 600€ de frais seront appliqués.
Cordialement, L'équipe Vite & Gourmand`);
        }

        // On envoie directement au serveur sans chercher dans le tableau local
        fetch("../PHP/modifierStatutCommande.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, statut: nouveauStatut })
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                alert("Statut mis à jour avec succès !");
                chargerCommandesDepuisServeur(); // Recharge la liste depuis MySQL
            } else {
                alert("Erreur lors de la mise à jour : " + result.message);
            }
        })
        .catch(error => {
            console.error("Erreur réseau ou chemin PHP :", error);
        });
    }
});

// FILTRES COMMANDES
filtreStatut.addEventListener("change", afficherCommandes);
filtreClient.addEventListener("input", afficherCommandes);

// CRÉATION HORAIRE
async function chargerHorairesDepuisServeur() {
    const response = await fetch("../PHP/get_horaires.php");
    const result = await response.json();

    if (result.status === "success") {
        horaires = result.data;   //
        afficherHoraires();
    } else {
        console.error("Erreur chargement horaires :", result.message);
    }
}

document.getElementById("btn-ajout-horaire").addEventListener("click", async () => {
    const jour = prompt("Jour (ex : Lundi) :");
    const ouverture = prompt("Heure d'ouverture (ex : 09:00) :");
    const fermeture = prompt("Heure de fermeture (ex : 18:00) :");

    if (!jour || !ouverture || !fermeture) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    const response = await fetch("../PHP/ajoutHoraire.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jour, ouverture, fermeture })
    });

    const result = await response.json();
    if (result.success) {
        alert("Horaire ajouté !");
        chargerHorairesDepuisServeur();
    } else {
        alert("Erreur : " + result.message);
    }
});

// AFFICHAGE INITIAL
chargerMenusDepuisServeur();
afficherPlats();
chargerHorairesDepuisServeur();
chargerCommandesDepuisServeur();
chargerAvisDepuisServeur();