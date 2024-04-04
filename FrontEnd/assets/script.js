// Déclaration des variables globales.
let works = [];
let categories = [];
// Appel de la fonction d'initialisation de l'application.
initializeApp();
// Fonction principale pour initialiser l'application.
async function initializeApp() {
    try {
        // Récupération des catégories depuis l'API.
        await fetchCategories();
        // Récupération des projets depuis l'API.
        await fetchWorks();

        // Affichage des projets et des boutons de filtre HTML.
        renderProjects();
        renderFilters();

    } catch (error) {
        console.error('Une erreur est survenue lors de l\'initialisation de l\'application :', error);
        // Gestion de l'erreur selon la logique de l'application
    }
}
// Fonction pour récupérer les projets depuis l'API.
async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error('La requête fetch pour les projets a échoué');
        }
        works = await response.json();
        console.log("Résultat de WORKS :", works);
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des projets :', error);
        // Gestion de l'erreur selon la logique de l'application
    }
}
// Fonction pour récupérer les catégories depuis l'API.
async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error('La requête fetch pour les catégories a échoué');
        }
        categories = await response.json();
        console.log("Résultat de CATEGORIES :", categories);
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des catégories :', error);
        // Gestion de l'erreur selon la logique de l'application
    }
}
// Fonction pour afficher et ecouter, les boutons de filtre HTML.
function renderFilters() {
    const filtersHTML = `
        <div class="filters">
            <button class="btn-filter">Tous</button>
            <button class="btn-filter">Objets</button>
            <button class="btn-filter">Appartements</button>
            <button class="btn-filter">Hotels &amp; restaurants</button>
        </div>
    `;
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.insertAdjacentHTML('beforebegin', filtersHTML);

    // Ajout des écouteurs d'événements à chaque bouton de filtre
    //Ainsi, la ligne de code prend le texte contenu dans le bouton, 
    //le nettoie en supprimant les espaces vides au début et à la fin, et le stocke dans la variable filter. 
    //Cette variable est ensuite utilisée pour déterminer quel filtre appliquer aux projets lors du filtrage.
    document.querySelectorAll('.btn-filter').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.textContent.trim(); //: C'est une méthode qui supprime les espaces vides 
            //(espaces, tabulations, sauts de ligne, etc.) en début et en fin de chaîne.
            if (filter) {
                renderProjects(filter);
                console.log("Filtre appliqué :", filter);
            } else {
                console.error('Texte du bouton de filtre non défini');
            }
        });
    });
    console.log("Boutons de filtre sélectionnés :", document.querySelectorAll('.btn-filter'));

}
// Fonction pour afficher et filtrer, les projets dans le HTML .
function renderProjects(filter = 'Tous') {
    const sectionGallery = document.querySelector(".gallery");
    // Effacement du contenu précédent de la galerie
    sectionGallery.innerHTML = '';

    // Filtrer les projets en fonction de la catégorie sélectionnée
    const filteredWorks = works.filter(project => {
        if (filter === 'Tous') {
            return true; // Afficher tous les projets
        } else {
            // Rechercher la catégorie correspondant à l'identifiant de catégorie dans le projet
            const category = categories.find(category => category.id === project.categoryId);
            // Vérifier si la catégorie correspond à celle sélectionnée
            return category.name === filter;
        }
    });

    // Utilisation de innerHTML pour injecter le HTML pour chaque projet filtré
    filteredWorks.forEach(project => {
        sectionGallery.innerHTML += `
            <figure>
                <img src="${project.imageUrl ?? "(Pas d'image)"}" alt="${project.title ?? "(pas de alt)"}">
                <figcaption>${project.title ?? "(pas de title)"}</figcaption>
            </figure>
        `;
    });

    console.log("Projets affichés dans le HTML :", filteredWorks);
}

//Seconde Partie du Programme "La Modale"//Seconde Partie du Programme "La Modale"
//Seconde Partie du Programme "La Modale"//Seconde Partie du Programme "La Modale"
//Seconde Partie du Programme "La Modale"//Seconde Partie du Programme "La Modale"

// Fonction pour ouvrir le modal et afficher les projets sous forme de vignettes
function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";


    // Sélectionner la modal et son contenu
    var modalContent = document.querySelector(".modal-content");


    // Effacer le contenu précédent de la modal
    modalContent.innerHTML = '';

    // Pour chaque projet, créer une vignette et l'ajouter à la modal
    works.forEach(project => {
        const projectThumbnail = document.createElement('div');
        projectThumbnail.classList.add('project-thumbnail');

        // Créer l'image
        const image = document.createElement('img');
        image.src = project.imageUrl ?? "(Pas d'image)";
        image.alt = project.title ?? "(pas de alt)";

        // Créer le bouton de suppression en forme de poubelle
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener('click', () => {
            deleteProject(project.id);
        });

        // Ajouter l'image et le bouton à la vignette
        projectThumbnail.appendChild(image);
        projectThumbnail.appendChild(deleteButton);

        // Ajouter la vignette à la modal
        modalContent.appendChild(projectThumbnail);
    });


    console.log("Projets affichés dans la modal");
}

// Fonction pour supprimer un projet
function deleteProject(projectId) {
    var token = localStorage.getItem("token");
    console.log("Token récupéré depuis le localStorage :", token);
    console.log("verification du projet avec l'ID :", projectId);
    // La logique pour supprimer le projet avec l'ID spécifié

    // Afficher une boîte de dialogue de confirmation
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    // Vérifier si l'utilisateur a confirmé la suppression
    if (confirmation) {
        // Supprimer le projet de la modal
        const projectThumbnail = document.querySelector(`.project-thumbnail[data-project-id="${projectId}"]`);
        if (projectThumbnail) {
            projectThumbnail.remove();
        }


        // Requête fetch pour supprimer le projet
        fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    // Si la suppression réussit, vous pouvez mettre à jour l'interface utilisateur ou effectuer d'autres actions nécessaires.
                    console.log("Le projet a été supprimé avec succès.");
                    // supprimer l'image de la modale.

                } else {
                    console.error("La suppression du projet a échoué. Réponse incorect de L'API");
                }
            })
            .catch(error => {
                console.error("Erreur lors de la suppression du projet :", error);
            });
    }
}

// Déclaration des variables globales pour les modals
var modal = document.getElementById("myModal");
var modalSecondary = document.getElementById("myModalSecondary");

// Récupérer le bouton de fermeture du modal
var closeBtn = modal.querySelector(".close");
var closeBtnSecondary = modalSecondary.querySelector(".close");

// Écouter le clic sur le bouton de fermeture du modal
closeBtn.addEventListener("click", closeModal);
closeBtnSecondary.addEventListener("click", closeModal);

// Écouter le clic en dehors du modal pour le fermer
window.addEventListener("click", function (event) {
    if (event.target == modal || event.target == modalSecondary) {
        closeModal();
    }
});

// Fonction pour fermer le modal et mise a jour de la page Projects.
function closeModal() {
    modal.style.display = "none";
    modalSecondary.style.display = "none";
    renderProjects();
}

// Récupérer le bouton "Ajouter une photo" de la modal primaire
const addPhotoButtonPrimary = document.getElementById("addPhotoButton");

// Ajouter un événement d'écoute au bouton "Ajouter une photo" de la modal primaire
addPhotoButtonPrimary.addEventListener("click", function () {
    // Cacher la modal primaire
    modal.style.display = "none";

    // Afficher la modal secondaire
    modalSecondary.style.display = "block";
});



