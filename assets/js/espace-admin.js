// UTILITAIRES
// Les plats sont maintenant stockés en base via des endpoints PHP

// Vérification du rôle administrateur
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") {
    alert("Accès réservé à l'administrateur.");
    location.href = "./login.html";
}

// DONNÉES
let commandes = [];
let avisRecus = [];
let users = [];
let menusFromDB = []; // Menus depuis la base de données
let plats = []; // Chargés depuis le serveur
let horaires = [];

// SÉLECTEURS
const listeEmployes = document.getElementById("liste-employes");
const listeMenus = document.getElementById("liste-menus");
const listePlats = document.getElementById("liste-plats");
const listeHoraires = document.getElementById("liste-horaires");
const listeCommandes = document.getElementById("liste-commandes");
const listeAvis = document.getElementById("liste-avis");
const filtreStatut = document.getElementById("filtre-statut");
const filtreClient = document.getElementById("filtre-client");

// FONCTIONS GÉNÉRIQUES
function afficherListe(listeElement, data, renderItem, emptyMessage) {
    // Clear element safely without using innerHTML for each item
    while (listeElement.firstChild) {
        listeElement.firstChild.remove();
    }
    if (data.length === 0) {
        const p = document.createElement('p');
        p.textContent = emptyMessage;
        listeElement.appendChild(p);
        return;
    }
    data.forEach(item => {
        const li = document.createElement("li");
        // renderItem now returns a DOM fragment or text-safe element
        const content = renderItem(item);
        if (typeof content === 'string') {
            // fallback: create a text node
            li.textContent = content;
        } else if (content instanceof Node) {
            li.appendChild(content);
        } else {
            li.textContent = JSON.stringify(content);
        }
        listeElement.appendChild(li);
    });
}

// supprimé : fonction générique de suppression n'est plus utilisée, données manipulées directement via backend

// AFFICHAGE EMPLOYÉS
function afficherEmployes() {
    const employes = users.filter(u => u.role === "employe");
    afficherListe(
        listeEmployes,
        employes,
        (emp) => {
            const wrapper = document.createElement('div');
            const name = document.createElement('strong');
            name.textContent = emp.fullname;
            wrapper.appendChild(name);
            wrapper.appendChild(document.createElement('br'));

            const email = document.createElement('span');
            email.textContent = `Email : ${emp.email}`;
            wrapper.appendChild(email);
            wrapper.appendChild(document.createElement('br'));

            const statut = document.createElement('span');
            const statutStrong = document.createElement('strong');
            statutStrong.textContent = emp.suspendu ? "EN SUSPENS" : "Actif";
            statut.appendChild(document.createTextNode('Statut : '));
            statut.appendChild(statutStrong);
            wrapper.appendChild(statut);
            wrapper.appendChild(document.createElement('br'));

            const btnSuspend = document.createElement('button');
            btnSuspend.className = 'btn-suspend';
            btnSuspend.dataset.id = emp.id;
            btnSuspend.textContent = emp.suspendu ? "Réactiver" : "Suspendre";
            wrapper.appendChild(btnSuspend);

            const btnDel = document.createElement('button');
            btnDel.className = 'btn-supprimer';
            btnDel.dataset.id = emp.id;
            btnDel.textContent = 'Supprimer';
            wrapper.appendChild(btnDel);

            return wrapper;
        },
        "Aucun employé enregistré."
    );
}

// CHARGER LES MENUS DEPUIS LA BDD
async function chargerMenusDepuisServeur() {
    try {
        const response = await fetch("../PHP/getMenus.php");
        const tousLesMenus = await response.json();

        // LISTE DES IDS À MASQUER (tes 3 menus de base)
        const idsPermanents = new Set([1, 2, 3]); 

        // On ne garde que les menus dont l'ID n'est pas dans la liste ci-dessus
        menusFromDB = tousLesMenus.filter(menu => !idsPermanents.has(Number(menu.id)));

        afficherMenus();
    } catch (error) {
        console.error("Erreur chargement menus BDD :", error);
        afficherMenus();
    }
}

// PLATS - backend
async function chargerPlatsDepuisServeur() {
    try {
        const res = await fetch("../PHP/getPlats.php");
        const result = await res.json();
        if (result.success) {
            plats = result.data;
        } else {
            plats = [];
            console.error('Erreur getPlats:', result.message);
        }
    } catch (err) {
        console.error('Erreur réseau getPlats:', err);
        plats = [];
    }
    afficherPlats();
}

