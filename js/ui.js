// Gestion de l'interface utilisateur

const UIManager = (function() {
    let mathInput;
    let typeDisplay;
    let propertiesDisplay;

    function init() {
        mathInput = document.getElementById('math-input');
        typeDisplay = document.querySelector('#conic-type span');
        propertiesDisplay = document.getElementById('conic-properties');

        if (window.mathVirtualKeyboard) {
            mathVirtualKeyboard.layouts = 'default';
            mathVirtualKeyboard.alphabeticLayout = 'azerty';
        }

        // Écouteur d'événements pour le clavier mathématique (MathLive)
        mathInput.addEventListener('input', handleInput);
        mathInput.addEventListener('focusin', showAzertyKeyboard);
        mathInput.addEventListener('focusout', hideKeyboard);
        bindGraphControls();
        
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

    function showAzertyKeyboard() {
        if (!window.mathVirtualKeyboard) return;
        mathVirtualKeyboard.layouts = 'default';
        mathVirtualKeyboard.alphabeticLayout = 'azerty';
        mathVirtualKeyboard.visible = true;
    }

    function hideKeyboard() {
        if (!window.mathVirtualKeyboard) return;
        mathVirtualKeyboard.visible = false;
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

    function bindGraphControls() {
        const controls = document.querySelectorAll('[data-action]');
        controls.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                if (action === 'zoom-in') GraphManager.zoom(0.8);
                if (action === 'zoom-out') GraphManager.zoom(1.25);
                if (action === 'reset-view') GraphManager.resetView();
                if (action === 'clear-graph') GraphManager.clearGraph();
                if (action === 'export-pdf') GraphManager.exportPdf();
            });
        });
    }

    return {
        init
    };
})();
