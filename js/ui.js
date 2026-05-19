// Gestion de l'interface utilisateur

const UIManager = (function() {
    let mathInput;
    let typeDisplay;
    let propertiesDisplay;

    function init() {
        mathInput = document.getElementById('math-input');
        typeDisplay = document.querySelector('#conic-type span');
        propertiesDisplay = document.getElementById('conic-properties');

        // Écouteur d'événements pour le clavier mathématique (MathLive)
        mathInput.addEventListener('input', handleInput);
        
        // Affichage initial
        handleInput();
    }

    function handleInput() {
        const equationLaTeX = mathInput.value;
        const equationMath = MathParser.parseEquation(equationLaTeX);
        
        // Mettre à jour l'analyse
        const analysis = ConicsAnalyzer.analyze(equationMath);
        updateAnalysisDisplay(analysis);

        // Mettre à jour le graphe
        GraphManager.drawConic(equationMath);
    }

    function updateAnalysisDisplay(analysis) {
        typeDisplay.textContent = analysis.type;
        
        propertiesDisplay.innerHTML = '';
        if (analysis.properties.length > 0) {
            const ul = document.createElement('ul');
            analysis.properties.forEach(prop => {
                const li = document.createElement('li');
                li.textContent = prop;
                ul.appendChild(li);
            });
            propertiesDisplay.appendChild(ul);
        } else {
            propertiesDisplay.innerHTML = '<p>Aucune propriété détectée pour cette équation.</p>';
        }
    }

    return {
        init
    };
})();
