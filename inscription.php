<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = $_POST['nom'];
    $email = $_POST['email'];
    $telephone = $_POST['telephone'];
    $filiere = $_POST['filiere'];

    // Connexion à la base (ex : MySQL local)
    $conn = new mysqli("localhost", "root", "", "fasocode");

    if ($conn->connect_error) {
        die("Erreur : " . $conn->connect_error);
    }

    $sql = "INSERT INTO inscriptions (nom, email, telephone, filiere)
            VALUES ('$nom', '$email', '$telephone', '$filiere')";

    if ($conn->query($sql) === TRUE) {
        echo "Inscription enregistrée avec succès !";
    } else {
        echo "Erreur : " . $conn->error;
    }

    $conn->close();
}
?>
