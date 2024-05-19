document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("login-form");

  if (loginForm) {
    // Si le formulaire de connexion existe (sur la page de connexion), ajouter un écouteur d'événements pour la soumission du formulaire
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Empêcher l'envoi du formulaire par défaut

      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      console.log("email et mots de passe :", username, password);

      // Vérifier si l'entrée est un email (contient au moins un '@')
      if (!username.includes("@")) {
        document.getElementById("error-message").innerText ="Veuillez entrer une adresse email valide.";
        return; // Arrêter l'exécution de la fonction si ce n'est pas un email
      }

      // Envoyer les données du formulaire à l'API pour vérification
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      })

        .then((response) => {
          console.log("Réponse de l'API:", response);
          return response.json();
        })

        .then((data) => {
          console.log("Données de l'API:", data);
          if (data.token) {
            var token = data.token;

            // Sauvegarde du token dans le stockage local (localStorage)
            localStorage.setItem("token", token);
           
            document.getElementById("success-message").innerText ="Félicitations 👌 Vous êtes connecté avec succès";
            window.location.href = "index.html";

          } else {
            document.getElementById("error-message").innerText ="Erreur dans l’identifiant ou le mot de passe";
            var errorMessageElement = document.getElementById("error-message");
          }
        })

        .catch((error) => {
          console.error("Erreur lors de la requête:", error);
          document.getElementById("error-message").innerText ="Une erreur s'est produite. Veuillez réessayer.";
        });
    });

  } else {
    // Si le formulaire de connexion n'existe pas (sur la page d'index), ajouter le code spécifique à la page d'index

    //LogIn LogOut

    var loginButton = document.getElementById("login-logout");
    console.log("Bonton recuperer dans le DOM:", loginButton);

    var title = document.querySelector("header h1");
    console.log("teste de selection de H1 title :", title);

    // Vérifier si le token est présent dans le stockage local
    var token = localStorage.getItem("token");
    console.log("verification presence du TOKEN :", token);
    console.log("Le code JavaScript s'exécute correctement.");

    loginButton.addEventListener("click", function () {
      // Mettre en œuvre la déconnexion si l'utilisateur est connecté
      if (token) {
        // Effacer le token du stockage local
        localStorage.removeItem("token");
        if (!token) {
          console.log("Le token a été supprimé avec succès.");
          loginButton.textContent = "Login";

          // Supprimer les éléments d'édition si présents
          const SectionBar = document.getElementById("editModeBar");
          const EditPen = document.getElementById("EditPen");
          if (SectionBar) {
            SectionBar.remove();
          }
          if (EditPen) {
            EditPen.remove();
          }

        } else {
          console.log("Le token n'a pas été supprimé. Mais on va rafraîchir la page quand même.");
          window.location.reload();
        }
        
        // Mettre à jour le texte du bouton
        loginButton.textContent = "Login";
        console.log("L'utilisateur s'est déconnecté.");
        

      } else {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        console.log("Redirection vers la page de connexion.");
        window.location.href = "Login.html";
      }
    });

    if (token) {
      // Si le token est présent, l'utilisateur est connecté
      console.log("Token trouvé :", token);
      console.log("L'utilisateur est connecté.");

      loginButton.textContent = "Logout";
      title.textContent = `Bienvenue`; // Remplacez "User" par le nom d'utilisateur si vous le souhaitez
      
      console.log("verifcation injection Users :", title);
      // Créer le contenu HTML de la barre de mode édition
      const editModeBarHTML = `<!-- Barre noire en haut de la page -->
    <div id="editModeBar" class="edit-mode-bar">📝 Mode Édition</div>`;
      // Insérer la barre de mode édition au début du corps du document
      document.body.insertAdjacentHTML("afterbegin", editModeBarHTML);
      // Sélectionner l'élément parent où vous souhaitez insérer le contenu HTML
      const portfolioSection = document.getElementById("SectionModif");
      // Créer le contenu HTML de l'élément "modifier" et du titre
      const modifyHTML = `<a href="#" onclick="openModal()"id="EditPen">✏️Modifier</a>`;
      // Insérer le contenu HTML juste avant la fin de l'élément parent
      portfolioSection.insertAdjacentHTML("afterbegin", modifyHTML);

      let FilterDelete = document.getElementById("FilterDelete");
      if (FilterDelete) {
        FilterDelete.remove();
      }
      console.log("verifcation de la variable FilterDelete :", FilterDelete);

      
    } else {
      // Si le token n'est pas présent, l'utilisateur n'est pas connecté
      console.log("L'utilisateur n'est pas connecté.");
      loginButton.textContent = "Login";
    }
  }
});