// AFFICHAGE MENUS (Uniquement les menus créés en BDD)
function afficherMenus() {
    afficherListe(
        listeMenus,
        menusFromDB,
        (menu) => {
            const nomAffiche = menu.titre || menu.nom;
            const wrapper = document.createElement('div');
            const info = document.createElement('div');
            info.className = 'admin-item-info';
            const strong = document.createElement('strong');
            strong.textContent = nomAffiche;
            info.appendChild(strong);
            const desc = document.createElement('span');
            desc.textContent = menu.description;
            info.appendChild(desc);
            const prix = document.createElement('span');
            prix.textContent = `Prix : ${menu.prix} €`;
            info.appendChild(prix);

            const actions = document.createElement('div');
            actions.className = 'admin-actions';
            const btnMod = document.createElement('button');
            btnMod.className = 'btn-modifier-menu';
            btnMod.dataset.id = menu.id;
            btnMod.textContent = 'Modifier';
            const btnSup = document.createElement('button');
            btnSup.className = 'btn-danger btn-supprimer-menu';
            btnSup.dataset.id = menu.id;
            btnSup.textContent = 'Supprimer';
            actions.appendChild(btnMod);
            actions.appendChild(btnSup);

            wrapper.appendChild(info);
            wrapper.appendChild(actions);
            return wrapper;
        },
        "Aucun menu personnalisé n'a été créé."
    );
}

