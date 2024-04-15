// Déclaration des variables globales.
let works = [];
let categories = [];
let token;
let projectId;
// Déclaration d'une variable globale pour stocker l'image sélectionnée
let selectedImage;

// Appel de la fonction d'initialisation de l'application.
initializeApp();

//Premiere Partie du Programme "Afichage des projets"//Premiere Partie du Programme "Afichage des projets"
//Premiere Partie du Programme "Afichage des projets"//Premiere Partie du Programme "Afichage des projets"
//Premiere Partie du Programme "Afichage des projets"//Premiere Partie du Programme "Afichage des projets"

// Fonction principale pour initialiser l'application.
async function initializeApp() {
  try {
    // Récupération du token depuis le localStorage
    token = localStorage.getItem("token");
    // Récupération des catégories depuis l'API.
    await fetchCategories();
    // Récupération des projets depuis l'API.
    await fetchWorks();

    // Affichage des projets et des boutons de filtre HTML.
    renderProjects();
    renderFilters();
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'initialisation de l'application :",
      error
    );
    // Gestion de l'erreur selon la logique de l'application
  }
}
// Fonction pour récupérer les projets depuis l'API.
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("La requête fetch pour les projets a échoué");
    }
    works = await response.json();
    console.log("Résultat de WORKS :", works);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération des projets :",
      error
    );
    // Gestion de l'erreur selon la logique de l'application
  }
}
// Fonction pour récupérer les catégories depuis l'API.
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("La requête fetch pour les catégories a échoué");
    }
    categories = await response.json();
    console.log("Résultat de CATEGORIES :", categories);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération des catégories :",
      error
    );
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
  const portfolioSection = document.getElementById("portfolio");
  portfolioSection.insertAdjacentHTML("beforebegin", filtersHTML);

  // Ajout des écouteurs d'événements à chaque bouton de filtre
  //Ainsi, la ligne de code prend le texte contenu dans le bouton,
  //le nettoie en supprimant les espaces vides au début et à la fin, et le stocke dans la variable filter.
  //Cette variable est ensuite utilisée pour déterminer quel filtre appliquer aux projets lors du filtrage.
  document.querySelectorAll(".btn-filter").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.textContent.trim(); //: C'est une méthode qui supprime les espaces vides
      //(espaces, tabulations, sauts de ligne, etc.) en début et en fin de chaîne.
      if (filter) {
        renderProjects(filter);
        console.log("Filtre appliqué :", filter);
      } else {
        console.error("Texte du bouton de filtre non défini");
      }
    });
  });
  console.log(
    "Boutons de filtre sélectionnés :",
    document.querySelectorAll(".btn-filter")
  );
}
// Fonction pour afficher et filtrer, les projets dans le HTML .
function renderProjects(filter = "Tous") {
  const sectionGallery = document.querySelector(".gallery");
  // Effacement du contenu précédent de la galerie
  sectionGallery.innerHTML = "";

  // Filtrer les projets en fonction de la catégorie sélectionnée
  const filteredWorks = works.filter((project) => {
    if (filter === "Tous") {
      return true; // Afficher tous les projets
    } else {
      // Rechercher la catégorie correspondant à l'identifiant de catégorie dans le projet
      const category = categories.find(
        (category) => category.id === project.categoryId
      );
      // Vérifier si la catégorie correspond à celle sélectionnée
      return category.name === filter;
    }
  });

  // Utilisation de innerHTML pour injecter le HTML pour chaque projet filtré
  filteredWorks.forEach((project) => {
    sectionGallery.innerHTML += `
            <figure>
                <img src="${project.imageUrl ?? "(Pas d'image)"}" alt="${
      project.title ?? "(pas de alt)"
    }">
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
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
  // Sélectionnée la modal et son contenu
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = "";
  // Pour chaque projet, créer une vignette et l'ajouter à la modal
  works.forEach((project) => {
    const projectThumbnail = createProjectThumbnail(project);
    modalContent.appendChild(projectThumbnail);
  });
}

// Fonction pour créer une vignette de projet
function createProjectThumbnail(project) {
  const projectThumbnail = document.createElement("div");
  projectThumbnail.classList.add("project-thumbnail");
  // Créer l'image
  const image = document.createElement("img");
  image.src = project.imageUrl ?? "(Pas d'image)";
  image.alt = project.title ?? "(pas de alt)";
  // Créer le bouton de suppression en forme de poubelle
  const deleteButton = createDeleteButton(project.id);
  projectThumbnail.appendChild(image);
  projectThumbnail.appendChild(deleteButton);

  return projectThumbnail;
}

// Fonction pour créer le bouton de suppression
function createDeleteButton(projectId) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => deleteProject(projectId));
  return deleteButton;
}

// Fonction pour supprimer un projet
function deleteProject(projectId) {
  // Afficher une boîte de dialogue de confirmation
  const confirmation = window.confirm(
    "Êtes-vous sûr de vouloir supprimer ce projet ?"
  );
  // Vérifier si l'utilisateur a confirmé la suppression
  if (confirmation) {
    // Supprimer le projet de la modal
    const projectThumbnail = document.querySelector(
      `.project-thumbnail[data-project-id="${projectId}"]`
    );
    if (projectThumbnail) {
      projectThumbnail.remove();
    }
    // Requête fetch pour supprimer le projet
    fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Le projet a été supprimé avec succès.");
          // Rafraîchir la galerie
          renderProjects();
        } else {
          console.error(
            "La suppression du projet a échoué. Réponse incorrecte de l'API"
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du projet :", error);
      });
  }
}

// Fonction pour fermer le modal et mettre à jour la page Projects
function closeModal() {
  const modal = document.getElementById("myModal");
  const modalSecondary = document.getElementById("myModalSecondary");
  modal.style.display = "none";
  modalSecondary.style.display = "none";
  // Rafraîchir la galerie
  renderProjects();
}

// Gestion des événements (interface,entrer,sortie) de la modal
function setupModalEvents() {
  const modal = document.getElementById("myModal");
  const modalSecondary = document.getElementById("myModalSecondary");
  // Récupérer le bouton de fermeture des modales
  const closeBtn = modal.querySelector(".close");
  const closeBtnSecondary = modalSecondary.querySelector(".close");
  // Récupérer le bouton "Ajouter une photo" de la modal primaire
  const addPhotoButtonPrimary = document.getElementById("addPhotoButton");
  // Récupérer la flèche de retour pour afficher la modal primaire ensuite.
  const backArrow = document.querySelector(".back-arrow");
  // Écouter le clic sur le bouton de fermeture des modales
  closeBtn.addEventListener("click", closeModal);
  closeBtnSecondary.addEventListener("click", closeModal);
  // Écouter le clic en dehors du modal pour le fermer
  window.addEventListener("click", (event) => {
    if (event.target == modal || event.target == modalSecondary) {
      closeModal();
    }
  });
  // Ajouter un événement d'écoute au bouton "Ajouter une photo" de la modal primaire
  addPhotoButtonPrimary.addEventListener("click", () => {
    // Cacher la modal primaire
    modal.style.display = "none";
    // Afficher la modal secondaire
    modalSecondary.style.display = "block";
  });
  // Ajouter un événement au clic à la flèche de retour de la modale secondaire
  backArrow.addEventListener("click", () => {
    modal.style.display = "block";
    modalSecondary.style.display = "none";
  });
}

// Appel de la fonction pour configurer les événements du modal Appeler ici pour etre sur que le DOM soit chargé.
setupModalEvents();

//Troisième Partie du Programme "envoie des works a l'API"//Troisième Partie du Programme "envoie des works a l'API"
//Troisième Partie du Programme "envoie des works a l'API"//Troisième Partie du Programme "envoie des works a l'API"
//Troisième Partie du Programme "envoie des works a l'API"//Troisième Partie du Programme "envoie des works a l'API"

// Fonction pour récupérer les catégories depuis l'API et les afficher dans le menu déroulant.
function fetchAndDisplayCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error("La requête fetch pour les catégories a échoué");
      }
      return response.json();
    })
    .then((categories) => {
      const select = document.getElementById("category");
      // Parcourir les catégories et les ajouter au menu déroulant
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.text = category.name;
        option.value = category.id;
        select.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories :", error);
    });
}
const FileInsertion = document.getElementById("photo");
const imageInput = document.getElementById("photo").files[0]; // Récupérer le fichier d'image

// Fonction pour afficher l'image préchargée dans la vignette.
//et la recuperer pour la transmettre a la fonction envoie API a travere une variable Globale.
function displayPreloadedImage() {
  const FileInsertion = document.getElementById("photo");
  FileInsertion.addEventListener("change", function (event) {
    const formDiv = document.querySelector(".SectionPreviewImage");
    if (FileInsertion.files && FileInsertion.files[0]) {
      // verifie la presence et <&&> permet d'obtenir le premier fichier de la liste. retourne True ou false.
      const file = FileInsertion.files[0]; // Récupérez le premier fichier sélectionné
      const reader = new FileReader();
      reader.onload = function (e) {
        // Les données binaires du fichier sont accessibles dans e.target.result
        //À l'intérieur de cette fonction, vous pouvez accéder aux données lues à partir du fichier via e.target.result.
        //C'est là que vous pouvez effectuer des opérations sur les données lues,
        //comme l'affichage d'une image dans une balise img ou le traitement des données binaires.
        const ImageData = e.target.result;

        /*  // Stocker les données de l'image préchargée dans la variable globale
        selectedImage = ImageData; */

        // Afficher l'image dans la page
        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("preview-image");
        img.style.width = "169px";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "0 auto";
        formDiv.innerHTML = "";
        formDiv.appendChild(img);
      };
      // Lisez le fichier en tant que Data URL (base64)
      reader.readAsDataURL(file);
    }
  });
}

// Fonction pour envoyer les données du formulaire au serveur via une Fetch vers l'API.
function sendFormData() {
  const form = document.getElementById("ProjetForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const titleInput = document.getElementById("title").value;
    const categoryInput = document.getElementById("category").value;

    // Construire l'objet FormData
    const formData = new FormData();
    formData.append("title", titleInput);
    formData.append("category", parseInt(categoryInput)); // Convertir en entier pour respecter le format attendu par L'API.
    formData.append("image", imageInput);

    console.log("Données du formulaire titre =", titleInput);
    console.log("Données du formulaire categorie=", categoryInput);
    console.log("Données de la variable SelectedImage =", selectedImage);

    console.log("Données du formulaire pret a l'envoie fetch=", formData);

    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("token");

    // Construire les en-têtes de la requête avec le token
    const headers = {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "application/json",
    };
    // Envoyer les données au serveur
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: headers,
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du formulaire");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Réponse de l'API :", data);
        document.getElementById("success-message-modal").style.display =
          "block";
        document.getElementById("error-message-modal").style.display = "none";
        // Rafraîchir la galerie
        refreshGallery();
      })
      .catch((error) => {
        // Gérer les erreurs d'envoi du formulaire
        console.error("Erreur lors de l'envoi du formulaire :", error);
        document.getElementById("error-message-modal").style.display = "block";
        document.getElementById("success-message-modal").style.display = "none";
        // Effacer le message d'erreur modal après quelques secondes
        setTimeout(() => {
          const errorMessageModal = document.getElementById(
            "error-message-modal"
          );
          if (errorMessageModal) {
            errorMessageModal.style.display = "none";
          }
        }, 3000);
      });
  });
}

// Fonction pour rafraîchir la galerie après l'envoi du formulaire.
function refreshGallery() {
  renderProjects();
  console.log("Galerie rafraîchie avec succès !");
}

// Appeler les fonctions pour initialiser les comportements du formulaire. Appeler ici pour etre sur que le DOM soit chargé.
fetchAndDisplayCategories();
displayPreloadedImage();
sendFormData();
