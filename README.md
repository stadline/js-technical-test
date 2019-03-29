Test technique - Développeur frontend (JS)
==========================================

## Présentation générale

### Tâche

Le sujet de base est simple : il faut afficher le fil de discussion d'un ticket Github et déterminer qui est le plus bavard.

### Règles

* Pas plus de 4h, tant pis si vous n'avez pas le temps de tout finir !
* Framework libre, on n'impose pas React (même si c'est notre préférence)
* Finir les fonctionnalités principales avant de s'attaquer aux secondaires
* Design responsive, avec le Desktop et le Smartphone en cibles principales

Il est aussi conseillé de faire un maximum de commits pour bien détailler les étapes de votre raisonnement au cours du développement. N'hésitez pas à nous faire des retours et noter les difficultés que vous avez rencontrées durant le développement.

### Déroulement

* La charte graphique est fournie partiellement (uniquement desktop pour l'instant). Vous pouvez utiliser un framework CSS
* Vous pouvez faire un fork de ce dépôt, puis attaquer le sujet

## Fonctionnalités principales

### Le fil de discussion

On doit pouvoir afficher les messages d'un ticket Github (ex : https://github.com/nodejs/node/issues/6867). L'idée est de pouvoir afficher n'importe quel ticket, l'url devrait donc contenir le chemin vers le ticket (on peut également passer par un formulaire pour indiquer l'url avant d'afficher quoi que ce soit).

```
http://mon-app.dev/#nodejs/node/issues/6867
```

Le style est fourni dans un PSD (https://github.com/stadline/js-technical-test/raw/master/doc/Mailapp.psd) + version PDF (https://github.com/stadline/js-technical-test/raw/master/doc/Mailapp.pdf).
Dans un premier temps, uniquement afficher le titre, la discussion, les avatars. Vous pouvez faire une distinction entre l'auteur de la discussion et les autres intervenants.

### Les filtres

Dans la partie de gauche on affichera la liste des participants : on doit pouvoir masquer certains participants. Le design n'étant pas fourni, vous êtes libres du rendu (checkboxes ? effet graphique ?). Masquer un participant fait disparaître ses messages du fil de discussion.

## Fonctionalités secondaires

### Le graphique

Afficher un graphique "pie chart" dans la partie gauche, avant la liste des participants. Cette partie s'appelle "Qui est le plus bavard ?".

<img src="https://github.com/stadline/js-technical-test/raw/master/doc/pie-sample.png" />

Le principe : classer les participants en fonction du nombre de mots écrits. Vous devrez donc compter le nombre de mots de chaque message et les regrouper par utilisateur.

Filtrer un participant le fait disparaître du graphique.

### Champs "nouveau message"

Ajouter un textarea sous la discussion pour permettre d'ajouter un commentaire. Il faudra faire un appel authentifié à l'API Github. Vous pouvez stocker les infos de connexion dans une configuration (pas besoin de formulaire de login).

### Amélioration UI

Accompagner les changements d'affichage avec des animations (apparition / disparition des messages, mise à jour du graphique).
