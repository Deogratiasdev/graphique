// Analyse et simplification des équations

const MathParser = (function() {
    
    function findClosingBrace(str, startPos) {
        let depth = 1;
        for (let i = startPos + 1; i < str.length; i++) {
            if (str[i] === '{') depth++;
            if (str[i] === '}') depth--;
            if (depth === 0) return i;
        }
        return -1;
    }

    function replaceFrac(str) {
        let result = str;
        while (result.includes('\\frac')) {
            let fracIndex = result.indexOf('\\frac');
            let numStart = result.indexOf('{', fracIndex);
            if (numStart === -1) break;
            let numEnd = findClosingBrace(result, numStart);
            if (numEnd === -1) break;
            let denStart = result.indexOf('{', numEnd);
            if (denStart === -1) break;
            let denEnd = findClosingBrace(result, denStart);
            if (denEnd === -1) break;
            
            let num = result.substring(numStart + 1, numEnd);
            let den = result.substring(denStart + 1, denEnd);
            
            // Replace \frac{num}{den} with ((num)/(den))
            result = result.substring(0, fracIndex) + '((' + num + ')/(' + den + '))' + result.substring(denEnd + 1);
        }
        return result;
    }

    function parseEquation(latexStr) {
        let mathStr = latexStr;
        
        // Gérer les fractions avec notre fonction dédiée (supporte l'imbrication)
        mathStr = replaceFrac(mathStr);
        
        // Nettoyer le reste du LaTeX
        mathStr = mathStr
            .replace(/\\ln/g, 'log') // \ln -> log (natural log in math.js)
            .replace(/\\log/g, 'log10') // \log -> log10 (base 10 in math.js)
            .replace(/\\left/g, '')
            .replace(/\\right/g, '')
            .replace(/\\cdot/g, '*')
            .replace(/\\/g, '') // supprime les backslash restants (\sin -> sin, \pi -> pi)
            .replace(/\{/g, '(') // Les accolades restantes deviennent des parenthèses
            .replace(/\}/g, ')');
            
        return mathStr;
    }

    return {
        parseEquation
    };
})();
