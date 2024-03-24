document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Empêcher l'envoi du formulaire par défaut

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        console.log("email et mots de passe :", username, password)

        // Vérifier si l'entrée est un email (contient au moins un '@')
        if (!username.includes("@")) {
            document.getElementById("error-message").innerText = "Veuillez entrer une adresse email valide.";
            return; // Arrêter l'exécution de la fonction si ce n'est pas un email
        }

        // Envoyer les données du formulaire à l'API pour vérification
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: username,
                password: password
            })

        })
            .then(response => {
                console.log("Réponse de l'API:", response);
                return response.json();
            })
            .then(data => {
                console.log("Données de l'API:", data);
                if (data.token) {
                    var token = data.token;

                    // Sauvegarde du token dans le stockage local (localStorage)
                    localStorage.setItem("token", token);
                    document.getElementById("success-message").innerText = "Félicitations 👌 Vous êtes connecté avec succès";
                    window.location.href = "index.html";
                } else {
                    document.getElementById("error-message").innerText = "Erreur dans l’identifiant ou le mot de passe";
                    var errorMessageElement = document.getElementById("error-message");
                }
            })


            .catch(error => {
                console.error("Erreur lors de la requête:", error);
                document.getElementById("error-message").innerText = "Une erreur s'est produite. Veuillez réessayer.";
            });
    });
});
