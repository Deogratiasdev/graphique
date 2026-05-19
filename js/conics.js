// Analyse mathématique des coniques

const ConicsAnalyzer = (function() {
    // Cette fonction est une version TRES simplifiée de l'analyse de coniques.
    // Une vraie implémentation analyserait l'équation générale Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0
    function analyze(equationStr) {
        let type = "Inconnu";
        let properties = [];

        // Simple heuristique basée sur la chaîne de caractères (à remplacer par un vrai parser d'arbre mathématique)
        const eq = equationStr.toLowerCase();
        
        if (eq.includes('x^2') && eq.includes('y^2')) {
            if (eq.includes('+')) {
                // Vérification très basique pour cercle vs ellipse
                // Vrai test : comparer les coefficients de x^2 et y^2
                if (eq.match(/(\d*)x\^2\s*\+\s*\1y\^2/)) {
                    type = "Cercle";
                    properties.push("Les coefficients de x² et y² sont égaux.");
                    properties.push("Équation de la forme (x-h)² + (y-k)² = r²");
                } else {
                    type = "Ellipse";
                    properties.push("Les coefficients de x² et y² sont de même signe mais différents.");
                }
            } else if (eq.includes('-')) {
                type = "Hyperbole";
                properties.push("Les coefficients de x² et y² sont de signes opposés.");
            }
        } else if ((eq.includes('x^2') && !eq.includes('y^2')) || (!eq.includes('x^2') && eq.includes('y^2'))) {
            type = "Parabole";
            properties.push("Un seul des termes est au carré (soit x, soit y).");
        }

        return {
            type,
            properties
        };
    }

    return {
        analyze
    };
})();
