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
