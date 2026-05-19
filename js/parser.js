// Analyse et simplification des équations

const MathParser = (function() {
    
    function parseEquation(latexStr) {
        // Pour cet exemple, on nettoie un peu le LaTeX ou on le convertit en ASCII mathematique.
        // MathLive donne du LaTeX, Math.js ne comprend pas le LaTeX nativement, 
        // mais pour l'exemple on va supposer que l'utilisateur entre une chaine compatible Math.js
        // ou on fait un nettoyage basique.
        
        let mathStr = latexStr
            .replace(/\\/g, '') // supprime les backslash
            .replace(/\{/g, '(')
            .replace(/\}/g, ')')
            .replace(/cdot/g, '*')
            .replace(/frac\(([^)]+)\)\(([^)]+)\)/g, '($1)/($2)'); // approximation de frac
            
        return mathStr;
    }

    return {
        parseEquation
    };
})();
