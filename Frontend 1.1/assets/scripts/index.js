
"use strict";
var animator = (() => {
    var V = Object.defineProperty;
    var re = Object.getOwnPropertyDescriptor;
    var ie = Object.getOwnPropertyNames;
    var ae = Object.prototype.hasOwnProperty;
    var se = (e, t) => {
            for (var o in t) V(e, o, {
                get: t[o],
                enumerable: !0
            })
        },
        pe = (e, t, o, n) => {
            if (t && typeof t == "object" || typeof t == "function")
                for (let a of ie(t)) !ae.call(e, a) && a !== o && V(e, a, {
                    get: () => t[a],
                    enumerable: !(n = re(t, a)) || n.enumerable
                });
            return e
        };
    var me = e => pe(V({}, "__esModule", {
        value: !0
    }), e);
    var Ie = {};
    se(Ie, {
        animateAppearEffects: () => oe,
        getActiveVariantHash: () => ne,
        spring: () => M,
        startOptimizedAppearAnimation: () => C
    });
    var fe = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale",
            "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"
        ],
        X = new Set(fe);
    var D = (e, t, o) => Math.min(Math.max(o, e), t);
    var Y = e => e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

    function R(e, t) {
        return t ? e * (1e3 / t) : 0
    }
    var I = "framerAppearId",
        $e = "data-" + Y(I);
    var j = function () {};
    var F = e => e;
    var K = .001,
        ce = .01,
        Z = 10,
        ue = .05,
        le = 1;

    function q({
        duration: e = 800,
        bounce: t = .25,
        velocity: o = 0,
        mass: n = 1
    }) {
        let a, i;
        j(e <= Z * 1e3, "Spring duration must be 10 seconds or less");
        let r = 1 - t;
        r = D(ue, le, r), e = D(ce, Z, e / 1e3), r < 1 ? (a = s => {
            let m = s * r,
                c = m * e,
                y = m - o,
                u = k(s, r),
                l = Math.exp(-c);
            return K - y / u * l
        }, i = s => {
            let c = s * r * e,
                y = c * o + o,
                u = Math.pow(r, 2) * Math.pow(s, 2) * e,
                l = Math.exp(-c),
                x = k(Math.pow(s, 2), r);
            return (-a(s) + K > 0 ? -1 : 1) * ((y - u) * l) / x
        }) : (a = s => {
            let m = Math.exp(-s * e),
                c = (s - o) * e + 1;
            return -K + m * c
        }, i = s => {
            let m = Math.exp(-s * e),
                c = (o - s) * (e * e);
            return m * c
        });
        let p = 5 / e,
            f = xe(a, i, p);
        if (e = e * 1e3, isNaN(f)) return {
            stiffness: 100,
            damping: 10,
            duration: e
        }; {
            let s = Math.pow(f, 2) * n;
            return {
                stiffness: s,
                damping: r * 2 * Math.sqrt(n * s),
                duration: e
            }
        }
    }
    var de = 12;

    function xe(e, t, o) {
        let n = o;
        for (let a = 1; a < de; a++) n = n - e(n) / t(n);
        return n
    }

    function k(e, t) {
        return e * Math.sqrt(1 - t * t)
    }
    var ge = ["duration", "bounce"],
        ye = ["stiffness", "damping", "mass"];

    function G(e, t) {
        return t.some(o => e[o] !== void 0)
    }

    function Ae(e) {
        let t = {
            velocity: 0,
            stiffness: 100,
            damping: 10,
            mass: 1,
            isResolvedFromDuration: !1,
            ...e
        };
        if (!G(e, ye) && G(e, ge)) {
            let o = q(e);
            t = {
                ...t,
                ...o,
                velocity: 0,
                mass: 1
            }, t.isResolvedFromDuration = !0
        }
        return t
    }
    var he = 5;

    function M({
        keyframes: e,
        restDelta: t,
        restSpeed: o,
        ...n
    }) {
        let a = e[0],
            i = e[e.length - 1],
            r = {
                done: !1,
                value: a
            },
            {
                stiffness: p,
                damping: f,
                mass: s,
                velocity: m,
                duration: c,
                isResolvedFromDuration: y
            } = Ae(n),
            u = Te,
            l = m ? -(m / 1e3) : 0,
            x = f / (2 * Math.sqrt(p * s));

        function T() {
            let d = i - a,
                g = Math.sqrt(p / s) / 1e3,
                b = Math.abs(d) < 5;
            if (o || (o = b ? .01 : 2), t || (t = b ? .005 : .5), x < 1) {
                let A = k(g, x);
                u = h => {
                    let O = Math.exp(-x * g * h);
                    return i - O * ((l + x * g * d) / A * Math.sin(A * h) + d * Math.cos(A * h))
                }
            } else if (x === 1) u = A => i - Math.exp(-g * A) * (d + (l + g * d) * A);
            else {
                let A = g * Math.sqrt(x * x - 1);
                u = h => {
                    let O = Math.exp(-x * g * h),
                        L = Math.min(A * h, 300);
                    return i - O * ((l + x * g * d) * Math.sinh(L) + A * d * Math.cosh(L)) / A
                }
            }
        }
        return T(), {
            next: d => {
                let g = u(d);
                if (y) r.done = d >= c;
                else {
                    let b = l;
                    if (d !== 0)
                        if (x < 1) {
                            let O = Math.max(0, d - he);
                            b = R(g - u(O), d - O)
                        } else b = 0;
                    let A = Math.abs(b) <= o,
                        h = Math.abs(i - g) <= t;
                    r.done = A && h
                }
                return r.value = r.done ? i : g, r
            },
            flipTarget: () => {
                l = -l, [a, i] = [i, a], T()
            }
        }
    }
    M.needsInterpolation = (e, t) => typeof e == "string" || typeof t == "string";
    var Te = e => 0;
    var w = ([e, t, o, n]) => `cubic-bezier(${e}, ${t}, ${o}, ${n})`,
        be = {
            linear: "linear",
            ease: "ease",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
            circIn: w([0, .65, .55, 1]),
            circOut: w([.55, 0, 1, .45]),
            backIn: w([.31, .01, .66, -.59]),
            backOut: w([.33, 1.53, .69, .99])
        };

    function U(e) {
        if (e) return Array.isArray(e) ? w(e) : be[e]
    }

    function E(e, t, o, {
        delay: n = 0,
        duration: a,
        repeat: i = 0,
        repeatType: r = "loop",
        ease: p,
        times: f
    } = {}) {
        return e.animate({
            [t]: o,
            offset: f
        }, {
            delay: n,
            duration: a,
            easing: U(p),
            fill: "both",
            iterations: i + 1,
            direction: r === "reverse" ? "alternate" : "normal"
        })
    }
    var S = (e, t) => `${e}: ${t}`;
    var v = new Map;

    function H(e, t, o, n) {
        let a = S(e, X.has(t) ? "transform" : t),
            i = v.get(a);
        if (!i) return 0;
        let {
            animation: r,
            startTime: p
        } = i, f = () => {
            v.delete(a);
            try {
                r.cancel()
            } catch {}
        };
        if (p !== null) {
            let s = performance.now();
            return n.update(() => {
                o.animation && (o.animation.currentTime = performance.now() - s)
            }), n.render(f), s - p || 0
        } else return f(), 0
    }

    function C(e, t, o, n, a) {
        let i = e.dataset[I];
        if (!i) return;
        window.HandoffAppearAnimations = H;
        let r = S(i, t),
            p = E(e, t, [o[0], o[0]], {
                duration: 1e4,
                ease: "linear"
            });
        v.set(r, {
            animation: p,
            startTime: null
        });
        let f = () => {
            p.cancel();
            let s = E(e, t, o, n);
            document.timeline && (s.startTime = document.timeline.currentTime), v.set(r, {
                animation: s,
                startTime: performance.now()
            }), a && a(s)
        };
        p.ready ? p.ready.then(f).catch(F) : f()
    }
    var z = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale",
            "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"
        ],
        Oe = {
            x: "translateX",
            y: "translateY",
            z: "translateZ",
            transformPerspective: "perspective"
        },
        Me = {
            translateX: "px",
            translateY: "px",
            translateZ: "px",
            x: "px",
            y: "px",
            z: "px",
            perspective: "px",
            transformPerspective: "px",
            rotate: "deg",
            rotateX: "deg",
            rotateY: "deg"
        };

    function W(e, t) {
        let o = Me[e];
        return !o || typeof t == "string" && t.endsWith(o) ? t : `${t}${o}`
    }

    function N(e) {
        return z.includes(e)
    }
    var ve = (e, t) => z.indexOf(e) - z.indexOf(t);

    function _({
        transform: e,
        transformKeys: t
    }, {
        enableHardwareAcceleration: o = !0,
        allowTransformNone: n = !0
    }, a, i) {
        let r = "";
        t.sort(ve);
        for (let p of t) r += `${Oe[p]||p}(${e[p]}) `;
        return o && !e.z && (r += "translateZ(0)"), r = r.trim(), i ? r = i(e, r) : n && a && (r =
            "none"), r
    }

    function B(e, t) {
        let o = new Set(Object.keys(e));
        for (let n in t) o.add(n);
        return Array.from(o)
    }

    function $(e, t) {
        let o = t - e.length;
        if (o <= 0) return e;
        let n = new Array(o).fill(e[e.length - 1]);
        return e.concat(n)
    }
    var J = {
            duration: .001
        },
        P = {
            opacity: 1,
            scale: 1,
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            x: 0,
            y: 0,
            z: 0,
            rotate: 0,
            rotateX: 0,
            rotateY: 0
        };

    function ee(e, t, o, n, a) {
        return o.delay && (o.delay *= 1e3), o.type === "spring" ? Pe(e, t, o, n, a) : Se(e, t, o, n, a)
    }

    function we(e, t, o) {
        let n = {},
            a = 0,
            i = 0;
        for (let r of B(e, t)) {
            let p = e[r] ?? P[r],
                f = t[r] ?? P[r];
            if (p === void 0 || f === void 0) continue;
            let s = Ve(p, f, o),
                {
                    duration: m,
                    keyframes: c
                } = s;
            m === void 0 || c === void 0 || (m > a && (a = m, i = c.length), n[r] = c)
        }
        return {
            keyframeValuesByProps: n,
            longestDuration: a,
            longestLength: i
        }
    }

    function Pe(e, t, o, n, a) {
        let i = {},
            {
                keyframeValuesByProps: r,
                longestDuration: p,
                longestLength: f
            } = we(e, t, o);
        if (!f) return i;
        let s = {
                ease: "linear",
                duration: p,
                delay: o.delay
            },
            m = a ? J : s,
            c = {};
        for (let [u, l] of Object.entries(r)) N(u) ? c[u] = $(l, f) : i[u] = {
            keyframes: $(l, f),
            options: u === "opacity" ? s : m
        };
        let y = te(c, n);
        return y && (i.transform = {
            keyframes: y,
            options: m
        }), i
    }

    function ke(e) {
        let {
            type: t,
            duration: o,
            ...n
        } = e;
        return {
            duration: o * 1e3,
            ...n
        }
    }

    function Se(e, t, o, n, a) {
        let i = ke(o);
        if (!i) return;
        let r = {},
            p = a ? J : i,
            f = {};
        for (let m of B(e, t)) {
            let c = e[m] ?? P[m],
                y = t[m] ?? P[m];
            c === void 0 || y === void 0 || (N(m) ? f[m] = [c, y] : r[m] = {
                keyframes: [c, y],
                options: m === "opacity" ? i : p
            })
        }
        let s = te(f, n);
        return s && (r.transform = {
            keyframes: s,
            options: p
        }), r
    }
    var Q = 10;

    function Ve(e, t, o) {
        let n = [e, t],
            a = M({
                ...o,
                keyframes: n
            }),
            i = {
                done: !1,
                value: n[0]
            },
            r = [],
            p = 0;
        for (; !i.done && p < 1e4;) i = a.next(p), r.push(i.value), p += Q;
        n = r;
        let f = p - Q;
        return {
            keyframes: n,
            duration: f,
            ease: "linear"
        }
    }

    function te(e, t) {
        let o = [],
            n = Object.values(e)[0] ?.length;
        if (!n) return;
        let a = Object.keys(e);
        for (let i = 0; i < n; i++) {
            let r = {},
                p = !0;
            for (let [s, m] of Object.entries(e)) {
                let c = m[i];
                p && (p = c === void 0 || c === P[s]), c !== void 0 && (r[s] = W(s, c))
            }
            let f = _({
                transform: r,
                transformKeys: a
            }, {}, p, t);
            o.push(f)
        }
        return o
    }

    function oe(e, t, o, n, a, i) {
        for (let [r, p] of Object.entries(e)) {
            let {
                initial: f,
                animate: s,
                transformTemplate: m,
                variantHash: c
            } = p;
            if (!f || !s || c && i && c !== i) continue;
            let {
                transition: y,
                ...u
            } = s, l = ee(f, u, y, De(m, n), a);
            if (!l) continue;
            let x = {},
                T = {};
            for (let [d, g] of Object.entries(l)) x[d] = g.keyframes, T[d] = g.options;
            t(`[${o}="${r}"]`, x, T)
        }
    }

    function De(e, t) {
        if (!(!e || !t)) return (o, n) => e.replace(t, n)
    }

    function ne(e) {
        return e ? e.find(o => o.mediaQuery ? window.matchMedia(o.mediaQuery).matches === !0 : !1) ?.hash : void 0
    }
    return me(Ie);
})();