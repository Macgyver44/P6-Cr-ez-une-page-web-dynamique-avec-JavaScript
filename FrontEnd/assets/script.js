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

// Appel de la fonction fetchData
fetchData();