// AFFICHAGE PLATS
function afficherPlats() {
    afficherListe(
        listePlats,
        plats,
        (plat) => {
            const wrapper = document.createElement('div');
            const info = document.createElement('div');
            info.className = 'admin-item-info';
            const strong = document.createElement('strong');
            strong.textContent = plat.nom;
            const spanDesc = document.createElement('span');
            spanDesc.textContent = plat.description;
            info.appendChild(strong);
            info.appendChild(spanDesc);

            const actions = document.createElement('div');
            actions.className = 'admin-actions';
            const btnMod = document.createElement('button');
            btnMod.className = 'btn-action btn-modifier-plat';
            btnMod.dataset.id = plat.id;
            btnMod.textContent = 'Modifier';
            const btnSup = document.createElement('button');
            btnSup.className = 'btn-danger btn-supprimer-plat';
            btnSup.dataset.id = plat.id;
            btnSup.textContent = 'Supprimer';
            actions.appendChild(btnMod);
            actions.appendChild(btnSup);

            wrapper.appendChild(info);
            wrapper.appendChild(actions);
            return wrapper;
        },
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

    if (commandesFiltrees.length === 0) {
        listeCommandes.textContent = '';
        const p = document.createElement('p');
        p.textContent = 'Aucune commande trouvée.';
        listeCommandes.appendChild(p);
    } else {
        listeCommandes.textContent = '';
        commandesFiltrees.forEach(cmd => {
            const li = document.createElement("li");
            li.classList.add("admin-item");

            const info = document.createElement('div');
            info.className = 'admin-item-info';
            const strong = document.createElement('strong');
            strong.textContent = `Commande #${cmd.id}`;
            info.appendChild(strong);
            const spanClient = document.createElement('span');
            spanClient.textContent = `Client : ${cmd.client_nom}`;
            info.appendChild(spanClient);
            const spanMenu = document.createElement('span');
            spanMenu.textContent = `Menu : ${cmd.menuTitre}`;
            info.appendChild(spanMenu);
            const spanNb = document.createElement('span');
            spanNb.textContent = `Nombre de personnes : ${cmd.nbPersonnes}`;
            info.appendChild(spanNb);
            const spanPrix = document.createElement('span');
            spanPrix.textContent = `Prix total : ${cmd.prixTotal} €`;
            info.appendChild(spanPrix);
            const spanPrep = document.createElement('span');
            spanPrep.textContent = `Prestation : ${cmd.datePrestation.split('-').reverse().join('-')} à ${cmd.heurePrestation}`;
            info.appendChild(spanPrep);
            const spanAdr = document.createElement('span');
            spanAdr.textContent = `Adresse : ${cmd.adresse}, ${cmd.cp}, ${cmd.ville}`;
            info.appendChild(spanAdr);
            const spanTel = document.createElement('span');
            spanTel.textContent = `Téléphone : ${cmd.gsm}`;
            info.appendChild(spanTel);
            const spanStat = document.createElement('span');
            spanStat.className = 'statut-ligne';
            spanStat.textContent = 'Statut actuel : ';
            const statStrong = document.createElement('strong');
            statStrong.textContent = cmd.statut;
            spanStat.appendChild(statStrong);
            info.appendChild(spanStat);
            if (cmd.materiel) {
                const warn = document.createElement('span');
                warn.style.color = 'red';
                warn.textContent = '⚠️ Matériel en prêt';
                info.appendChild(warn);
            }

            const actions = document.createElement('div');
            actions.className = 'admin-actions';
            const select = document.createElement('select');
            select.className = 'select-statut';
            select.dataset.id = cmd.id;
            const opts = ["", "accepté", "en préparation", "en cours de livraison", "livré", "terminée"];
            opts.forEach(o => {
                const option = document.createElement('option');
                option.value = o;
                option.textContent = o === '' ? 'Changer statut' : o;
                select.appendChild(option);
            });
            if (cmd.materiel) {
                const option = document.createElement('option');
                option.value = 'en attente du retour de matériel';
                option.textContent = 'Retour matériel';
                select.appendChild(option);
            }
            actions.appendChild(select);

            const btnAnn = document.createElement('button');
            btnAnn.className = 'btn-danger btn-annuler';
            btnAnn.dataset.id = cmd.id;
            btnAnn.textContent = 'Annuler';
            actions.appendChild(btnAnn);

            li.appendChild(info);
            li.appendChild(actions);
            listeCommandes.appendChild(li);
        });
    }
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
    while (listeAvis.firstChild) listeAvis.firstChild.remove();
    if (avisRecus.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Aucun avis en attente.';
        listeAvis.appendChild(p);
        return;
    }

    avisRecus.forEach(a => {
        const li = document.createElement("li");
        const strong = document.createElement('strong');
        strong.textContent = a.nom_client;
        li.appendChild(strong);
        li.appendChild(document.createTextNode(` (Commande #${a.commande_id})`));
        li.appendChild(document.createElement('br'));
        const note = document.createElement('span');
        note.textContent = `Note : ${a.note}/5`;
        li.appendChild(note);
        li.appendChild(document.createElement('br'));
        const comm = document.createElement('span');
        comm.textContent = `"${a.commentaire}"`;
        li.appendChild(comm);
        li.appendChild(document.createElement('br'));
        const btnVal = document.createElement('button');
        btnVal.className = 'btn-valider-avis';
        btnVal.dataset.id = a.id;
        btnVal.textContent = 'Valider';
        const btnRef = document.createElement('button');
        btnRef.className = 'btn-refuser-avis btn-danger';
        btnRef.dataset.id = a.id;
        btnRef.textContent = 'Supprimer';
        li.appendChild(btnVal);
        li.appendChild(btnRef);
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

    // Tri des horaires selon l'ordre des jours écrit en Majuscule ou minuscule
    const horairesTries = [...horaires].sort((a, b) => {
        const ja = a.jour.toLowerCase();
        const jb = b.jour.toLowerCase();
        return ordreJours.indexOf(ja) - ordreJours.indexOf(jb);
    });

    afficherListe(
        listeHoraires,
        horairesTries,
        (h) => {
            const wrapper = document.createElement('div');
            const jourElem = document.createElement('strong');
            jourElem.textContent = h.jour;
            wrapper.appendChild(jourElem);
            wrapper.appendChild(document.createTextNode(` : ${h.ouverture} - ${h.fermeture}`));

            const btnMod = document.createElement('button');
            btnMod.className = 'btn-modifier-horaire';
            btnMod.dataset.id = h.id;
            btnMod.textContent = 'Modifier';
            const btnSup = document.createElement('button');
            btnSup.className = 'btn-supprimer-horaire';
            btnSup.dataset.id = h.id;
            btnSup.textContent = 'Supprimer';

            wrapper.appendChild(document.createElement('br'));
            wrapper.appendChild(btnMod);
            wrapper.appendChild(btnSup);
            return wrapper;
        },
        "Aucun horaire enregistré."
    );
}

// ÉCOUTEURS D'ÉVÉNEMENTS (les boutons)
document.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    // 1 - EMPLOYÉS
    if (e.target.classList.contains("btn-suspend")) {
        fetch("../PHP/suspendEmploye.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
            body: JSON.stringify({ id })
        })
            .then(r => r.json())
            .then(() => chargerEmployesDepuisServeur());
    }

    if (e.target.classList.contains("btn-supprimer")) {
        if (confirm("Supprimer cet employé ?")) {
            fetch("../PHP/supprimerEmploye.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
                body: JSON.stringify({ id })
            })
                .then(r => r.json())
                .then(() => chargerEmployesDepuisServeur());
        }
    }

// 2 - GESTION DES MENUS
    if (e.target.classList.contains("btn-supprimer-menu")) {
        if (confirm("Supprimer ce menu définitivement ?")) {
            // On envoie la demande au serveur
            fetch("../PHP/supprimerMenu.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
                body: JSON.stringify({ id: id })
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    chargerMenusDepuisServeur(); // Rafraîchit la liste depuis la BDD
                } else {
                    alert("Erreur : " + result.message);
                }
            });
        }
    }

    if (e.target.classList.contains("btn-modifier-menu")) {
        // On trouve le menu dans la liste actuelle pour pré-remplir les prompts
        const menu = menusFromDB.find(m => String(m.id) === String(id));
        if (!menu) return;

        const nouveauTitre = prompt("Titre du menu :", menu.titre || menu.nom);
        const nouvelleDesc = prompt("Description :", menu.description);
        const nouveauPrix = prompt("Prix :", menu.prix);

        if (nouveauTitre && nouvelleDesc && nouveauPrix) {
            fetch("../PHP/modifierMenu.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
                body: JSON.stringify({ 
                    id: id, 
                    titre: nouveauTitre, 
                    description: nouvelleDesc, 
                    prix: Number.parseFloat(nouveauPrix) 
                })
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert("Menu mis à jour !");
                    chargerMenusDepuisServeur();
                } else {
                    alert("Erreur : " + result.message);
                }
            });
        }
    }

    // 3 - PLATS (via backend)
    if (e.target.classList.contains("btn-supprimer-plat")) {
        if (!confirm("Supprimer ce plat ?")) return;
        fetch("../PHP/supprimerPlat.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id })
        })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    chargerPlatsDepuisServeur();
                } else {
                    alert("Erreur : " + result.message);
                }
            })
            .catch(err => console.error('Erreur supprimerPlat:', err));
    }

    if (e.target.classList.contains("btn-modifier-plat")) {
        const plat = plats.find(p => String(p.id) === String(id));
        if (!plat) return;
        const nom = prompt("Nom du plat :", plat.nom);
        const description = prompt("Description :", plat.description);
        if (!nom || !description) {
            alert("Tous les champs sont obligatoires.");
            return;
        }

        fetch("../PHP/modifierPlat.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id, nom: nom.trim(), description: description.trim() })
        })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    chargerPlatsDepuisServeur();
                } else {
                    alert("Erreur : " + result.message);
                }
            })
            .catch(err => console.error('Erreur modifierPlat:', err));
    }

    // 4 - COMMANDES
    if (e.target.classList.contains("btn-annuler")) {
        const commande = commandes.find(cmd => String(cmd.id) === String(id));
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
            credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
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
            credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
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
                credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
                body: JSON.stringify({ id })
            })
                .then(r => r.json())
                .then(() => chargerHorairesDepuisServeur());
        }
    }

    if (e.target.classList.contains("btn-modifier-horaire")) {

        const id = e.target.dataset.id;

        const h = horaires.find(h => String(h.id) === String(id));
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
            credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
            body: JSON.stringify({ id, jour, ouverture, fermeture })
        })
            .then(r => r.json())
            .then(() => chargerHorairesDepuisServeur());
    }
});


