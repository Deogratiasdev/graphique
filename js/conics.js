const ConicsAnalyzer = (function() {
    function analyze(equationStr) {
        const expr = normalize(equationStr);

        if (!expr) {
            return {
                type: 'Inconnu',
                properties: ['Saisis une equation.'],
                graph: null
            };
        }

        const direct = detectDirectForms(expr);
        if (direct) return direct;

        const general = detectGeneralForm(expr);
        if (general) return general;

        return {
            type: 'Inconnu',
            properties: ['Forme non reconnue. Essaie une forme standard.'],
            graph: null
        };
    }

    function normalize(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/,/g, '.')
            .replace(/\\left|\\right/g, '')
            .replace(/\*\*/g, '^');
    }

    function detectDirectForms(expr) {
        let m;

        if ((m = expr.match(/^x\^2\+y\^2=(\d+(?:\.\d+)?)$/))) {
            const radius = Math.sqrt(Number(m[1]));
            return circle(0, 0, radius, 'Cercle', [
                'Centre: (0, 0)',
                'Rayon: ' + format(radius)
            ]);
        }

        if ((m = expr.match(/^\(x([+-]\d+(?:\.\d+)?)\)\^2\+\(y([+-]\d+(?:\.\d+)?)\)\^2=(\d+(?:\.\d+)?)$/))) {
            const h = -Number(m[1]);
            const k = -Number(m[2]);
            const radius = Math.sqrt(Number(m[3]));
            return circle(h, k, radius, 'Cercle decale', [
                'Centre: (' + format(h) + ', ' + format(k) + ')',
                'Rayon: ' + format(radius)
            ]);
        }

        if ((m = expr.match(/^y=x\^2([+-]\d+)x([+-]\d+)$/))) {
            const b = Number(m[1]);
            const c = Number(m[2]);
            const h = -b / 2;
            const k = c - (b * b) / 4;
            return parabolaVertical(h, k, 1, 'Parabole', [
                'Sommet: (' + format(h) + ', ' + format(k) + ')',
                'Ouverture vers le haut'
            ]);
        }

        if ((m = expr.match(/^x=y\^2([+-]\d+)y([+-]\d+)$/))) {
            const b = Number(m[1]);
            const c = Number(m[2]);
            const h = c - (b * b) / 4;
            const k = -b / 2;
            return parabolaHorizontal(h, k, 1, 'Parabole horizontale', [
                'Sommet: (' + format(h) + ', ' + format(k) + ')',
                'Ouverture vers la droite'
            ]);
        }

        if ((m = expr.match(/^x\^2\/(\d+(?:\.\d+)?)\+y\^2\/(\d+(?:\.\d+)?)=1$/))) {
            const a = Math.sqrt(Number(m[1]));
            const b = Math.sqrt(Number(m[2]));
            return ellipse(0, 0, a, b, 'Ellipse', [
                'Centre: (0, 0)',
                'Demi-axes: ' + format(a) + ' et ' + format(b)
            ]);
        }

        if ((m = expr.match(/^\(\(x([+-]\d+(?:\.\d+)?)\)\^2\)\/(\d+(?:\.\d+)?)\+\(\(y([+-]\d+(?:\.\d+)?)\)\^2\)\/(\d+(?:\.\d+)?)=1$/))) {
            const h = -Number(m[1]);
            const a = Math.sqrt(Number(m[2]));
            const k = -Number(m[3]);
            const b = Math.sqrt(Number(m[4]));
            return ellipse(h, k, a, b, 'Ellipse decalee', [
                'Centre: (' + format(h) + ', ' + format(k) + ')',
                'Demi-axes: ' + format(a) + ' et ' + format(b)
            ]);
        }

        if ((m = expr.match(/^x\^2\/(\d+(?:\.\d+)?)\-y\^2\/(\d+(?:\.\d+)?)=1$/))) {
            const a = Math.sqrt(Number(m[1]));
            const b = Math.sqrt(Number(m[2]));
            return hyperbola(0, 0, a, b, false, 'Hyperbole', [
                'Centre: (0, 0)',
                'Asymptotes: y = +/-(' + format(b) + ' / ' + format(a) + ')x'
            ]);
        }

        if ((m = expr.match(/^y\^2\/(\d+(?:\.\d+)?)\-x\^2\/(\d+(?:\.\d+)?)=1$/))) {
            const a = Math.sqrt(Number(m[1]));
            const b = Math.sqrt(Number(m[2]));
            return hyperbola(0, 0, a, b, true, 'Hyperbole verticale', [
                'Centre: (0, 0)',
                'Asymptotes: x = +/-(' + format(b) + ' / ' + format(a) + ')y'
            ]);
        }

        return null;
    }

    function detectGeneralForm(expr) {
        const parts = expr.split('=');
        if (parts.length !== 2 || parts[1] !== '0') return null;

        const poly = parts[0];
        const terms = poly.replace(/-/g, '+-').split('+').filter(Boolean);
        let A = 0;
        let C = 0;
        let D = 0;
        let E = 0;
        let F = 0;

        for (const term of terms) {
            let m;

            if ((m = term.match(/^([+-]?\d*\.?\d*)?x\^2$/))) {
                A += coefficient(m[1]);
                continue;
            }

            if ((m = term.match(/^([+-]?\d*\.?\d*)?y\^2$/))) {
                C += coefficient(m[1]);
                continue;
            }

            if ((m = term.match(/^([+-]?\d*\.?\d*)?x$/))) {
                D += coefficient(m[1]);
                continue;
            }

            if ((m = term.match(/^([+-]?\d*\.?\d*)?y$/))) {
                E += coefficient(m[1]);
                continue;
            }

            if (term.match(/^[+-]?\d*\.?\d+$/)) {
                F += Number(term);
                continue;
            }

            return null;
        }

        if (A !== 0 && C !== 0) {
            const h = -D / (2 * A);
            const k = -E / (2 * C);
            const s = A * h * h + C * k * k - F;

            if (s <= 0) return null;

            if (A > 0 && C > 0) {
                const a2 = s / A;
                const b2 = s / C;
                const same = Math.abs(a2 - b2) < 1e-9;
                return circleOrEllipse(h, k, Math.sqrt(a2), Math.sqrt(b2), same);
            }

            if (A > 0 && C < 0) {
                return hyperbola(h, k, Math.sqrt(s / A), Math.sqrt(s / Math.abs(C)), false, 'Hyperbole', [
                    'Centre: (' + format(h) + ', ' + format(k) + ')',
                    'Asymptotes: y = +/-(' + format(Math.sqrt(s / Math.abs(C))) + ' / ' + format(Math.sqrt(s / A)) + ')(x - ' + format(h) + ')'
                ]);
            }

            if (A < 0 && C > 0) {
                return hyperbola(h, k, Math.sqrt(s / Math.abs(A)), Math.sqrt(s / C), true, 'Hyperbole verticale', [
                    'Centre: (' + format(h) + ', ' + format(k) + ')',
                    'Asymptotes: x = +/-(' + format(Math.sqrt(s / Math.abs(A))) + ' / ' + format(Math.sqrt(s / C)) + ')(y - ' + format(k) + ')'
                ]);
            }
        }

        if (A !== 0 && C === 0 && E !== 0) {
            return solveVerticalParabola(A, D, E, F);
        }

        if (C !== 0 && A === 0 && D !== 0) {
            return solveHorizontalParabola(C, E, D, F);
        }

        return null;
    }

    function solveVerticalParabola(A, D, E, F) {
        const a = -A / E;
        const b = -D / E;
        const c = -F / E;
        const h = -b / (2 * a);
        const k = c - (b * b) / (4 * a);
        return parabolaVertical(h, k, a, 'Parabole', [
            'Sommet: (' + format(h) + ', ' + format(k) + ')'
        ]);
    }

    function solveHorizontalParabola(C, E, D, F) {
        const a = -C / D;
        const b = -E / D;
        const c = -F / D;
        const k = -b / (2 * a);
        const h = c - (b * b) / (4 * a);
        return parabolaHorizontal(h, k, a, 'Parabole horizontale', [
            'Sommet: (' + format(h) + ', ' + format(k) + ')'
        ]);
    }

    function circleOrEllipse(h, k, a, b, sameAxes) {
        if (sameAxes) {
            return circle(h, k, a, 'Cercle', [
                'Centre: (' + format(h) + ', ' + format(k) + ')',
                'Rayon: ' + format(a)
            ]);
        }

        return ellipse(h, k, a, b, 'Ellipse', [
            'Centre: (' + format(h) + ', ' + format(k) + ')',
            'Demi-axes: ' + format(a) + ' et ' + format(b)
        ]);
    }

    function coefficient(value) {
        if (value == null || value === '' || value === '+') return 1;
        if (value === '-') return -1;
        return Number(value);
    }

    function format(value) {
        return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000);
    }

    function circle(h, k, r, type, properties) {
        return {
            type,
            properties,
            graph: { kind: 'circle', h, k, r }
        };
    }

    function ellipse(h, k, a, b, type, properties) {
        return {
            type,
            properties,
            graph: { kind: 'ellipse', h, k, a, b }
        };
    }

    function hyperbola(h, k, a, b, vertical, type, properties) {
        return {
            type,
            properties,
            graph: { kind: 'hyperbola', h, k, a, b, vertical }
        };
    }

    function parabolaVertical(h, k, a, type, properties) {
        return {
            type,
            properties,
            graph: { kind: 'parabolaVertical', h, k, a }
        };
    }

    function parabolaHorizontal(h, k, a, type, properties) {
        return {
            type,
            properties,
            graph: { kind: 'parabolaHorizontal', h, k, a }
        };
    }

    return {
        analyze
    };
})();
