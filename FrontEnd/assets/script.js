const filtersHTML = `
    <div class="filters">
        <button class="btn-filter">Tous</button>
        <button class="btn-filter">Objets</button>
        <button class="btn-filter">Appartements</button>
        <button class="btn-filter">Hotels &amp; restaurants</button>
    </div>
`;

// Sélectionnez la balise <section> avec l'ID "portfolio"
const portfolioSection = document.getElementById('portfolio');

// Insérez les boutons de filtre juste avant le titre "Mes Projets"
portfolioSection.insertAdjacentHTML('beforebegin', filtersHTML);

// Déclarer la variable works au niveau global
let works = [];

// Appel de la fonction fetchData
fetchData();

// Récupération des works depuis API
async function fetchData() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error('La requête fetch a échoué');
        }
        const works = await response.json();

        console.log("retour de la variable response", response);
        console.log("resultat de WORKS=", works);

        const sectionGallery = document.querySelector(".gallery");

        if (works.length > 0) {
            // Effacer le contenu précédent de la galerie
            sectionGallery.innerHTML = '';

            // Utiliser innerHTML pour injecter le HTML pour chaque projet
            works.forEach(project => {
                sectionGallery.innerHTML += `
                    <figure>
                        <img src="${project.imageUrl ?? "(Pas d'image)"}" alt="${project.title ?? "(pas de title)"}">
                        <figcaption>${project.title ?? "(pas de title)"}</figcaption>
                    </figure>
                `;
            });
        } else {
            console.error('Aucun projet trouvé dans la réponse');
        }

    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des données :', error);
        // Gérez l'erreur selon la logique d'application
    }
}


/**************************ZONE FILTRE******************************************/
// Ajouter des écouteurs d'événements à chaque bouton de filtre
document.querySelectorAll('.btn-filter').forEach(button => {
    button.addEventListener('click', () => {
        filterWorks(button.textContent.trim()); // Utilisez le texte du bouton comme critère de filtrage
    });
});

// Définir une fonction de filtrage
function filterWorks(filter) {
    const sectionGallery = document.querySelector('.gallery');
    const filteredWorks = works.filter(project => {
        // Vérifiez si le projet correspond au filtre
        if (filter === 'Tous') {
            return true; // Afficher tous les projets
        } else {
            // Vérifiez si le projet appartient à la catégorie correspondant au filtre
            return project.category === filter;
        }
    });

    // Afficher les projets filtrés
    if (filteredWorks.length > 0) {
        // Effacer le contenu précédent de la galerie
        sectionGallery.innerHTML = '';

        // Utiliser innerHTML pour injecter le HTML pour chaque projet filtré
        filteredWorks.forEach(project => {
            sectionGallery.innerHTML += `
                <figure>
                    <img src="${project.imageUrl ?? '(Pas d\'image)'}" alt="${project.title ?? '(pas de title)'}">
                    <figcaption>${project.title ?? '(pas de title)'}</figcaption>
                </figure>
            `;
        });
    } else {
        console.error('Aucun projet trouvé pour ce filtre');
        // Vous pouvez afficher un message d'erreur ou un message indiquant qu'aucun projet n'est trouvé pour ce filtre
    }
}



