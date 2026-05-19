# AGENT.md — Projet de tracé des fonctions coniques

## 1. Projet et fonctionnalités

### 🎯 Objectif du projet

Développer une application web (type Desmos simplifié) permettant de :

* Entrer des équations mathématiques de coniques
* Identifier automatiquement le type de courbe
* Afficher une représentation mathématique propre
* Tracer dynamiquement la courbe dans un plan cartésien
* Fournir les propriétés géométriques associées

---

### 📌 Fonctionnalités principales

#### 1. Saisie d’équations

* Entrée utilisateur sous forme mathématique (LaTeX ou texte math)
* Support des formes :

  * Cercle
  * Ellipse
  * Hyperbole
  * Parabole
* Clavier mathématique interactif (MathLive recommandé)

#### 2. Affichage des équations

* Rendu propre des formules (style manuel scolaire)
* Conversion automatique en LaTeX
* Mise à jour en temps réel

#### 3. Détection automatique

* Analyse de l’équation
* Identification du type de conique
* Extraction des paramètres (centre, rayon, foyers, etc.)

#### 4. Tracé graphique

* Affichage dans un repère orthonormé
* Zoom et déplacement
* Courbes dynamiques
* Points clés (centre, sommet, foyers, asymptotes)

#### 5. Analyse mathématique

* Forme canonique
* Propriétés géométriques
* Explications simples affichées à l’utilisateur

#### 6. Interactions

* Modification en temps réel
* Sliders pour paramètres (optionnel)
* Historique des équations

---

## 2. Architecture du projet (HTML / CSS / JS)

### 📁 Structure des fichiers

```txt
/graphic
│
├── index.html #Structure html
├── /css
│   └── style.css #Style css
│
├── /js
│   ├── app.js              # point d’entrée
│   ├── parser.js           # analyse des équations
│   ├── conics.js           # logique des coniques
│   ├── graph.js            # gestion du tracé (JSXGraph)
│   └── ui.js               # gestion interface utilisateur
│
├── /assets
│   └── icons, images
```

---

### ⚙️ Organisation logique

* `app.js` → initialise toute l’application
* `parser.js` → interprète les équations
* `conics.js` → logique mathématique (classification + propriétés)
* `graph.js` → rendu graphique (JSXGraph)
* `ui.js` → gestion affichage + interactions utilisateur

---

## 3. Outils et bibliothèques recommandés

### 🧮 Math et parsing

* **math.js** → calculs et parsing d’expressions

### 📐 Rendu graphique

* **JSXGraph** → moteur principal pour graphes et coniques (recommandé)

### ✍️ Saisie mathématique

* **MathLive** → clavier mathématique interactif

### 🧾 Affichage des équations

* **MathJax** → rendu LaTeX propre

### 🎨 UI / CSS

* CSS pur (responsive design manuel)
* Flexbox + Grid
* Media queries obligatoires

---

## 4. Exigences de responsivité

### 📱 Mobile (≤ 480px)

* Layout vertical
* Graphique prioritaire
* Équation en dessous
* Clavier math en bas
* Boutons larges et tactiles

---

### 📲 Tablette (481px – 1024px)

* Layout hybride
* Graphique dominant
* Panneau latéral (rétractable)
* Interface optimisée tactile + souris

---

### 💻 Desktop (> 1024px)

* Layout 2 ou 3 colonnes :

  * gauche : saisie + équation
  * centre : graphique
  * droite : propriétés

---

### 🔄 Mode orientation (IMPORTANT)

#### 📱 Rotation téléphone / tablette

* Détection automatique de l’orientation
* Passage automatique en mode paysage pour le graphe

#### 🧭 Comportement :

* Portrait → interface simplifiée verticale
* Paysage → graphique en plein écran

#### ⚙️ Implémentation CSS/JS :

* `@media (orientation: landscape)`
* `window.matchMedia("(orientation: landscape)")`
* Réajustement automatique du canvas JSXGraph

---

### ⚡ Contraintes UX

* Mise à jour graphique < 100ms
* Interaction fluide (objectif 60 FPS)
* Zoom naturel (molette + tactile)
* Drag du plan cartésien

---

## 5. Autres exigences importantes

### 🧠 Performance

* Recalcul uniquement si équation modifiée
* Optimisation du rendu graphique

### 🧩 Modularité

* Code séparé par responsabilités
* Facile d’ajouter d’autres types de courbes

### 🔄 Temps réel

* Toute modification doit mettre à jour :

  * affichage équation
  * analyse
  * graphique

---

## 6. Vision du produit

Créer une application web pédagogique et interactive permettant :

* d’écrire une équation
* de voir instantanément la courbe
* de comprendre ses propriétés
* de manipuler les paramètres en direct

---

## 7. Résultat attendu

Une application proche de Desmos mais spécialisée sur :

* coniques uniquement
* analyse automatique
* interface fluide et moderne
* expérience mobile + desktop optimisée

---

Fin du document.
