const GraphManager = (function() {
    let board = null;
    let currentObjects = [];

    function init() {
        board = JXG.JSXGraph.initBoard('jxgbox', {
            boundingbox: [-10, 10, 10, -10],
            axis: true,
            showCopyright: false,
            showNavigation: false,
            pan: { enabled: true },
            zoom: { enabled: true, wheel: true },
            keepAspectRatio: true
        });
    }

    function drawConic(equationStr) {
        if (!board) return;
        clear();

        const analysis = ConicsAnalyzer.analyze(equationStr);
        if (!analysis.graph) return;

        const g = analysis.graph;
        if (g.kind === 'circle') {
            currentObjects.push(createParametric(
                t => g.h + g.r * Math.cos(t),
                t => g.k + g.r * Math.sin(t),
                0,
                Math.PI * 2
            ));
            return;
        }

        if (g.kind === 'ellipse') {
            currentObjects.push(createParametric(
                t => g.h + g.a * Math.cos(t),
                t => g.k + g.b * Math.sin(t),
                0,
                Math.PI * 2
            ));
            return;
        }

        if (g.kind === 'parabolaVertical') {
            currentObjects.push(createParametric(
                t => g.h + t,
                t => g.k + g.a * t * t,
                -10,
                10
            ));
            return;
        }

        if (g.kind === 'parabolaHorizontal') {
            currentObjects.push(createParametric(
                t => g.h + g.a * t * t,
                t => g.k + t,
                -10,
                10
            ));
            return;
        }

        if (g.kind === 'hyperbola' && g.vertical) {
            currentObjects.push(createParametric(
                t => g.h + g.b * Math.sinh(t),
                t => g.k + g.a * Math.cosh(t),
                -2,
                2
            ));
            currentObjects.push(createParametric(
                t => g.h + g.b * Math.sinh(t),
                t => g.k - g.a * Math.cosh(t),
                -2,
                2
            ));
            return;
        }

        if (g.kind === 'hyperbola') {
            currentObjects.push(createParametric(
                t => g.h + g.a * Math.cosh(t),
                t => g.k + g.b * Math.sinh(t),
                -2,
                2
            ));
            currentObjects.push(createParametric(
                t => g.h - g.a * Math.cosh(t),
                t => g.k + g.b * Math.sinh(t),
                -2,
                2
            ));
            return;
        }

        if (g.kind === 'function') {
            const curve = board.create('functiongraph', [
                function(x) {
                    try {
                        return g.compiled.evaluate({ x: x });
                    } catch (e) {
                        return NaN;
                    }
                }
            ], {
                strokeColor: '#8b5e34',
                strokeWidth: 3
            });
            currentObjects.push(curve);
        }
    }

    function createParametric(xFn, yFn, tMin, tMax) {
        return board.create('curve', [xFn, yFn, tMin, tMax], {
            strokeColor: '#8b5e34',
            strokeWidth: 3
        });
    }

    function clear() {
        currentObjects.forEach(obj => board.removeObject(obj));
        currentObjects = [];
    }

    function clearGraph() {
        clear();
        if (board) {
            board.fullUpdate();
        }
    }

    function resetView() {
        if (board) {
            board.setBoundingBox([-10, 10, 10, -10], false);
        }
    }

    function zoom(factor) {
        if (!board) return;
        const bb = board.getBoundingBox();
        const left = bb[0];
        const top = bb[1];
        const right = bb[2];
        const bottom = bb[3];
        const cx = (left + right) / 2;
        const cy = (top + bottom) / 2;
        const halfW = ((right - left) / 2) * factor;
        const halfH = ((top - bottom) / 2) * factor;
        board.setBoundingBox([cx - halfW, cy + halfH, cx + halfW, cy - halfH], false);
    }

    function pan(dx, dy) {
        if (!board) return;
        const bb = board.getBoundingBox();
        const width = bb[2] - bb[0];
        const height = bb[1] - bb[3];
        const shiftX = width * dx;
        const shiftY = height * dy;
        board.setBoundingBox([bb[0] + shiftX, bb[1] + shiftY, bb[2] + shiftX, bb[3] + shiftY], false);
    }

    function exportPdf() {
        if (!board) return;
        
        const element = document.getElementById('jxgbox');
        
        // Add a temporary background to ensure it's not transparent in the PDF
        const originalBg = element.style.background;
        element.style.background = '#ffffff';

        html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
            element.style.background = originalBg; // Restore background
            
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save("graphe-coniques.pdf");
        }).catch(err => {
            console.error("Erreur lors de l'export PDF:", err);
            alert("Erreur lors de la création du PDF.");
        });
    }

    function resize() {
        if (board) {
            board.resizeContainer();
        }
    }

    return {
        init,
        drawConic,
        clearGraph,
        resetView,
        zoom,
        pan,
        exportPdf,
        resize
    };
})();