// CRÉATION EMPLOYÉ
async function chargerEmployesDepuisServeur() {
    const response = await fetch("../PHP/getEmployes.php");
    users = await response.json();
    afficherEmployes();
}

document.getElementById("btn-ajout-employe").addEventListener("click", async () => {
    const fullname = prompt("Nom et Prénom de l'employé :");
    const email = prompt("Email de l'employé :");
    const password = prompt("Mot de passe temporaire :");

    if (!fullname || !email || !password) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    const response = await fetch("../PHP/ajoutEmploye.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
        body: JSON.stringify({ fullname, email, password })
    });

    const result = await response.json();
    if (result.success) {
        alert("Employé créé avec succès !");
        chargerEmployesDepuisServeur();
    } else {
        alert("Erreur : " + result.message);
    }
});

// CRÉATION MENU (Uniquement BDD)
document.getElementById("btn-ajout-menu").addEventListener("click", async () => {
    const nom = prompt("Nom du menu :");
    const description = prompt("Description :");
    const prixStr = prompt("Prix :");
    const prix = Number.parseFloat(prixStr);

    if (!nom || !description || Number.isNaN(prix) || prix <= 0) {
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
document.getElementById("btn-ajout-plat").addEventListener("click", async () => {
    const types = ["entrée", "plat principal", "dessert"];
    const toCreate = [];
    for (const type of types) {
        const nom = prompt(`Nom du ${type} (laisser vide si aucun) :`);
        if (nom) {
            const description = prompt(`Description du ${type} :`) || "";
            toCreate.push({ nom: nom.trim(), description: description.trim() });
        }
    }

    if (toCreate.length === 0) return;

    try {
        for (const p of toCreate) {
            await fetch("../PHP/ajoutPlat.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(p)
            }).then(r => r.json()).then(res => {
                if (!res.success) throw new Error(res.message || 'Erreur ajoutPlat');
            });
        }
        await chargerPlatsDepuisServeur();
        alert("Plat(s) ajouté(s) avec succès !");
    } catch (err) {
        console.error('Erreur ajoutPlat:', err);
        alert('Impossible d\'ajouter le(s) plat(s) : ' + err.message);
    }
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
            credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
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
        credentials: "include", // Assure que les cookies de session sont envoyés pour l'authentification
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
chargerEmployesDepuisServeur();
chargerMenusDepuisServeur();
chargerPlatsDepuisServeur();
chargerHorairesDepuisServeur();
chargerCommandesDepuisServeur();
chargerAvisDepuisServeur();
