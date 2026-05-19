// Logique de tracé avec JSXGraph

const GraphManager = (function() {
    let board = null;
    let currentCurve = null;

    function init() {
        board = JXG.JSXGraph.initBoard('jxgbox', {
            boundingbox: [-10, 10, 10, -10],
            axis: true,
            showCopyright: false,
            pan: { enabled: true },
            zoom: { enabled: true, wheel: true }
        });
    }

    function drawConic(equationStr) {
        if (!board) return;
        
        // Supprimer l'ancienne courbe
        if (currentCurve) {
            board.removeObject(currentCurve);
        }

        try {
            // JSXGraph permet de tracer des courbes implicites
            // Transforme l'équation du type "f(x,y) = g(x,y)" en "f(x,y) - (g(x,y))"
            let eqParts = equationStr.split('=');
            let implicitEq = eqParts[0];
            if (eqParts.length > 1) {
                implicitEq = eqParts[0] + ' - (' + eqParts[1] + ')';
            }

            // Pour JSXGraph, nous devons créer une fonction f(x, y)
            // On compile l'expression mathématique avec math.js
            const node = math.parse(implicitEq);
            const compiled = node.compile();

            currentCurve = board.create('curve', [
                function(t) { return t; }, // Ce n'est pas une courbe paramétrique, on utilise une autre approche
                function(t) { return t; }
            ], {visible: false}); // Ceci est un hack pour nettoyer, utilisons implicit curve à la place.
            
            // JSXGraph implicit curve:
            board.removeObject(currentCurve);
            
            let f = function(x, y) {
                return compiled.evaluate({x: x, y: y});
            };

            currentCurve = board.create('implicitcurve', [f], {
                strokeColor: '#4a90e2',
                strokeWidth: 3
            });

        } catch (e) {
            console.error("Erreur lors du tracé :", e);
        }
    }

    return {
        init,
        drawConic
    };
})();
