document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher l'envoi du formulaire par défaut

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log("email et mots de passe :", username, password);

    // Vérifier si l'entrée est un email (contient au moins un '@')
    if (!username.includes("@")) {
      document.getElementById("error-message").innerText =
        "Veuillez entrer une adresse email valide.";
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
          document.getElementById("success-message").innerText =
            "Félicitations 👌 Vous êtes connecté avec succès";
          window.location.href = "index.html";
        } else {
          document.getElementById("error-message").innerText =
            "Erreur dans l’identifiant ou le mot de passe";
          var errorMessageElement = document.getElementById("error-message");
        }
      })

      .catch((error) => {
        console.error("Erreur lors de la requête:", error);
        document.getElementById("error-message").innerText =
          "Une erreur s'est produite. Veuillez réessayer.";
      });
  });
});

//LogIn LogOut
document.addEventListener("DOMContentLoaded", function () {
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
      console.log("L'utilisateur s'est déconnecté.");
      // Mettre à jour le texte du bouton
      loginButton.textContent = "Login";
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
    // Sélectionnez la barre de mode édition
    const editModeBar = document.getElementById("editModeBar");
    // afficher la barre
    editModeBar.style.display = "block";

    // Sélectionner l'élément parent où vous souhaitez insérer le contenu HTML
    const portfolioSection = document.getElementById("SectionModif");
    // Créer le contenu HTML de l'élément "modifier" et du titre
    const modifyHTML = `<a href="#" onclick="openModal()">✏️Modifier</a>`;

    // Insérer le contenu HTML juste avant la fin de l'élément parent
    portfolioSection.insertAdjacentHTML("afterbegin", modifyHTML);
  } else {
    // Si le token n'est pas présent, l'utilisateur n'est pas connecté
    console.log("L'utilisateur n'est pas connecté.");
    loginButton.textContent = "Login";
    // masquer la barre
    editModeBar.style.display = "none";
  }
});
