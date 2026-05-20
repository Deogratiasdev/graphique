// Gestion de l'interface utilisateur

const UIManager = (function() {
    let mathInput;
    let typeDisplay;
    let propertiesDisplay;
    let keyboardDock;
    let keyboardCloseBtn;

    function init() {
        mathInput = document.getElementById('math-input');
        typeDisplay = document.querySelector('#conic-type span');
        propertiesDisplay = document.getElementById('conic-properties');
        keyboardDock = document.getElementById('keyboard-dock');
        keyboardCloseBtn = document.getElementById('keyboard-close-btn');

        const categorizedExamples = [
            {
                group: 'Cercles',
                items: [
                    { label: 'Cercle centré', eq: 'x^2 + y^2 = 25' },
                    { label: 'Cercle décalé', eq: '(x - 2)^2 + (y + 3)^2 = 16' },
                    { label: 'Forme générale', eq: 'x^2 + y^2 - 4x + 6y - 12 = 0' }
                ]
            },
            {
                group: 'Paraboles',
                items: [
                    { label: 'Parabole verticale', eq: 'y = x^2 - 4x + 3' },
                    { label: 'Parabole horizontale', eq: 'x = y^2 - 6y + 5' },
                    { label: 'Parabole inversée', eq: 'y = -2x^2 + 8x - 5' }
                ]
            },
            {
                group: 'Ellipses',
                items: [
                    { label: 'Ellipse centrée', eq: 'x^2/16 + y^2/9 = 1' },
                    { label: 'Ellipse décalée', eq: '((x - 1)^2)/25 + ((y + 2)^2)/9 = 1' },
                    { label: 'Forme générale', eq: '4x^2 + 9y^2 - 16x + 18y - 11 = 0' }
                ]
            },
            {
                group: 'Hyperboles',
                items: [
                    { label: 'Hyperbole horizontale', eq: 'x^2/9 - y^2/4 = 1' },
                    { label: 'Hyperbole verticale', eq: 'y^2/16 - x^2/25 = 1' },
                    { label: 'Hyperbole décalée', eq: '((x-2)^2)/16 - ((y-1)^2)/9 = 1' }
                ]
            },
            {
                group: 'Fonctions générales',
                items: [
                    { label: 'Fonction affine', eq: 'y = 4x + 8' },
                    { label: 'Fonction inverse', eq: 'y = 1/x' },
                    { label: 'Fonction trigonométrique', eq: 'y = sin(x)' },
                    { label: 'Fonction exponentielle', eq: 'y = e^x' },
                    { label: 'Fonction logarithme', eq: 'y = log(x)' }
                ]
            }
        ];
        
        // Flatten pour le clavier MathLive
        const flatExamples = categorizedExamples.flatMap(c => c.items);

        if (window.mathVirtualKeyboard) {
            mathVirtualKeyboard.layouts = 'default';
            mathVirtualKeyboard.alphabeticLayout = 'azerty';
            
            mathVirtualKeyboard.customToolbar = {
                label: 'Exemples',
                items: flatExamples.map(ex => ({
                    label: ex.eq,
                    insert: ex.eq
                }))
            };
        }

        const exampleDropdown = document.getElementById('example-dropdown');
        const exampleList = document.getElementById('example-list');
        const dropdownHeader = exampleDropdown ? exampleDropdown.querySelector('.dropdown-header') : null;

        if (exampleDropdown && exampleList && dropdownHeader) {
            // Build the custom list
            categorizedExamples.forEach(category => {
                const groupLabel = document.createElement('div');
                groupLabel.className = 'dropdown-group-label';
                groupLabel.textContent = category.group;
                exampleList.appendChild(groupLabel);
                
                category.items.forEach(item => {
                    const option = document.createElement('div');
                    option.className = 'dropdown-item';
                    option.innerHTML = `${item.label} <span class="eq">${item.eq}</span>`;
                    
                    option.addEventListener('click', (e) => {
                        e.stopPropagation(); // Empêcher la propagation pour ne pas rouvrir immédiatement
                        mathInput.value = item.eq;
                        handleInput();
                        exampleDropdown.classList.remove('open');
                        dropdownHeader.innerHTML = `${item.label} <span class="caret">▼</span>`;
                    });
                    
                    exampleList.appendChild(option);
                });
            });
            
            // Toggle dropdown
            dropdownHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                exampleDropdown.classList.toggle('open');
            });
            
            // Close when clicking outside or on backdrop
            document.addEventListener('click', (e) => {
                if (!exampleDropdown.contains(e.target) || e.target.classList.contains('dropdown-backdrop')) {
                    exampleDropdown.classList.remove('open');
                }
            });
        }

        // Écouteur d'événements pour le clavier mathématique (MathLive)
        mathInput.addEventListener('input', handleInput);
        mathInput.addEventListener('focusin', showAzertyKeyboard);
        if (keyboardCloseBtn) {
            keyboardCloseBtn.addEventListener('click', hideKeyboard);
        }
        bindGraphControls();
        
        // Récupérer l'équation sauvegardée
        const savedEquation = localStorage.getItem('savedEquation');
        if (savedEquation) {
            mathInput.value = savedEquation;
        }

        // Affichage initial
        handleInput();
    }

    function handleInput() {
        const equationLaTeX = mathInput.value;
        localStorage.setItem('savedEquation', equationLaTeX);
        
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
        if (keyboardDock) {
            keyboardDock.classList.add('visible');
        }
    }

    function hideKeyboard() {
        if (keyboardDock) {
            keyboardDock.classList.remove('visible');
        }
        if (!window.mathVirtualKeyboard) {
            if (mathInput) {
                mathInput.blur();
            }
            return;
        }
        mathVirtualKeyboard.visible = false;
        if (mathInput) {
            mathInput.blur();
        }
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
                if (action === 'pan-left') GraphManager.pan(-0.1, 0);
                if (action === 'pan-right') GraphManager.pan(0.1, 0);
                if (action === 'pan-up') GraphManager.pan(0, 0.1);
                if (action === 'pan-down') GraphManager.pan(0, -0.1);
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
