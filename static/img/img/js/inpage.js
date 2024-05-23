/*! For license information please see inpage.js.LICENSE.txt */
(()=>{
    var t = {
        84270: (t,e)=>{
            "use strict";
            function n(t) {
                if (!Number.isSafeInteger(t) || t < 0)
                    throw new Error("Wrong positive integer: ".concat(t))
            }
            function r(t) {
                if ("boolean" !== typeof t)
                    throw new Error("Expected boolean, not ".concat(t))
            }
            function i(t) {
                if (!(t instanceof Uint8Array))
                    throw new TypeError("Expected Uint8Array");
                for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
                    n[r - 1] = arguments[r];
                if (n.length > 0 && !n.includes(t.length))
                    throw new TypeError("Expected Uint8Array of length ".concat(n, ", not of length=").concat(t.length))
            }
            function s(t) {
                if ("function" !== typeof t || "function" !== typeof t.create)
                    throw new Error("Hash should be wrapped by utils.wrapConstructor");
                n(t.outputLen),
                n(t.blockLen)
            }
            function o(t) {
                let e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                if (t.destroyed)
                    throw new Error("Hash instance has been destroyed");
                if (e && t.finished)
                    throw new Error("Hash#digest() has already been called")
            }
            function a(t, e) {
                i(t);
                const n = e.outputLen;
                if (t.length < n)
                    throw new Error("digestInto() expects output buffer of length at least ".concat(n))
            }
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.output = e.exists = e.hash = e.bytes = e.bool = e.number = void 0,
            e.number = n,
            e.bool = r,
            e.bytes = i,
            e.hash = s,
            e.exists = o,
            e.output = a;
            const c = {
                number: n,
                bool: r,
                bytes: i,
                hash: s,
                exists: o,
                output: a
            };
            e.default = c
        }
        ,
        91673: (t,e,n)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.SHA2 = void 0;
            const r = n(84270)
              , i = n(59370)
              , s = n(11584);
            class o extends i.Hash {
                constructor(t, e, n, r) {
                    super(),
                    this.blockLen = t,
                    this.outputLen = e,
                    this.padOffset = n,
                    this.isLE = r,
                    this.finished = !1,
                    this.length = 0,
                    this.pos = 0,
                    this.destroyed = !1,
                    this.buffer = new Uint8Array(t),
                    this.view = (0,
                    i.createView)(this.buffer)
                }
                update(t) {
                    r.default.exists(this);
                    const {view: e, buffer: n, blockLen: s} = this
                      , o = (t = (0,
                    i.toBytes)(t)).length;
                    for (let r = 0; r < o; ) {
                        const a = Math.min(s - this.pos, o - r);
                        if (a !== s)
                            n.set(t.subarray(r, r + a), this.pos),
                            this.pos += a,
                            r += a,
                            this.pos === s && (this.process(e, 0),
                            this.pos = 0);
                        else {
                            const e = (0,
                            i.createView)(t);
                            for (; s <= o - r; r += s)
                                this.process(e, r)
                        }
                    }
                    return this.length += t.length,
                    this.roundClean(),
                    this
                }
                digestInto(t) {
                    r.default.exists(this),
                    r.default.output(t, this),
                    this.finished = !0;
                    const {buffer: e, view: n, blockLen: o, isLE: a} = this;
                    let {pos: c} = this;
                    e[c++] = 128,
                    this.buffer.subarray(c).fill(0),
                    this.padOffset > o - c && (this.process(n, 0),
                    c = 0);
                    for (let r = c; r < o; r++)
                        e[r] = 0;
                    !function(t, e, n, r) {
                        if ("function" === typeof t.setBigUint64)
                            return t.setBigUint64(e, n, r);
                        const {h: i, l: o} = s.fromBig(n, r)
                          , a = r ? 4 : 0
                          , c = r ? 0 : 4;
                        t.setUint32(e + a, i, r),
                        t.setUint32(e + c, o, r)
                    }(n, o - 8, BigInt(8 * this.length), a),
                    this.process(n, 0);
                    const u = (0,
                    i.createView)(t)
                      , l = this.outputLen;
                    if (l % 4)
                        throw new Error("_sha2: outputLen should be aligned to 32bit");
                    const h = l / 4
                      , d = this.get();
                    if (h > d.length)
                        throw new Error("_sha2: outputLen bigger than state");
                    for (let r = 0; r < h; r++)
                        u.setUint32(4 * r, d[r], a)
                }
                digest() {
                    const {buffer: t, outputLen: e} = this;
                    this.digestInto(t);
                    const n = t.slice(0, e);
                    return this.destroy(),
                    n
                }
                _cloneInto(t) {
                    t || (t = new this.constructor),
                    t.set(...this.get());
                    const {blockLen: e, buffer: n, length: r, finished: i, destroyed: s, pos: o} = this;
                    return t.length = r,
                    t.pos = o,
                    t.finished = i,
                    t.destroyed = s,
                    r % e && t.buffer.set(n),
                    t
                }
            }
            e.SHA2 = o
        }
        ,
        11584: (t,e)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.add = e.toBig = e.split = e.fromBig = void 0;
            const n = BigInt(2 ** 32 - 1)
              , r = BigInt(32);
            function i(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                if (Math.abs(t) > n)
                    throw new Error(String(t) + " is too large for splitting.");
                return e ? {
                    h: Number(t & n),
                    l: 0
                } : {
                    h: 0,
                    l: 0 | Number(t & n)
                }
            }
            function s(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
                  , n = new Uint32Array(t.length)
                  , r = new Uint32Array(t.length);
                for (let s = 0; s < t.length; s++) {
                    const {h: o, l: a} = i(t[s], e);
                    [n[s],r[s]] = [o, a]
                }
                return [n, r]
            }
            e.fromBig = i,
            e.split = s;
            e.toBig = (t,e)=>BigInt(t >>> 0) << r | BigInt(e >>> 0);
            function o(t, e, n, r) {
                const i = (e >>> 0) + (r >>> 0);
                return {
                    h: t + n + (i / 2 ** 32 | 0) | 0,
                    l: 0 | i
                }
            }
            e.add = o;
            const a = {
                fromBig: i,
                split: s,
                toBig: e.toBig,
                shrSH: (t,e,n)=>t >>> n,
                shrSL: (t,e,n)=>t << 32 - n | e >>> n,
                rotrSH: (t,e,n)=>t >>> n | e << 32 - n,
                rotrSL: (t,e,n)=>t << 32 - n | e >>> n,
                rotrBH: (t,e,n)=>t << 64 - n | e >>> n - 32,
                rotrBL: (t,e,n)=>t >>> n - 32 | e << 64 - n,
                rotr32H: (t,e)=>e,
                rotr32L: (t,e)=>t,
                rotlSH: (t,e,n)=>t << n | e >>> 32 - n,
                rotlSL: (t,e,n)=>e << n | t >>> 32 - n,
                rotlBH: (t,e,n)=>e << n - 32 | t >>> 64 - n,
                rotlBL: (t,e,n)=>t << n - 32 | e >>> 64 - n,
                add: o,
                add3L: (t,e,n)=>(t >>> 0) + (e >>> 0) + (n >>> 0),
                add3H: (t,e,n,r)=>e + n + r + (t / 2 ** 32 | 0) | 0,
                add4L: (t,e,n,r)=>(t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0),
                add4H: (t,e,n,r,i)=>e + n + r + i + (t / 2 ** 32 | 0) | 0,
                add5H: (t,e,n,r,i,s)=>e + n + r + i + s + (t / 2 ** 32 | 0) | 0,
                add5L: (t,e,n,r,i)=>(t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0)
            };
            e.default = a
        }
        ,
        59023: (t,e)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.crypto = void 0,
            e.crypto = {
                node: void 0,
                web: "object" === typeof self && "crypto"in self ? self.crypto : void 0
            }
        }
        ,
        20044: (t,e,n)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.hmac = void 0;
            const r = n(84270)
              , i = n(59370);
            class s extends i.Hash {
                constructor(t, e) {
                    super(),
                    this.finished = !1,
                    this.destroyed = !1,
                    r.default.hash(t);
                    const n = (0,
                    i.toBytes)(e);
                    if (this.iHash = t.create(),
                    "function" !== typeof this.iHash.update)
                        throw new TypeError("Expected instance of class which extends utils.Hash");
                    this.blockLen = this.iHash.blockLen,
                    this.outputLen = this.iHash.outputLen;
                    const s = this.blockLen
                      , o = new Uint8Array(s);
                    o.set(n.length > s ? t.create().update(n).digest() : n);
                    for (let r = 0; r < o.length; r++)
                        o[r] ^= 54;
                    this.iHash.update(o),
                    this.oHash = t.create();
                    for (let r = 0; r < o.length; r++)
                        o[r] ^= 106;
                    this.oHash.update(o),
                    o.fill(0)
                }
                update(t) {
                    return r.default.exists(this),
                    this.iHash.update(t),
                    this
                }
                digestInto(t) {
                    r.default.exists(this),
                    r.default.bytes(t, this.outputLen),
                    this.finished = !0,
                    this.iHash.digestInto(t),
                    this.oHash.update(t),
                    this.oHash.digestInto(t),
                    this.destroy()
                }
                digest() {
                    const t = new Uint8Array(this.oHash.outputLen);
                    return this.digestInto(t),
                    t
                }
                _cloneInto(t) {
                    t || (t = Object.create(Object.getPrototypeOf(this), {}));
                    const {oHash: e, iHash: n, finished: r, destroyed: i, blockLen: s, outputLen: o} = this;
                    return t.finished = r,
                    t.destroyed = i,
                    t.blockLen = s,
                    t.outputLen = o,
                    t.oHash = e._cloneInto(t.oHash),
                    t.iHash = n._cloneInto(t.iHash),
                    t
                }
                destroy() {
                    this.destroyed = !0,
                    this.oHash.destroy(),
                    this.iHash.destroy()
                }
            }
            e.hmac = (t,e,n)=>new s(t,e).update(n).digest(),
            e.hmac.create = (t,e)=>new s(t,e)
        }
        ,
        60473: (t,e,n)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.pbkdf2Async = e.pbkdf2 = void 0;
            const r = n(84270)
              , i = n(20044)
              , s = n(59370);
            function o(t, e, n, o) {
                r.default.hash(t);
                const a = (0,
                s.checkOpts)({
                    dkLen: 32,
                    asyncTick: 10
                }, o)
                  , {c: c, dkLen: u, asyncTick: l} = a;
                if (r.default.number(c),
                r.default.number(u),
                r.default.number(l),
                c < 1)
                    throw new Error("PBKDF2: iterations (c) should be >= 1");
                const h = (0,
                s.toBytes)(e)
                  , d = (0,
                s.toBytes)(n)
                  , f = new Uint8Array(u)
                  , p = i.hmac.create(t, h)
                  , y = p._cloneInto().update(d);
                return {
                    c: c,
                    dkLen: u,
                    asyncTick: l,
                    DK: f,
                    PRF: p,
                    PRFSalt: y
                }
            }
            function a(t, e, n, r, i) {
                return t.destroy(),
                e.destroy(),
                r && r.destroy(),
                i.fill(0),
                n
            }
            e.pbkdf2 = function(t, e, n, r) {
                const {c: i, dkLen: c, DK: u, PRF: l, PRFSalt: h} = o(t, e, n, r);
                let d;
                const f = new Uint8Array(4)
                  , p = (0,
                s.createView)(f)
                  , y = new Uint8Array(l.outputLen);
                for (let s = 1, o = 0; o < c; s++,
                o += l.outputLen) {
                    const t = u.subarray(o, o + l.outputLen);
                    p.setInt32(0, s, !1),
                    (d = h._cloneInto(d)).update(f).digestInto(y),
                    t.set(y.subarray(0, t.length));
                    for (let e = 1; e < i; e++) {
                        l._cloneInto(d).update(y).digestInto(y);
                        for (let e = 0; e < t.length; e++)
                            t[e] ^= y[e]
                    }
                }
                return a(l, h, u, d, y)
            }
            ,
            e.pbkdf2Async = async function(t, e, n, r) {
                const {c: i, dkLen: c, asyncTick: u, DK: l, PRF: h, PRFSalt: d} = o(t, e, n, r);
                let f;
                const p = new Uint8Array(4)
                  , y = (0,
                s.createView)(p)
                  , g = new Uint8Array(h.outputLen);
                for (let o = 1, a = 0; a < c; o++,
                a += h.outputLen) {
                    const t = l.subarray(a, a + h.outputLen);
                    y.setInt32(0, o, !1),
                    (f = d._cloneInto(f)).update(p).digestInto(g),
                    t.set(g.subarray(0, t.length)),
                    await (0,
                    s.asyncLoop)(i - 1, u, (e=>{
                        h._cloneInto(f).update(g).digestInto(g);
                        for (let n = 0; n < t.length; n++)
                            t[n] ^= g[n]
                    }
                    ))
                }
                return a(h, d, l, f, g)
            }
        }
        ,
        77901: (t,e,n)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.sha224 = e.sha256 = void 0;
            const r = n(91673)
              , i = n(59370)
              , s = (t,e,n)=>t & e ^ t & n ^ e & n
              , o = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298])
              , a = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225])
              , c = new Uint32Array(64);
            class u extends r.SHA2 {
                constructor() {
                    super(64, 32, 8, !1),
                    this.A = 0 | a[0],
                    this.B = 0 | a[1],
                    this.C = 0 | a[2],
                    this.D = 0 | a[3],
                    this.E = 0 | a[4],
                    this.F = 0 | a[5],
                    this.G = 0 | a[6],
                    this.H = 0 | a[7]
                }
                get() {
                    const {A: t, B: e, C: n, D: r, E: i, F: s, G: o, H: a} = this;
                    return [t, e, n, r, i, s, o, a]
                }
                set(t, e, n, r, i, s, o, a) {
                    this.A = 0 | t,
                    this.B = 0 | e,
                    this.C = 0 | n,
                    this.D = 0 | r,
                    this.E = 0 | i,
                    this.F = 0 | s,
                    this.G = 0 | o,
                    this.H = 0 | a
                }
                process(t, e) {
                    for (let i = 0; i < 16; i++,
                    e += 4)
                        c[i] = t.getUint32(e, !1);
                    for (let s = 16; s < 64; s++) {
                        const t = c[s - 15]
                          , e = c[s - 2]
                          , n = (0,
                        i.rotr)(t, 7) ^ (0,
                        i.rotr)(t, 18) ^ t >>> 3
                          , r = (0,
                        i.rotr)(e, 17) ^ (0,
                        i.rotr)(e, 19) ^ e >>> 10;
                        c[s] = r + c[s - 7] + n + c[s - 16] | 0
                    }
                    let {A: n, B: r, C: a, D: u, E: l, F: h, G: d, H: f} = this;
                    for (let y = 0; y < 64; y++) {
                        const t = f + ((0,
                        i.rotr)(l, 6) ^ (0,
                        i.rotr)(l, 11) ^ (0,
                        i.rotr)(l, 25)) + ((p = l) & h ^ ~p & d) + o[y] + c[y] | 0
                          , e = ((0,
                        i.rotr)(n, 2) ^ (0,
                        i.rotr)(n, 13) ^ (0,
                        i.rotr)(n, 22)) + s(n, r, a) | 0;
                        f = d,
                        d = h,
                        h = l,
                        l = u + t | 0,
                        u = a,
                        a = r,
                        r = n,
                        n = t + e | 0
                    }
                    var p;
                    n = n + this.A | 0,
                    r = r + this.B | 0,
                    a = a + this.C | 0,
                    u = u + this.D | 0,
                    l = l + this.E | 0,
                    h = h + this.F | 0,
                    d = d + this.G | 0,
                    f = f + this.H | 0,
                    this.set(n, r, a, u, l, h, d, f)
                }
                roundClean() {
                    c.fill(0)
                }
                destroy() {
                    this.set(0, 0, 0, 0, 0, 0, 0, 0),
                    this.buffer.fill(0)
                }
            }
            class l extends u {
                constructor() {
                    super(),
                    this.A = -1056596264,
                    this.B = 914150663,
                    this.C = 812702999,
                    this.D = -150054599,
                    this.E = -4191439,
                    this.F = 1750603025,
                    this.G = 1694076839,
                    this.H = -1090891868,
                    this.outputLen = 28
                }
            }
            e.sha256 = (0,
            i.wrapConstructor)((()=>new u)),
            e.sha224 = (0,
            i.wrapConstructor)((()=>new l))
        }
        ,
        26390: (t,e,n)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.sha384 = e.sha512_256 = e.sha512_224 = e.sha512 = e.SHA512 = void 0;
            const r = n(91673)
              , i = n(11584)
              , s = n(59370)
              , o = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298, 3391569614, 3515267271, 3940187606, 4118630271, 116418474, 174292421, 289380356, 460393269, 685471733, 852142971, 1017036298, 1126000580, 1288033470, 1501505948, 1607167915, 1816402316]
              , a = [3609767458, 602891725, 3964484399, 2173295548, 4081628472, 3053834265, 2937671579, 3664609560, 2734883394, 1164996542, 1323610764, 3590304994, 4068182383, 991336113, 633803317, 3479774868, 2666613458, 944711139, 2341262773, 2007800933, 1495990901, 1856431235, 3175218132, 2198950837, 3999719339, 766784016, 2566594879, 3203337956, 1034457026, 2466948901, 3758326383, 168717936, 1188179964, 1546045734, 1522805485, 2643833823, 2343527390, 1014477480, 1206759142, 344077627, 1290863460, 3158454273, 3505952657, 106217008, 3606008344, 1432725776, 1467031594, 851169720, 3100823752, 1363258195, 3750685593, 3785050280, 3318307427, 3812723403, 2003034995, 3602036899, 1575990012, 1125592928, 2716904306, 442776044, 593698344, 3733110249, 2999351573, 3815920427, 3928383900, 566280711, 3454069534, 4000239992, 1914138554, 2731055270, 3203993006, 320620315, 587496836, 1086792851, 365543100, 2618297676, 3409855158, 4234509866, 987167468, 1246189591]
              , c = new Uint32Array(80)
              , u = new Uint32Array(80);
            class l extends r.SHA2 {
                constructor() {
                    super(128, 64, 16, !1),
                    this.Ah = 1779033703,
                    this.Al = -205731576,
                    this.Bh = -1150833019,
                    this.Bl = -2067093701,
                    this.Ch = 1013904242,
                    this.Cl = -23791573,
                    this.Dh = -1521486534,
                    this.Dl = 1595750129,
                    this.Eh = 1359893119,
                    this.El = -1377402159,
                    this.Fh = -1694144372,
                    this.Fl = 725511199,
                    this.Gh = 528734635,
                    this.Gl = -79577749,
                    this.Hh = 1541459225,
                    this.Hl = 327033209
                }
                get() {
                    const {Ah: t, Al: e, Bh: n, Bl: r, Ch: i, Cl: s, Dh: o, Dl: a, Eh: c, El: u, Fh: l, Fl: h, Gh: d, Gl: f, Hh: p, Hl: y} = this;
                    return [t, e, n, r, i, s, o, a, c, u, l, h, d, f, p, y]
                }
                set(t, e, n, r, i, s, o, a, c, u, l, h, d, f, p, y) {
                    this.Ah = 0 | t,
                    this.Al = 0 | e,
                    this.Bh = 0 | n,
                    this.Bl = 0 | r,
                    this.Ch = 0 | i,
                    this.Cl = 0 | s,
                    this.Dh = 0 | o,
                    this.Dl = 0 | a,
                    this.Eh = 0 | c,
                    this.El = 0 | u,
                    this.Fh = 0 | l,
                    this.Fl = 0 | h,
                    this.Gh = 0 | d,
                    this.Gl = 0 | f,
                    this.Hh = 0 | p,
                    this.Hl = 0 | y
                }
                process(t, e) {
                    for (let i = 0; i < 16; i++,
                    e += 4)
                        c[i] = t.getUint32(e),
                        u[i] = t.getUint32(e += 4);
                    for (let o = 16; o < 80; o++) {
                        const t = 0 | c[o - 15]
                          , e = 0 | u[o - 15]
                          , n = i.default.rotrSH(t, e, 1) ^ i.default.rotrSH(t, e, 8) ^ i.default.shrSH(t, e, 7)
                          , r = i.default.rotrSL(t, e, 1) ^ i.default.rotrSL(t, e, 8) ^ i.default.shrSL(t, e, 7)
                          , s = 0 | c[o - 2]
                          , a = 0 | u[o - 2]
                          , l = i.default.rotrSH(s, a, 19) ^ i.default.rotrBH(s, a, 61) ^ i.default.shrSH(s, a, 6)
                          , h = i.default.rotrSL(s, a, 19) ^ i.default.rotrBL(s, a, 61) ^ i.default.shrSL(s, a, 6)
                          , d = i.default.add4L(r, h, u[o - 7], u[o - 16])
                          , f = i.default.add4H(d, n, l, c[o - 7], c[o - 16]);
                        c[o] = 0 | f,
                        u[o] = 0 | d
                    }
                    let {Ah: n, Al: r, Bh: s, Bl: l, Ch: h, Cl: d, Dh: f, Dl: p, Eh: y, El: g, Fh: w, Fl: b, Gh: _, Gl: v, Hh: m, Hl: A} = this;
                    for (let E = 0; E < 80; E++) {
                        const t = i.default.rotrSH(y, g, 14) ^ i.default.rotrSH(y, g, 18) ^ i.default.rotrBH(y, g, 41)
                          , e = i.default.rotrSL(y, g, 14) ^ i.default.rotrSL(y, g, 18) ^ i.default.rotrBL(y, g, 41)
                          , x = y & w ^ ~y & _
                          , U = g & b ^ ~g & v
                          , B = i.default.add5L(A, e, U, a[E], u[E])
                          , T = i.default.add5H(B, m, t, x, o[E], c[E])
                          , S = 0 | B
                          , z = i.default.rotrSH(n, r, 28) ^ i.default.rotrBH(n, r, 34) ^ i.default.rotrBH(n, r, 39)
                          , k = i.default.rotrSL(n, r, 28) ^ i.default.rotrBL(n, r, 34) ^ i.default.rotrBL(n, r, 39)
                          , I = n & s ^ n & h ^ s & h
                          , L = r & l ^ r & d ^ l & d;
                        m = 0 | _,
                        A = 0 | v,
                        _ = 0 | w,
                        v = 0 | b,
                        w = 0 | y,
                        b = 0 | g,
                        ({h: y, l: g} = i.default.add(0 | f, 0 | p, 0 | T, 0 | S)),
                        f = 0 | h,
                        p = 0 | d,
                        h = 0 | s,
                        d = 0 | l,
                        s = 0 | n,
                        l = 0 | r;
                        const C = i.default.add3L(S, k, L);
                        n = i.default.add3H(C, T, z, I),
                        r = 0 | C
                    }
                    ({h: n, l: r} = i.default.add(0 | this.Ah, 0 | this.Al, 0 | n, 0 | r)),
                    ({h: s, l: l} = i.default.add(0 | this.Bh, 0 | this.Bl, 0 | s, 0 | l)),
                    ({h: h, l: d} = i.default.add(0 | this.Ch, 0 | this.Cl, 0 | h, 0 | d)),
                    ({h: f, l: p} = i.default.add(0 | this.Dh, 0 | this.Dl, 0 | f, 0 | p)),
                    ({h: y, l: g} = i.default.add(0 | this.Eh, 0 | this.El, 0 | y, 0 | g)),
                    ({h: w, l: b} = i.default.add(0 | this.Fh, 0 | this.Fl, 0 | w, 0 | b)),
                    ({h: _, l: v} = i.default.add(0 | this.Gh, 0 | this.Gl, 0 | _, 0 | v)),
                    ({h: m, l: A} = i.default.add(0 | this.Hh, 0 | this.Hl, 0 | m, 0 | A)),
                    this.set(n, r, s, l, h, d, f, p, y, g, w, b, _, v, m, A)
                }
                roundClean() {
                    c.fill(0),
                    u.fill(0)
                }
                destroy() {
                    this.buffer.fill(0),
                    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
            }
            e.SHA512 = l;
            class h extends l {
                constructor() {
                    super(),
                    this.Ah = -1942145080,
                    this.Al = 424955298,
                    this.Bh = 1944164710,
                    this.Bl = -1982016298,
                    this.Ch = 502970286,
                    this.Cl = 855612546,
                    this.Dh = 1738396948,
                    this.Dl = 1479516111,
                    this.Eh = 258812777,
                    this.El = 2077511080,
                    this.Fh = 2011393907,
                    this.Fl = 79989058,
                    this.Gh = 1067287976,
                    this.Gl = 1780299464,
                    this.Hh = 286451373,
                    this.Hl = -1848208735,
                    this.outputLen = 28
                }
            }
            class d extends l {
                constructor() {
                    super(),
                    this.Ah = 573645204,
                    this.Al = -64227540,
                    this.Bh = -1621794909,
                    this.Bl = -934517566,
                    this.Ch = 596883563,
                    this.Cl = 1867755857,
                    this.Dh = -1774684391,
                    this.Dl = 1497426621,
                    this.Eh = -1775747358,
                    this.El = -1467023389,
                    this.Fh = -1101128155,
                    this.Fl = 1401305490,
                    this.Gh = 721525244,
                    this.Gl = 746961066,
                    this.Hh = 246885852,
                    this.Hl = -2117784414,
                    this.outputLen = 32
                }
            }
            class f extends l {
                constructor() {
                    super(),
                    this.Ah = -876896931,
                    this.Al = -1056596264,
                    this.Bh = 1654270250,
                    this.Bl = 914150663,
                    this.Ch = -1856437926,
                    this.Cl = 812702999,
                    this.Dh = 355462360,
                    this.Dl = -150054599,
                    this.Eh = 1731405415,
                    this.El = -4191439,
                    this.Fh = -1900787065,
                    this.Fl = 1750603025,
                    this.Gh = -619958771,
                    this.Gl = 1694076839,
                    this.Hh = 1203062813,
                    this.Hl = -1090891868,
                    this.outputLen = 48
                }
            }
            e.sha512 = (0,
            s.wrapConstructor)((()=>new l)),
            e.sha512_224 = (0,
            s.wrapConstructor)((()=>new h)),
            e.sha512_256 = (0,
            s.wrapConstructor)((()=>new d)),
            e.sha384 = (0,
            s.wrapConstructor)((()=>new f))
        }
        ,
        59370: (t,e,n)=>{
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.randomBytes = e.wrapConstructorWithOpts = e.wrapConstructor = e.checkOpts = e.Hash = e.concatBytes = e.toBytes = e.utf8ToBytes = e.asyncLoop = e.nextTick = e.hexToBytes = e.bytesToHex = e.isLE = e.rotr = e.createView = e.u32 = e.u8 = void 0;
            const r = n(59023);
            e.u8 = t=>new Uint8Array(t.buffer,t.byteOffset,t.byteLength);
            e.u32 = t=>new Uint32Array(t.buffer,t.byteOffset,Math.floor(t.byteLength / 4));
            e.createView = t=>new DataView(t.buffer,t.byteOffset,t.byteLength);
            if (e.rotr = (t,e)=>t << 32 - e | t >>> e,
            e.isLE = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0],
            !e.isLE)
                throw new Error("Non little-endian hardware is not supported");
            const i = Array.from({
                length: 256
            }, ((t,e)=>e.toString(16).padStart(2, "0")));
            e.bytesToHex = function(t) {
                if (!(t instanceof Uint8Array))
                    throw new Error("Uint8Array expected");
                let e = "";
                for (let n = 0; n < t.length; n++)
                    e += i[t[n]];
                return e
            }
            ,
            e.hexToBytes = function(t) {
                if ("string" !== typeof t)
                    throw new TypeError("hexToBytes: expected string, got " + typeof t);
                if (t.length % 2)
                    throw new Error("hexToBytes: received invalid unpadded hex");
                const e = new Uint8Array(t.length / 2);
                for (let n = 0; n < e.length; n++) {
                    const r = 2 * n
                      , i = t.slice(r, r + 2)
                      , s = Number.parseInt(i, 16);
                    if (Number.isNaN(s) || s < 0)
                        throw new Error("Invalid byte sequence");
                    e[n] = s
                }
                return e
            }
            ;
            function s(t) {
                if ("string" !== typeof t)
                    throw new TypeError("utf8ToBytes expected string, got ".concat(typeof t));
                return (new TextEncoder).encode(t)
            }
            function o(t) {
                if ("string" === typeof t && (t = s(t)),
                !(t instanceof Uint8Array))
                    throw new TypeError("Expected input type is Uint8Array (got ".concat(typeof t, ")"));
                return t
            }
            e.nextTick = async()=>{}
            ,
            e.asyncLoop = async function(t, n, r) {
                let i = Date.now();
                for (let s = 0; s < t; s++) {
                    r(s);
                    const t = Date.now() - i;
                    t >= 0 && t < n || (await (0,
                    e.nextTick)(),
                    i += t)
                }
            }
            ,
            e.utf8ToBytes = s,
            e.toBytes = o,
            e.concatBytes = function() {
                for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                    e[n] = arguments[n];
                if (!e.every((t=>t instanceof Uint8Array)))
                    throw new Error("Uint8Array list expected");
                if (1 === e.length)
                    return e[0];
                const r = e.reduce(((t,e)=>t + e.length), 0)
                  , i = new Uint8Array(r);
                for (let s = 0, o = 0; s < e.length; s++) {
                    const t = e[s];
                    i.set(t, o),
                    o += t.length
                }
                return i
            }
            ;
            e.Hash = class {
                clone() {
                    return this._cloneInto()
                }
            }
            ;
            e.checkOpts = function(t, e) {
                if (void 0 !== e && ("object" !== typeof e || (n = e,
                "[object Object]" !== Object.prototype.toString.call(n) || n.constructor !== Object)))
                    throw new TypeError("Options should be object or undefined");
                var n;
                return Object.assign(t, e)
            }
            ,
            e.wrapConstructor = function(t) {
                const e = e=>t().update(o(e)).digest()
                  , n = t();
                return e.outputLen = n.outputLen,
                e.blockLen = n.blockLen,
                e.create = ()=>t(),
                e
            }
            ,
            e.wrapConstructorWithOpts = function(t) {
                const e = (e,n)=>t(n).update(o(e)).digest()
                  , n = t({});
                return e.outputLen = n.outputLen,
                e.blockLen = n.blockLen,
                e.create = e=>t(e),
                e
            }
            ,
            e.randomBytes = function() {
                let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 32;
                if (r.crypto.web)
                    return r.crypto.web.getRandomValues(new Uint8Array(t));
                if (r.crypto.node)
                    return new Uint8Array(r.crypto.node.randomBytes(t).buffer);
                throw new Error("The environment doesn't have randomBytes function")
            }
        }
        ,
        44685: (t,e)=>{
            "use strict";
            function n(t) {
                if (!Number.isSafeInteger(t))
                    throw new Error("Wrong integer: ".concat(t))
            }
            function r() {
                const t = (t,e)=>n=>t(e(n));
                for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
                    n[r] = arguments[r];
                return {
                    encode: Array.from(n).reverse().reduce(((e,n)=>e ? t(e, n.encode) : n.encode), void 0),
                    decode: n.reduce(((e,n)=>e ? t(e, n.decode) : n.decode), void 0)
                }
            }
            function i(t) {
                return {
                    encode: e=>{
                        if (!Array.isArray(e) || e.length && "number" !== typeof e[0])
                            throw new Error("alphabet.encode input should be an array of numbers");
                        return e.map((e=>{
                            if (n(e),
                            e < 0 || e >= t.length)
                                throw new Error("Digit index outside alphabet: ".concat(e, " (alphabet: ").concat(t.length, ")"));
                            return t[e]
                        }
                        ))
                    }
                    ,
                    decode: e=>{
                        if (!Array.isArray(e) || e.length && "string" !== typeof e[0])
                            throw new Error("alphabet.decode input should be array of strings");
                        return e.map((e=>{
                            if ("string" !== typeof e)
                                throw new Error("alphabet.decode: not string element=".concat(e));
                            const n = t.indexOf(e);
                            if (-1 === n)
                                throw new Error('Unknown letter: "'.concat(e, '". Allowed: ').concat(t));
                            return n
                        }
                        ))
                    }
                }
            }
            function s() {
                let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                if ("string" !== typeof t)
                    throw new Error("join separator should be string");
                return {
                    encode: e=>{
                        if (!Array.isArray(e) || e.length && "string" !== typeof e[0])
                            throw new Error("join.encode input should be array of strings");
                        for (let t of e)
                            if ("string" !== typeof t)
                                throw new Error("join.encode: non-string input=".concat(t));
                        return e.join(t)
                    }
                    ,
                    decode: e=>{
                        if ("string" !== typeof e)
                            throw new Error("join.decode input should be string");
                        return e.split(t)
                    }
                }
            }
            function o(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "=";
                if (n(t),
                "string" !== typeof e)
                    throw new Error("padding chr should be string");
                return {
                    encode(n) {
                        if (!Array.isArray(n) || n.length && "string" !== typeof n[0])
                            throw new Error("padding.encode input should be array of strings");
                        for (let t of n)
                            if ("string" !== typeof t)
                                throw new Error("padding.encode: non-string input=".concat(t));
                        for (; n.length * t % 8; )
                            n.push(e);
                        return n
                    },
                    decode(n) {
                        if (!Array.isArray(n) || n.length && "string" !== typeof n[0])
                            throw new Error("padding.encode input should be array of strings");
                        for (let t of n)
                            if ("string" !== typeof t)
                                throw new Error("padding.decode: non-string input=".concat(t));
                        let r = n.length;
                        if (r * t % 8)
                            throw new Error("Invalid padding: string should have whole number of bytes");
                        for (; r > 0 && n[r - 1] === e; r--)
                            if (!((r - 1) * t % 8))
                                throw new Error("Invalid padding: string has too much padding");
                        return n.slice(0, r)
                    }
                }
            }
            function a(t) {
                if ("function" !== typeof t)
                    throw new Error("normalize fn should be function");
                return {
                    encode: t=>t,
                    decode: e=>t(e)
                }
            }
            function c(t, e, r) {
                if (e < 2)
                    throw new Error("convertRadix: wrong from=".concat(e, ", base cannot be less than 2"));
                if (r < 2)
                    throw new Error("convertRadix: wrong to=".concat(r, ", base cannot be less than 2"));
                if (!Array.isArray(t))
                    throw new Error("convertRadix: data should be array");
                if (!t.length)
                    return [];
                let i = 0;
                const s = []
                  , o = Array.from(t);
                for (o.forEach((t=>{
                    if (n(t),
                    t < 0 || t >= e)
                        throw new Error("Wrong integer: ".concat(t))
                }
                )); ; ) {
                    let t = 0
                      , n = !0;
                    for (let s = i; s < o.length; s++) {
                        const a = o[s]
                          , c = e * t + a;
                        if (!Number.isSafeInteger(c) || e * t / e !== t || c - a !== e * t)
                            throw new Error("convertRadix: carry overflow");
                        if (t = c % r,
                        o[s] = Math.floor(c / r),
                        !Number.isSafeInteger(o[s]) || o[s] * r + t !== c)
                            throw new Error("convertRadix: carry overflow");
                        n && (o[s] ? n = !1 : i = s)
                    }
                    if (s.push(t),
                    n)
                        break
                }
                for (let n = 0; n < t.length - 1 && 0 === t[n]; n++)
                    s.push(0);
                return s.reverse()
            }
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.bytes = e.stringToBytes = e.str = e.bytesToString = e.hex = e.utf8 = e.bech32m = e.bech32 = e.base58check = e.base58xmr = e.base58xrp = e.base58flickr = e.base58 = e.base64url = e.base64 = e.base32crockford = e.base32hex = e.base32 = e.base16 = e.utils = e.assertNumber = void 0,
            e.assertNumber = n;
            const u = (t,e)=>e ? u(e, t % e) : t
              , l = (t,e)=>t + (e - u(t, e));
            function h(t, e, r, i) {
                if (!Array.isArray(t))
                    throw new Error("convertRadix2: data should be array");
                if (e <= 0 || e > 32)
                    throw new Error("convertRadix2: wrong from=".concat(e));
                if (r <= 0 || r > 32)
                    throw new Error("convertRadix2: wrong to=".concat(r));
                if (l(e, r) > 32)
                    throw new Error("convertRadix2: carry overflow from=".concat(e, " to=").concat(r, " carryBits=").concat(l(e, r)));
                let s = 0
                  , o = 0;
                const a = 2 ** r - 1
                  , c = [];
                for (const u of t) {
                    if (n(u),
                    u >= 2 ** e)
                        throw new Error("convertRadix2: invalid data word=".concat(u, " from=").concat(e));
                    if (s = s << e | u,
                    o + e > 32)
                        throw new Error("convertRadix2: carry overflow pos=".concat(o, " from=").concat(e));
                    for (o += e; o >= r; o -= r)
                        c.push((s >> o - r & a) >>> 0);
                    s &= 2 ** o - 1
                }
                if (s = s << r - o & a,
                !i && o >= e)
                    throw new Error("Excess padding");
                if (!i && s)
                    throw new Error("Non-zero padding: ".concat(s));
                return i && o > 0 && c.push(s >>> 0),
                c
            }
            function d(t) {
                return n(t),
                {
                    encode: e=>{
                        if (!(e instanceof Uint8Array))
                            throw new Error("radix.encode input should be Uint8Array");
                        return c(Array.from(e), 256, t)
                    }
                    ,
                    decode: e=>{
                        if (!Array.isArray(e) || e.length && "number" !== typeof e[0])
                            throw new Error("radix.decode input should be array of strings");
                        return Uint8Array.from(c(e, t, 256))
                    }
                }
            }
            function f(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                if (n(t),
                t <= 0 || t > 32)
                    throw new Error("radix2: bits should be in (0..32]");
                if (l(8, t) > 32 || l(t, 8) > 32)
                    throw new Error("radix2: carry overflow");
                return {
                    encode: n=>{
                        if (!(n instanceof Uint8Array))
                            throw new Error("radix2.encode input should be Uint8Array");
                        return h(Array.from(n), 8, t, !e)
                    }
                    ,
                    decode: n=>{
                        if (!Array.isArray(n) || n.length && "number" !== typeof n[0])
                            throw new Error("radix2.decode input should be array of strings");
                        return Uint8Array.from(h(n, t, 8, e))
                    }
                }
            }
            function p(t) {
                if ("function" !== typeof t)
                    throw new Error("unsafeWrapper fn should be function");
                return function() {
                    try {
                        for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
                            n[r] = arguments[r];
                        return t.apply(null, n)
                    } catch (i) {}
                }
            }
            function y(t, e) {
                if (n(t),
                "function" !== typeof e)
                    throw new Error("checksum fn should be function");
                return {
                    encode(n) {
                        if (!(n instanceof Uint8Array))
                            throw new Error("checksum.encode: input should be Uint8Array");
                        const r = e(n).slice(0, t)
                          , i = new Uint8Array(n.length + t);
                        return i.set(n),
                        i.set(r, n.length),
                        i
                    },
                    decode(n) {
                        if (!(n instanceof Uint8Array))
                            throw new Error("checksum.decode: input should be Uint8Array");
                        const r = n.slice(0, -t)
                          , i = e(r).slice(0, t)
                          , s = n.slice(-t);
                        for (let e = 0; e < t; e++)
                            if (i[e] !== s[e])
                                throw new Error("Invalid checksum");
                        return r
                    }
                }
            }
            e.utils = {
                alphabet: i,
                chain: r,
                checksum: y,
                radix: d,
                radix2: f,
                join: s,
                padding: o
            },
            e.base16 = r(f(4), i("0123456789ABCDEF"), s("")),
            e.base32 = r(f(5), i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), o(5), s("")),
            e.base32hex = r(f(5), i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), o(5), s("")),
            e.base32crockford = r(f(5), i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), s(""), a((t=>t.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")))),
            e.base64 = r(f(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), o(6), s("")),
            e.base64url = r(f(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), o(6), s(""));
            const g = t=>r(d(58), i(t), s(""));
            e.base58 = g("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),
            e.base58flickr = g("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),
            e.base58xrp = g("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
            const w = [0, 2, 3, 5, 6, 7, 9, 10, 11];
            e.base58xmr = {
                encode(t) {
                    let n = "";
                    for (let r = 0; r < t.length; r += 8) {
                        const i = t.subarray(r, r + 8);
                        n += e.base58.encode(i).padStart(w[i.length], "1")
                    }
                    return n
                },
                decode(t) {
                    let n = [];
                    for (let r = 0; r < t.length; r += 11) {
                        const i = t.slice(r, r + 11)
                          , s = w.indexOf(i.length)
                          , o = e.base58.decode(i);
                        for (let t = 0; t < o.length - s; t++)
                            if (0 !== o[t])
                                throw new Error("base58xmr: wrong padding");
                        n = n.concat(Array.from(o.slice(o.length - s)))
                    }
                    return Uint8Array.from(n)
                }
            };
            e.base58check = t=>r(y(4, (e=>t(t(e)))), e.base58);
            const b = r(i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), s(""))
              , _ = [996825010, 642813549, 513874426, 1027748829, 705979059];
            function v(t) {
                const e = t >> 25;
                let n = (33554431 & t) << 5;
                for (let r = 0; r < _.length; r++)
                    1 === (e >> r & 1) && (n ^= _[r]);
                return n
            }
            function m(t, e) {
                let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
                const r = t.length;
                let i = 1;
                for (let s = 0; s < r; s++) {
                    const e = t.charCodeAt(s);
                    if (e < 33 || e > 126)
                        throw new Error("Invalid prefix (".concat(t, ")"));
                    i = v(i) ^ e >> 5
                }
                i = v(i);
                for (let s = 0; s < r; s++)
                    i = v(i) ^ 31 & t.charCodeAt(s);
                for (let s of e)
                    i = v(i) ^ s;
                for (let s = 0; s < 6; s++)
                    i = v(i);
                return i ^= n,
                b.encode(h([i % 2 ** 30], 30, 5, !1))
            }
            function A(t) {
                const e = "bech32" === t ? 1 : 734539939
                  , n = f(5)
                  , r = n.decode
                  , i = n.encode
                  , s = p(r);
                function o(t) {
                    let n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 90;
                    if ("string" !== typeof t)
                        throw new Error("bech32.decode input should be string, not ".concat(typeof t));
                    if (t.length < 8 || !1 !== n && t.length > n)
                        throw new TypeError("Wrong string length: ".concat(t.length, " (").concat(t, "). Expected (8..").concat(n, ")"));
                    const r = t.toLowerCase();
                    if (t !== r && t !== t.toUpperCase())
                        throw new Error("String must be lowercase or uppercase");
                    const i = (t = r).lastIndexOf("1");
                    if (0 === i || -1 === i)
                        throw new Error('Letter "1" must be present between prefix and data only');
                    const s = t.slice(0, i)
                      , o = t.slice(i + 1);
                    if (o.length < 6)
                        throw new Error("Data must be at least 6 characters long");
                    const a = b.decode(o).slice(0, -6)
                      , c = m(s, a, e);
                    if (!o.endsWith(c))
                        throw new Error("Invalid checksum in ".concat(t, ': expected "').concat(c, '"'));
                    return {
                        prefix: s,
                        words: a
                    }
                }
                return {
                    encode: function(t, n) {
                        let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 90;
                        if ("string" !== typeof t)
                            throw new Error("bech32.encode prefix should be string, not ".concat(typeof t));
                        if (!Array.isArray(n) || n.length && "number" !== typeof n[0])
                            throw new Error("bech32.encode words should be array of numbers, not ".concat(typeof n));
                        const i = t.length + 7 + n.length;
                        if (!1 !== r && i > r)
                            throw new TypeError("Length ".concat(i, " exceeds limit ").concat(r));
                        return t = t.toLowerCase(),
                        "".concat(t, "1").concat(b.encode(n)).concat(m(t, n, e))
                    },
                    decode: o,
                    decodeToBytes: function(t) {
                        const {prefix: e, words: n} = o(t, !1);
                        return {
                            prefix: e,
                            words: n,
                            bytes: r(n)
                        }
                    },
                    decodeUnsafe: p(o),
                    fromWords: r,
                    fromWordsUnsafe: s,
                    toWords: i
                }
            }
            e.bech32 = A("bech32"),
            e.bech32m = A("bech32m"),
            e.utf8 = {
                encode: t=>(new TextDecoder).decode(t),
                decode: t=>(new TextEncoder).encode(t)
            },
            e.hex = r(f(4), i("0123456789abcdef"), s(""), a((t=>{
                if ("string" !== typeof t || t.length % 2)
                    throw new TypeError("hex.decode: expected string, got ".concat(typeof t, " with length ").concat(t.length));
                return t.toLowerCase()
            }
            )));
            const E = {
                utf8: e.utf8,
                hex: e.hex,
                base16: e.base16,
                base32: e.base32,
                base64: e.base64,
                base64url: e.base64url,
                base58: e.base58,
                base58xmr: e.base58xmr
            }
              , x = "Invalid encoding type. Available types: ".concat(Object.keys(E).join(", "));
            e.bytesToString = (t,e)=>{
                if ("string" !== typeof t || !E.hasOwnProperty(t))
                    throw new TypeError(x);
                if (!(e instanceof Uint8Array))
                    throw new TypeError("bytesToString() expects Uint8Array");
                return E[t].encode(e)
            }
            ,
            e.str = e.bytesToString;
            e.stringToBytes = (t,e)=>{
                if (!E.hasOwnProperty(t))
                    throw new TypeError(x);
                if ("string" !== typeof e)
                    throw new TypeError("stringToBytes() expects string");
                return E[t].decode(e)
            }
            ,
            e.bytes = e.stringToBytes
        }
        ,
        79530: (t,e,n)=>{
            "use strict";
            e.Z1 = void 0;
            const r = n(84270)
              , i = n(60473)
              , s = n(77901)
              , o = n(26390)
              , a = n(59370)
              , c = n(44685)
              , u = t=>"\u3042\u3044\u3053\u304f\u3057\u3093" === t[0];
            function l(t) {
                if ("string" !== typeof t)
                    throw new TypeError("Invalid mnemonic type: ".concat(typeof t));
                return t.normalize("NFKD")
            }
            function h(t) {
                const e = l(t)
                  , n = e.split(" ");
                if (![12, 15, 18, 21, 24].includes(n.length))
                    throw new Error("Invalid mnemonic");
                return {
                    nfkd: e,
                    words: n
                }
            }
            function d(t) {
                r.default.bytes(t, 16, 20, 24, 28, 32)
            }
            const f = t=>{
                const e = 8 - t.length / 4;
                return new Uint8Array([(0,
                s.sha256)(t)[0] >> e << e])
            }
            ;
            function p(t) {
                if (!Array.isArray(t) || 2048 !== t.length || "string" !== typeof t[0])
                    throw new Error("Worlist: expected array of 2048 strings");
                return t.forEach((t=>{
                    if ("string" !== typeof t)
                        throw new Error("Wordlist: non-string element: ".concat(t))
                }
                )),
                c.utils.chain(c.utils.checksum(1, f), c.utils.radix2(11, !0), c.utils.alphabet(t))
            }
            function y(t, e) {
                const {words: n} = h(t)
                  , r = p(e).decode(n);
                return d(r),
                r
            }
            function g(t, e) {
                d(t);
                return p(e).encode(t).join(u(e) ? "\u3000" : " ")
            }
            const w = t=>l("mnemonic".concat(t));
            e.Z1 = function(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                return (0,
                i.pbkdf2)(o.sha512, h(t).nfkd, w(e), {
                    c: 2048,
                    dkLen: 64
                })
            }
        }
        ,
        26925: (t,e,n)=>{
            t.exports = n(92349)
        }
        ,
        20819: (t,e,n)=>{
            "use strict";
            var r = n(69119)
              , i = n(70622)
              , s = n(90634)
              , o = n(42666)
              , a = n(46870)
              , c = n(49745)
              , u = n(59327)
              , l = n(69846)
              , h = n(35158)
              , d = n(46297)
              , f = n(8277);
            t.exports = function(t) {
                return new Promise((function(e, n) {
                    var p, y = t.data, g = t.headers, w = t.responseType;
                    function b() {
                        t.cancelToken && t.cancelToken.unsubscribe(p),
                        t.signal && t.signal.removeEventListener("abort", p)
                    }
                    r.isFormData(y) && r.isStandardBrowserEnv() && delete g["Content-Type"];
                    var _ = new XMLHttpRequest;
                    if (t.auth) {
                        var v = t.auth.username || ""
                          , m = t.auth.password ? unescape(encodeURIComponent(t.auth.password)) : "";
                        g.Authorization = "Basic " + btoa(v + ":" + m)
                    }
                    var A = a(t.baseURL, t.url);
                    function E() {
                        if (_) {
                            var r = "getAllResponseHeaders"in _ ? c(_.getAllResponseHeaders()) : null
                              , s = {
                                data: w && "text" !== w && "json" !== w ? _.response : _.responseText,
                                status: _.status,
                                statusText: _.statusText,
                                headers: r,
                                config: t,
                                request: _
                            };
                            i((function(t) {
                                e(t),
                                b()
                            }
                            ), (function(t) {
                                n(t),
                                b()
                            }
                            ), s),
                            _ = null
                        }
                    }
                    if (_.open(t.method.toUpperCase(), o(A, t.params, t.paramsSerializer), !0),
                    _.timeout = t.timeout,
                    "onloadend"in _ ? _.onloadend = E : _.onreadystatechange = function() {
                        _ && 4 === _.readyState && (0 !== _.status || _.responseURL && 0 === _.responseURL.indexOf("file:")) && setTimeout(E)
                    }
                    ,
                    _.onabort = function() {
                        _ && (n(new h("Request aborted",h.ECONNABORTED,t,_)),
                        _ = null)
                    }
                    ,
                    _.onerror = function() {
                        n(new h("Network Error",h.ERR_NETWORK,t,_,_)),
                        _ = null
                    }
                    ,
                    _.ontimeout = function() {
                        var e = t.timeout ? "timeout of " + t.timeout + "ms exceeded" : "timeout exceeded"
                          , r = t.transitional || l;
                        t.timeoutErrorMessage && (e = t.timeoutErrorMessage),
                        n(new h(e,r.clarifyTimeoutError ? h.ETIMEDOUT : h.ECONNABORTED,t,_)),
                        _ = null
                    }
                    ,
                    r.isStandardBrowserEnv()) {
                        var x = (t.withCredentials || u(A)) && t.xsrfCookieName ? s.read(t.xsrfCookieName) : void 0;
                        x && (g[t.xsrfHeaderName] = x)
                    }
                    "setRequestHeader"in _ && r.forEach(g, (function(t, e) {
                        "undefined" === typeof y && "content-type" === e.toLowerCase() ? delete g[e] : _.setRequestHeader(e, t)
                    }
                    )),
                    r.isUndefined(t.withCredentials) || (_.withCredentials = !!t.withCredentials),
                    w && "json" !== w && (_.responseType = t.responseType),
                    "function" === typeof t.onDownloadProgress && _.addEventListener("progress", t.onDownloadProgress),
                    "function" === typeof t.onUploadProgress && _.upload && _.upload.addEventListener("progress", t.onUploadProgress),
                    (t.cancelToken || t.signal) && (p = function(t) {
                        _ && (n(!t || t && t.type ? new d : t),
                        _.abort(),
                        _ = null)
                    }
                    ,
                    t.cancelToken && t.cancelToken.subscribe(p),
                    t.signal && (t.signal.aborted ? p() : t.signal.addEventListener("abort", p))),
                    y || (y = null);
                    var U = f(A);
                    U && -1 === ["http", "https", "file"].indexOf(U) ? n(new h("Unsupported protocol " + U + ":",h.ERR_BAD_REQUEST,t)) : _.send(y)
                }
                ))
            }
        }
        ,
        92349: (t,e,n)=>{
            "use strict";
            var r = n(69119)
              , i = n(45906)
              , s = n(77597)
              , o = n(59936);
            var a = function t(e) {
                var n = new s(e)
                  , a = i(s.prototype.request, n);
                return r.extend(a, s.prototype, n),
                r.extend(a, n),
                a.create = function(n) {
                    return t(o(e, n))
                }
                ,
                a
            }(n(86284));
            a.Axios = s,
            a.CanceledError = n(46297),
            a.CancelToken = n(51132),
            a.isCancel = n(69088),
            a.VERSION = n(71771).version,
            a.toFormData = n(87008),
            a.AxiosError = n(35158),
            a.Cancel = a.CanceledError,
            a.all = function(t) {
                return Promise.all(t)
            }
            ,
            a.spread = n(1228),
            a.isAxiosError = n(31926),
            t.exports = a,
            t.exports.default = a
        }
        ,
        51132: (t,e,n)=>{
            "use strict";
            var r = n(46297);
            function i(t) {
                if ("function" !== typeof t)
                    throw new TypeError("executor must be a function.");
                var e;
                this.promise = new Promise((function(t) {
                    e = t
                }
                ));
                var n = this;
                this.promise.then((function(t) {
                    if (n._listeners) {
                        var e, r = n._listeners.length;
                        for (e = 0; e < r; e++)
                            n._listeners[e](t);
                        n._listeners = null
                    }
                }
                )),
                this.promise.then = function(t) {
                    var e, r = new Promise((function(t) {
                        n.subscribe(t),
                        e = t
                    }
                    )).then(t);
                    return r.cancel = function() {
                        n.unsubscribe(e)
                    }
                    ,
                    r
                }
                ,
                t((function(t) {
                    n.reason || (n.reason = new r(t),
                    e(n.reason))
                }
                ))
            }
            i.prototype.throwIfRequested = function() {
                if (this.reason)
                    throw this.reason
            }
            ,
            i.prototype.subscribe = function(t) {
                this.reason ? t(this.reason) : this._listeners ? this._listeners.push(t) : this._listeners = [t]
            }
            ,
            i.prototype.unsubscribe = function(t) {
                if (this._listeners) {
                    var e = this._listeners.indexOf(t);
                    -1 !== e && this._listeners.splice(e, 1)
                }
            }
            ,
            i.source = function() {
                var t;
                return {
                    token: new i((function(e) {
                        t = e
                    }
                    )),
                    cancel: t
                }
            }
            ,
            t.exports = i
        }
        ,
        46297: (t,e,n)=>{
            "use strict";
            var r = n(35158);
            function i(t) {
                r.call(this, null == t ? "canceled" : t, r.ERR_CANCELED),
                this.name = "CanceledError"
            }
            n(69119).inherits(i, r, {
                __CANCEL__: !0
            }),
            t.exports = i
        }
        ,
        69088: t=>{
            "use strict";
            t.exports = function(t) {
                return !(!t || !t.__CANCEL__)
            }
        }
        ,
        77597: (t,e,n)=>{
            "use strict";
            var r = n(69119)
              , i = n(42666)
              , s = n(53889)
              , o = n(60659)
              , a = n(59936)
              , c = n(46870)
              , u = n(42299)
              , l = u.validators;
            function h(t) {
                this.defaults = t,
                this.interceptors = {
                    request: new s,
                    response: new s
                }
            }
            h.prototype.request = function(t, e) {
                "string" === typeof t ? (e = e || {}).url = t : e = t || {},
                (e = a(this.defaults, e)).method ? e.method = e.method.toLowerCase() : this.defaults.method ? e.method = this.defaults.method.toLowerCase() : e.method = "get";
                var n = e.transitional;
                void 0 !== n && u.assertOptions(n, {
                    silentJSONParsing: l.transitional(l.boolean),
                    forcedJSONParsing: l.transitional(l.boolean),
                    clarifyTimeoutError: l.transitional(l.boolean)
                }, !1);
                var r = []
                  , i = !0;
                this.interceptors.request.forEach((function(t) {
                    "function" === typeof t.runWhen && !1 === t.runWhen(e) || (i = i && t.synchronous,
                    r.unshift(t.fulfilled, t.rejected))
                }
                ));
                var s, c = [];
                if (this.interceptors.response.forEach((function(t) {
                    c.push(t.fulfilled, t.rejected)
                }
                )),
                !i) {
                    var h = [o, void 0];
                    for (Array.prototype.unshift.apply(h, r),
                    h = h.concat(c),
                    s = Promise.resolve(e); h.length; )
                        s = s.then(h.shift(), h.shift());
                    return s
                }
                for (var d = e; r.length; ) {
                    var f = r.shift()
                      , p = r.shift();
                    try {
                        d = f(d)
                    } catch (y) {
                        p(y);
                        break
                    }
                }
                try {
                    s = o(d)
                } catch (y) {
                    return Promise.reject(y)
                }
                for (; c.length; )
                    s = s.then(c.shift(), c.shift());
                return s
            }
            ,
            h.prototype.getUri = function(t) {
                t = a(this.defaults, t);
                var e = c(t.baseURL, t.url);
                return i(e, t.params, t.paramsSerializer)
            }
            ,
            r.forEach(["delete", "get", "head", "options"], (function(t) {
                h.prototype[t] = function(e, n) {
                    return this.request(a(n || {}, {
                        method: t,
                        url: e,
                        data: (n || {}).data
                    }))
                }
            }
            )),
            r.forEach(["post", "put", "patch"], (function(t) {
                function e(e) {
                    return function(n, r, i) {
                        return this.request(a(i || {}, {
                            method: t,
                            headers: e ? {
                                "Content-Type": "multipart/form-data"
                            } : {},
                            url: n,
                            data: r
                        }))
                    }
                }
                h.prototype[t] = e(),
                h.prototype[t + "Form"] = e(!0)
            }
            )),
            t.exports = h
        }
        ,
        35158: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            function i(t, e, n, r, i) {
                Error.call(this),
                this.message = t,
                this.name = "AxiosError",
                e && (this.code = e),
                n && (this.config = n),
                r && (this.request = r),
                i && (this.response = i)
            }
            r.inherits(i, Error, {
                toJSON: function() {
                    return {
                        message: this.message,
                        name: this.name,
                        description: this.description,
                        number: this.number,
                        fileName: this.fileName,
                        lineNumber: this.lineNumber,
                        columnNumber: this.columnNumber,
                        stack: this.stack,
                        config: this.config,
                        code: this.code,
                        status: this.response && this.response.status ? this.response.status : null
                    }
                }
            });
            var s = i.prototype
              , o = {};
            ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED"].forEach((function(t) {
                o[t] = {
                    value: t
                }
            }
            )),
            Object.defineProperties(i, o),
            Object.defineProperty(s, "isAxiosError", {
                value: !0
            }),
            i.from = function(t, e, n, o, a, c) {
                var u = Object.create(s);
                return r.toFlatObject(t, u, (function(t) {
                    return t !== Error.prototype
                }
                )),
                i.call(u, t.message, e, n, o, a),
                u.name = t.name,
                c && Object.assign(u, c),
                u
            }
            ,
            t.exports = i
        }
        ,
        53889: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            function i() {
                this.handlers = []
            }
            i.prototype.use = function(t, e, n) {
                return this.handlers.push({
                    fulfilled: t,
                    rejected: e,
                    synchronous: !!n && n.synchronous,
                    runWhen: n ? n.runWhen : null
                }),
                this.handlers.length - 1
            }
            ,
            i.prototype.eject = function(t) {
                this.handlers[t] && (this.handlers[t] = null)
            }
            ,
            i.prototype.forEach = function(t) {
                r.forEach(this.handlers, (function(e) {
                    null !== e && t(e)
                }
                ))
            }
            ,
            t.exports = i
        }
        ,
        46870: (t,e,n)=>{
            "use strict";
            var r = n(79841)
              , i = n(96920);
            t.exports = function(t, e) {
                return t && !r(e) ? i(t, e) : e
            }
        }
        ,
        60659: (t,e,n)=>{
            "use strict";
            var r = n(69119)
              , i = n(12084)
              , s = n(69088)
              , o = n(86284)
              , a = n(46297);
            function c(t) {
                if (t.cancelToken && t.cancelToken.throwIfRequested(),
                t.signal && t.signal.aborted)
                    throw new a
            }
            t.exports = function(t) {
                return c(t),
                t.headers = t.headers || {},
                t.data = i.call(t, t.data, t.headers, t.transformRequest),
                t.headers = r.merge(t.headers.common || {}, t.headers[t.method] || {}, t.headers),
                r.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (function(e) {
                    delete t.headers[e]
                }
                )),
                (t.adapter || o.adapter)(t).then((function(e) {
                    return c(t),
                    e.data = i.call(t, e.data, e.headers, t.transformResponse),
                    e
                }
                ), (function(e) {
                    return s(e) || (c(t),
                    e && e.response && (e.response.data = i.call(t, e.response.data, e.response.headers, t.transformResponse))),
                    Promise.reject(e)
                }
                ))
            }
        }
        ,
        59936: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            t.exports = function(t, e) {
                e = e || {};
                var n = {};
                function i(t, e) {
                    return r.isPlainObject(t) && r.isPlainObject(e) ? r.merge(t, e) : r.isPlainObject(e) ? r.merge({}, e) : r.isArray(e) ? e.slice() : e
                }
                function s(n) {
                    return r.isUndefined(e[n]) ? r.isUndefined(t[n]) ? void 0 : i(void 0, t[n]) : i(t[n], e[n])
                }
                function o(t) {
                    if (!r.isUndefined(e[t]))
                        return i(void 0, e[t])
                }
                function a(n) {
                    return r.isUndefined(e[n]) ? r.isUndefined(t[n]) ? void 0 : i(void 0, t[n]) : i(void 0, e[n])
                }
                function c(n) {
                    return n in e ? i(t[n], e[n]) : n in t ? i(void 0, t[n]) : void 0
                }
                var u = {
                    url: o,
                    method: o,
                    data: o,
                    baseURL: a,
                    transformRequest: a,
                    transformResponse: a,
                    paramsSerializer: a,
                    timeout: a,
                    timeoutMessage: a,
                    withCredentials: a,
                    adapter: a,
                    responseType: a,
                    xsrfCookieName: a,
                    xsrfHeaderName: a,
                    onUploadProgress: a,
                    onDownloadProgress: a,
                    decompress: a,
                    maxContentLength: a,
                    maxBodyLength: a,
                    beforeRedirect: a,
                    transport: a,
                    httpAgent: a,
                    httpsAgent: a,
                    cancelToken: a,
                    socketPath: a,
                    responseEncoding: a,
                    validateStatus: c
                };
                return r.forEach(Object.keys(t).concat(Object.keys(e)), (function(t) {
                    var e = u[t] || s
                      , i = e(t);
                    r.isUndefined(i) && e !== c || (n[t] = i)
                }
                )),
                n
            }
        }
        ,
        70622: (t,e,n)=>{
            "use strict";
            var r = n(35158);
            t.exports = function(t, e, n) {
                var i = n.config.validateStatus;
                n.status && i && !i(n.status) ? e(new r("Request failed with status code " + n.status,[r.ERR_BAD_REQUEST, r.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],n.config,n.request,n)) : t(n)
            }
        }
        ,
        12084: (t,e,n)=>{
            "use strict";
            var r = n(69119)
              , i = n(86284);
            t.exports = function(t, e, n) {
                var s = this || i;
                return r.forEach(n, (function(n) {
                    t = n.call(s, t, e)
                }
                )),
                t
            }
        }
        ,
        86284: (t,e,n)=>{
            "use strict";
            var r = n(69119)
              , i = n(87397)
              , s = n(35158)
              , o = n(69846)
              , a = n(87008)
              , c = {
                "Content-Type": "application/x-www-form-urlencoded"
            };
            function u(t, e) {
                !r.isUndefined(t) && r.isUndefined(t["Content-Type"]) && (t["Content-Type"] = e)
            }
            var l = {
                transitional: o,
                adapter: function() {
                    var t;
                    return ("undefined" !== typeof XMLHttpRequest || "undefined" !== typeof process && "[object process]" === Object.prototype.toString.call(process)) && (t = n(20819)),
                    t
                }(),
                transformRequest: [function(t, e) {
                    if (i(e, "Accept"),
                    i(e, "Content-Type"),
                    r.isFormData(t) || r.isArrayBuffer(t) || r.isBuffer(t) || r.isStream(t) || r.isFile(t) || r.isBlob(t))
                        return t;
                    if (r.isArrayBufferView(t))
                        return t.buffer;
                    if (r.isURLSearchParams(t))
                        return u(e, "application/x-www-form-urlencoded;charset=utf-8"),
                        t.toString();
                    var n, s = r.isObject(t), o = e && e["Content-Type"];
                    if ((n = r.isFileList(t)) || s && "multipart/form-data" === o) {
                        var c = this.env && this.env.FormData;
                        return a(n ? {
                            "files[]": t
                        } : t, c && new c)
                    }
                    return s || "application/json" === o ? (u(e, "application/json"),
                    function(t, e, n) {
                        if (r.isString(t))
                            try {
                                return (e || JSON.parse)(t),
                                r.trim(t)
                            } catch (i) {
                                if ("SyntaxError" !== i.name)
                                    throw i
                            }
                        return (n || JSON.stringify)(t)
                    }(t)) : t
                }
                ],
                transformResponse: [function(t) {
                    var e = this.transitional || l.transitional
                      , n = e && e.silentJSONParsing
                      , i = e && e.forcedJSONParsing
                      , o = !n && "json" === this.responseType;
                    if (o || i && r.isString(t) && t.length)
                        try {
                            return JSON.parse(t)
                        } catch (a) {
                            if (o) {
                                if ("SyntaxError" === a.name)
                                    throw s.from(a, s.ERR_BAD_RESPONSE, this, null, this.response);
                                throw a
                            }
                        }
                    return t
                }
                ],
                timeout: 0,
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                maxContentLength: -1,
                maxBodyLength: -1,
                env: {
                    FormData: n(77232)
                },
                validateStatus: function(t) {
                    return t >= 200 && t < 300
                },
                headers: {
                    common: {
                        Accept: "application/json, text/plain, */*"
                    }
                }
            };
            r.forEach(["delete", "get", "head"], (function(t) {
                l.headers[t] = {}
            }
            )),
            r.forEach(["post", "put", "patch"], (function(t) {
                l.headers[t] = r.merge(c)
            }
            )),
            t.exports = l
        }
        ,
        69846: t=>{
            "use strict";
            t.exports = {
                silentJSONParsing: !0,
                forcedJSONParsing: !0,
                clarifyTimeoutError: !1
            }
        }
        ,
        71771: t=>{
            t.exports = {
                version: "0.27.2"
            }
        }
        ,
        45906: t=>{
            "use strict";
            t.exports = function(t, e) {
                return function() {
                    for (var n = new Array(arguments.length), r = 0; r < n.length; r++)
                        n[r] = arguments[r];
                    return t.apply(e, n)
                }
            }
        }
        ,
        42666: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            function i(t) {
                return encodeURIComponent(t).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
            }
            t.exports = function(t, e, n) {
                if (!e)
                    return t;
                var s;
                if (n)
                    s = n(e);
                else if (r.isURLSearchParams(e))
                    s = e.toString();
                else {
                    var o = [];
                    r.forEach(e, (function(t, e) {
                        null !== t && "undefined" !== typeof t && (r.isArray(t) ? e += "[]" : t = [t],
                        r.forEach(t, (function(t) {
                            r.isDate(t) ? t = t.toISOString() : r.isObject(t) && (t = JSON.stringify(t)),
                            o.push(i(e) + "=" + i(t))
                        }
                        )))
                    }
                    )),
                    s = o.join("&")
                }
                if (s) {
                    var a = t.indexOf("#");
                    -1 !== a && (t = t.slice(0, a)),
                    t += (-1 === t.indexOf("?") ? "?" : "&") + s
                }
                return t
            }
        }
        ,
        96920: t=>{
            "use strict";
            t.exports = function(t, e) {
                return e ? t.replace(/\/+$/, "") + "/" + e.replace(/^\/+/, "") : t
            }
        }
        ,
        90634: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            t.exports = r.isStandardBrowserEnv() ? {
                write: function(t, e, n, i, s, o) {
                    var a = [];
                    a.push(t + "=" + encodeURIComponent(e)),
                    r.isNumber(n) && a.push("expires=" + new Date(n).toGMTString()),
                    r.isString(i) && a.push("path=" + i),
                    r.isString(s) && a.push("domain=" + s),
                    !0 === o && a.push("secure"),
                    document.cookie = a.join("; ")
                },
                read: function(t) {
                    var e = document.cookie.match(new RegExp("(^|;\\s*)(" + t + ")=([^;]*)"));
                    return e ? decodeURIComponent(e[3]) : null
                },
                remove: function(t) {
                    this.write(t, "", Date.now() - 864e5)
                }
            } : {
                write: function() {},
                read: function() {
                    return null
                },
                remove: function() {}
            }
        }
        ,
        79841: t=>{
            "use strict";
            t.exports = function(t) {
                return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)
            }
        }
        ,
        31926: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            t.exports = function(t) {
                return r.isObject(t) && !0 === t.isAxiosError
            }
        }
        ,
        59327: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            t.exports = r.isStandardBrowserEnv() ? function() {
                var t, e = /(msie|trident)/i.test(navigator.userAgent), n = document.createElement("a");
                function i(t) {
                    var r = t;
                    return e && (n.setAttribute("href", r),
                    r = n.href),
                    n.setAttribute("href", r),
                    {
                        href: n.href,
                        protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
                        host: n.host,
                        search: n.search ? n.search.replace(/^\?/, "") : "",
                        hash: n.hash ? n.hash.replace(/^#/, "") : "",
                        hostname: n.hostname,
                        port: n.port,
                        pathname: "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname
                    }
                }
                return t = i(window.location.href),
                function(e) {
                    var n = r.isString(e) ? i(e) : e;
                    return n.protocol === t.protocol && n.host === t.host
                }
            }() : function() {
                return !0
            }
        }
        ,
        87397: (t,e,n)=>{
            "use strict";
            var r = n(69119);
            t.exports = function(t, e) {
                r.forEach(t, (function(n, r) {
                    r !== e && r.toUpperCase() === e.toUpperCase() && (t[e] = n,
                    delete t[r])
                }
                ))
            }
        }
        ,
        77232: t=>{
            t.exports = null
        }
        ,
        49745: (t,e,n)=>{
            "use strict";
            var r = n(69119)
              , i = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
            t.exports = function(t) {
                var e, n, s, o = {};
                return t ? (r.forEach(t.split("\n"), (function(t) {
                    if (s = t.indexOf(":"),
                    e = r.trim(t.substr(0, s)).toLowerCase(),
                    n = r.trim(t.substr(s + 1)),
                    e) {
                        if (o[e] && i.indexOf(e) >= 0)
                            return;
                        o[e] = "set-cookie" === e ? (o[e] ? o[e] : []).concat([n]) : o[e] ? o[e] + ", " + n : n
                    }
                }
                )),
                o) : o
            }
        }
        ,
        8277: t=>{
            "use strict";
            t.exports = function(t) {
                var e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(t);
                return e && e[1] || ""
            }
        }
        ,
        1228: t=>{
            "use strict";
            t.exports = function(t) {
                return function(e) {
                    return t.apply(null, e)
                }
            }
        }
        ,
        87008: (t,e,n)=>{
            "use strict";
            var r = n(82140).Buffer
              , i = n(69119);
            t.exports = function(t, e) {
                e = e || new FormData;
                var n = [];
                function s(t) {
                    return null === t ? "" : i.isDate(t) ? t.toISOString() : i.isArrayBuffer(t) || i.isTypedArray(t) ? "function" === typeof Blob ? new Blob([t]) : r.from(t) : t
                }
                return function t(r, o) {
                    if (i.isPlainObject(r) || i.isArray(r)) {
                        if (-1 !== n.indexOf(r))
                            throw Error("Circular reference detected in " + o);
                        n.push(r),
                        i.forEach(r, (function(n, r) {
                            if (!i.isUndefined(n)) {
                                var a, c = o ? o + "." + r : r;
                                if (n && !o && "object" === typeof n)
                                    if (i.endsWith(r, "{}"))
                                        n = JSON.stringify(n);
                                    else if (i.endsWith(r, "[]") && (a = i.toArray(n)))
                                        return void a.forEach((function(t) {
                                            !i.isUndefined(t) && e.append(c, s(t))
                                        }
                                        ));
                                t(n, c)
                            }
                        }
                        )),
                        n.pop()
                    } else
                        e.append(o, s(r))
                }(t),
                e
            }
        }
        ,
        42299: (t,e,n)=>{
            "use strict";
            var r = n(71771).version
              , i = n(35158)
              , s = {};
            ["object", "boolean", "number", "function", "string", "symbol"].forEach((function(t, e) {
                s[t] = function(n) {
                    return typeof n === t || "a" + (e < 1 ? "n " : " ") + t
                }
            }
            ));
            var o = {};
            s.transitional = function(t, e, n) {
                function s(t, e) {
                    return "[Axios v" + r + "] Transitional option '" + t + "'" + e + (n ? ". " + n : "")
                }
                return function(n, r, a) {
                    if (!1 === t)
                        throw new i(s(r, " has been removed" + (e ? " in " + e : "")),i.ERR_DEPRECATED);
                    return e && !o[r] && (o[r] = !0,
                    console.warn(s(r, " has been deprecated since v" + e + " and will be removed in the near future"))),
                    !t || t(n, r, a)
                }
            }
            ,
            t.exports = {
                assertOptions: function(t, e, n) {
                    if ("object" !== typeof t)
                        throw new i("options must be an object",i.ERR_BAD_OPTION_VALUE);
                    for (var r = Object.keys(t), s = r.length; s-- > 0; ) {
                        var o = r[s]
                          , a = e[o];
                        if (a) {
                            var c = t[o]
                              , u = void 0 === c || a(c, o, t);
                            if (!0 !== u)
                                throw new i("option " + o + " must be " + u,i.ERR_BAD_OPTION_VALUE)
                        } else if (!0 !== n)
                            throw new i("Unknown option " + o,i.ERR_BAD_OPTION)
                    }
                },
                validators: s
            }
        }
        ,
        69119: (t,e,n)=>{
            "use strict";
            var r, i = n(45906), s = Object.prototype.toString, o = (r = Object.create(null),
            function(t) {
                var e = s.call(t);
                return r[e] || (r[e] = e.slice(8, -1).toLowerCase())
            }
            );
            function a(t) {
                return t = t.toLowerCase(),
                function(e) {
                    return o(e) === t
                }
            }
            function c(t) {
                return Array.isArray(t)
            }
            function u(t) {
                return "undefined" === typeof t
            }
            var l = a("ArrayBuffer");
            function h(t) {
                return null !== t && "object" === typeof t
            }
            function d(t) {
                if ("object" !== o(t))
                    return !1;
                var e = Object.getPrototypeOf(t);
                return null === e || e === Object.prototype
            }
            var f = a("Date")
              , p = a("File")
              , y = a("Blob")
              , g = a("FileList");
            function w(t) {
                return "[object Function]" === s.call(t)
            }
            var b = a("URLSearchParams");
            function _(t, e) {
                if (null !== t && "undefined" !== typeof t)
                    if ("object" !== typeof t && (t = [t]),
                    c(t))
                        for (var n = 0, r = t.length; n < r; n++)
                            e.call(null, t[n], n, t);
                    else
                        for (var i in t)
                            Object.prototype.hasOwnProperty.call(t, i) && e.call(null, t[i], i, t)
            }
            var v, m = (v = "undefined" !== typeof Uint8Array && Object.getPrototypeOf(Uint8Array),
            function(t) {
                return v && t instanceof v
            }
            );
            t.exports = {
                isArray: c,
                isArrayBuffer: l,
                isBuffer: function(t) {
                    return null !== t && !u(t) && null !== t.constructor && !u(t.constructor) && "function" === typeof t.constructor.isBuffer && t.constructor.isBuffer(t)
                },
                isFormData: function(t) {
                    var e = "[object FormData]";
                    return t && ("function" === typeof FormData && t instanceof FormData || s.call(t) === e || w(t.toString) && t.toString() === e)
                },
                isArrayBufferView: function(t) {
                    return "undefined" !== typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(t) : t && t.buffer && l(t.buffer)
                },
                isString: function(t) {
                    return "string" === typeof t
                },
                isNumber: function(t) {
                    return "number" === typeof t
                },
                isObject: h,
                isPlainObject: d,
                isUndefined: u,
                isDate: f,
                isFile: p,
                isBlob: y,
                isFunction: w,
                isStream: function(t) {
                    return h(t) && w(t.pipe)
                },
                isURLSearchParams: b,
                isStandardBrowserEnv: function() {
                    return ("undefined" === typeof navigator || "ReactNative" !== navigator.product && "NativeScript" !== navigator.product && "NS" !== navigator.product) && ("undefined" !== typeof window && "undefined" !== typeof document)
                },
                forEach: _,
                merge: function t() {
                    var e = {};
                    function n(n, r) {
                        d(e[r]) && d(n) ? e[r] = t(e[r], n) : d(n) ? e[r] = t({}, n) : c(n) ? e[r] = n.slice() : e[r] = n
                    }
                    for (var r = 0, i = arguments.length; r < i; r++)
                        _(arguments[r], n);
                    return e
                },
                extend: function(t, e, n) {
                    return _(e, (function(e, r) {
                        t[r] = n && "function" === typeof e ? i(e, n) : e
                    }
                    )),
                    t
                },
                trim: function(t) {
                    return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")
                },
                stripBOM: function(t) {
                    return 65279 === t.charCodeAt(0) && (t = t.slice(1)),
                    t
                },
                inherits: function(t, e, n, r) {
                    t.prototype = Object.create(e.prototype, r),
                    t.prototype.constructor = t,
                    n && Object.assign(t.prototype, n)
                },
                toFlatObject: function(t, e, n) {
                    var r, i, s, o = {};
                    e = e || {};
                    do {
                        for (i = (r = Object.getOwnPropertyNames(t)).length; i-- > 0; )
                            o[s = r[i]] || (e[s] = t[s],
                            o[s] = !0);
                        t = Object.getPrototypeOf(t)
                    } while (t && (!n || n(t, e)) && t !== Object.prototype);
                    return e
                },
                kindOf: o,
                kindOfTest: a,
                endsWith: function(t, e, n) {
                    t = String(t),
                    (void 0 === n || n > t.length) && (n = t.length),
                    n -= e.length;
                    var r = t.indexOf(e, n);
                    return -1 !== r && r === n
                },
                toArray: function(t) {
                    if (!t)
                        return null;
                    var e = t.length;
                    if (u(e))
                        return null;
                    for (var n = new Array(e); e-- > 0; )
                        n[e] = t[e];
                    return n
                },
                isTypedArray: m,
                isFileList: g
            }
        }
        ,
        82558: (t,e)=>{
            "use strict";
            e.byteLength = function(t) {
                var e = a(t)
                  , n = e[0]
                  , r = e[1];
                return 3 * (n + r) / 4 - r
            }
            ,
            e.toByteArray = function(t) {
                var e, n, s = a(t), o = s[0], c = s[1], u = new i(function(t, e, n) {
                    return 3 * (e + n) / 4 - n
                }(0, o, c)), l = 0, h = c > 0 ? o - 4 : o;
                for (n = 0; n < h; n += 4)
                    e = r[t.charCodeAt(n)] << 18 | r[t.charCodeAt(n + 1)] << 12 | r[t.charCodeAt(n + 2)] << 6 | r[t.charCodeAt(n + 3)],
                    u[l++] = e >> 16 & 255,
                    u[l++] = e >> 8 & 255,
                    u[l++] = 255 & e;
                2 === c && (e = r[t.charCodeAt(n)] << 2 | r[t.charCodeAt(n + 1)] >> 4,
                u[l++] = 255 & e);
                1 === c && (e = r[t.charCodeAt(n)] << 10 | r[t.charCodeAt(n + 1)] << 4 | r[t.charCodeAt(n + 2)] >> 2,
                u[l++] = e >> 8 & 255,
                u[l++] = 255 & e);
                return u
            }
            ,
            e.fromByteArray = function(t) {
                for (var e, r = t.length, i = r % 3, s = [], o = 16383, a = 0, u = r - i; a < u; a += o)
                    s.push(c(t, a, a + o > u ? u : a + o));
                1 === i ? (e = t[r - 1],
                s.push(n[e >> 2] + n[e << 4 & 63] + "==")) : 2 === i && (e = (t[r - 2] << 8) + t[r - 1],
                s.push(n[e >> 10] + n[e >> 4 & 63] + n[e << 2 & 63] + "="));
                return s.join("")
            }
            ;
            for (var n = [], r = [], i = "undefined" !== typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0; o < 64; ++o)
                n[o] = s[o],
                r[s.charCodeAt(o)] = o;
            function a(t) {
                var e = t.length;
                if (e % 4 > 0)
                    throw new Error("Invalid string. Length must be a multiple of 4");
                var n = t.indexOf("=");
                return -1 === n && (n = e),
                [n, n === e ? 0 : 4 - n % 4]
            }
            function c(t, e, r) {
                for (var i, s, o = [], a = e; a < r; a += 3)
                    i = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (255 & t[a + 2]),
                    o.push(n[(s = i) >> 18 & 63] + n[s >> 12 & 63] + n[s >> 6 & 63] + n[63 & s]);
                return o.join("")
            }
            r["-".charCodeAt(0)] = 62,
            r["_".charCodeAt(0)] = 63
        }
        ,
        82140: (t,e,n)=>{
            "use strict";
            const r = n(82558)
              , i = n(7013)
              , s = "function" === typeof Symbol && "function" === typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
            e.Buffer = c,
            e.INSPECT_MAX_BYTES = 50;
            const o = 2147483647;
            function a(t) {
                if (t > o)
                    throw new RangeError('The value "' + t + '" is invalid for option "size"');
                const e = new Uint8Array(t);
                return Object.setPrototypeOf(e, c.prototype),
                e
            }
            function c(t, e, n) {
                if ("number" === typeof t) {
                    if ("string" === typeof e)
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    return h(t)
                }
                return u(t, e, n)
            }
            function u(t, e, n) {
                if ("string" === typeof t)
                    return function(t, e) {
                        "string" === typeof e && "" !== e || (e = "utf8");
                        if (!c.isEncoding(e))
                            throw new TypeError("Unknown encoding: " + e);
                        const n = 0 | y(t, e);
                        let r = a(n);
                        const i = r.write(t, e);
                        i !== n && (r = r.slice(0, i));
                        return r
                    }(t, e);
                if (ArrayBuffer.isView(t))
                    return function(t) {
                        if (Y(t, Uint8Array)) {
                            const e = new Uint8Array(t);
                            return f(e.buffer, e.byteOffset, e.byteLength)
                        }
                        return d(t)
                    }(t);
                if (null == t)
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
                if (Y(t, ArrayBuffer) || t && Y(t.buffer, ArrayBuffer))
                    return f(t, e, n);
                if ("undefined" !== typeof SharedArrayBuffer && (Y(t, SharedArrayBuffer) || t && Y(t.buffer, SharedArrayBuffer)))
                    return f(t, e, n);
                if ("number" === typeof t)
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                const r = t.valueOf && t.valueOf();
                if (null != r && r !== t)
                    return c.from(r, e, n);
                const i = function(t) {
                    if (c.isBuffer(t)) {
                        const e = 0 | p(t.length)
                          , n = a(e);
                        return 0 === n.length || t.copy(n, 0, 0, e),
                        n
                    }
                    if (void 0 !== t.length)
                        return "number" !== typeof t.length || J(t.length) ? a(0) : d(t);
                    if ("Buffer" === t.type && Array.isArray(t.data))
                        return d(t.data)
                }(t);
                if (i)
                    return i;
                if ("undefined" !== typeof Symbol && null != Symbol.toPrimitive && "function" === typeof t[Symbol.toPrimitive])
                    return c.from(t[Symbol.toPrimitive]("string"), e, n);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t)
            }
            function l(t) {
                if ("number" !== typeof t)
                    throw new TypeError('"size" argument must be of type number');
                if (t < 0)
                    throw new RangeError('The value "' + t + '" is invalid for option "size"')
            }
            function h(t) {
                return l(t),
                a(t < 0 ? 0 : 0 | p(t))
            }
            function d(t) {
                const e = t.length < 0 ? 0 : 0 | p(t.length)
                  , n = a(e);
                for (let r = 0; r < e; r += 1)
                    n[r] = 255 & t[r];
                return n
            }
            function f(t, e, n) {
                if (e < 0 || t.byteLength < e)
                    throw new RangeError('"offset" is outside of buffer bounds');
                if (t.byteLength < e + (n || 0))
                    throw new RangeError('"length" is outside of buffer bounds');
                let r;
                return r = void 0 === e && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t,e) : new Uint8Array(t,e,n),
                Object.setPrototypeOf(r, c.prototype),
                r
            }
            function p(t) {
                if (t >= o)
                    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o.toString(16) + " bytes");
                return 0 | t
            }
            function y(t, e) {
                if (c.isBuffer(t))
                    return t.length;
                if (ArrayBuffer.isView(t) || Y(t, ArrayBuffer))
                    return t.byteLength;
                if ("string" !== typeof t)
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t);
                const n = t.length
                  , r = arguments.length > 2 && !0 === arguments[2];
                if (!r && 0 === n)
                    return 0;
                let i = !1;
                for (; ; )
                    switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return n;
                    case "utf8":
                    case "utf-8":
                        return K(t).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * n;
                    case "hex":
                        return n >>> 1;
                    case "base64":
                        return V(t).length;
                    default:
                        if (i)
                            return r ? -1 : K(t).length;
                        e = ("" + e).toLowerCase(),
                        i = !0
                    }
            }
            function g(t, e, n) {
                let r = !1;
                if ((void 0 === e || e < 0) && (e = 0),
                e > this.length)
                    return "";
                if ((void 0 === n || n > this.length) && (n = this.length),
                n <= 0)
                    return "";
                if ((n >>>= 0) <= (e >>>= 0))
                    return "";
                for (t || (t = "utf8"); ; )
                    switch (t) {
                    case "hex":
                        return k(this, e, n);
                    case "utf8":
                    case "utf-8":
                        return B(this, e, n);
                    case "ascii":
                        return S(this, e, n);
                    case "latin1":
                    case "binary":
                        return z(this, e, n);
                    case "base64":
                        return U(this, e, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return I(this, e, n);
                    default:
                        if (r)
                            throw new TypeError("Unknown encoding: " + t);
                        t = (t + "").toLowerCase(),
                        r = !0
                    }
            }
            function w(t, e, n) {
                const r = t[e];
                t[e] = t[n],
                t[n] = r
            }
            function b(t, e, n, r, i) {
                if (0 === t.length)
                    return -1;
                if ("string" === typeof n ? (r = n,
                n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648),
                J(n = +n) && (n = i ? 0 : t.length - 1),
                n < 0 && (n = t.length + n),
                n >= t.length) {
                    if (i)
                        return -1;
                    n = t.length - 1
                } else if (n < 0) {
                    if (!i)
                        return -1;
                    n = 0
                }
                if ("string" === typeof e && (e = c.from(e, r)),
                c.isBuffer(e))
                    return 0 === e.length ? -1 : _(t, e, n, r, i);
                if ("number" === typeof e)
                    return e &= 255,
                    "function" === typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : _(t, [e], n, r, i);
                throw new TypeError("val must be string, number or Buffer")
            }
            function _(t, e, n, r, i) {
                let s, o = 1, a = t.length, c = e.length;
                if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
                    if (t.length < 2 || e.length < 2)
                        return -1;
                    o = 2,
                    a /= 2,
                    c /= 2,
                    n /= 2
                }
                function u(t, e) {
                    return 1 === o ? t[e] : t.readUInt16BE(e * o)
                }
                if (i) {
                    let r = -1;
                    for (s = n; s < a; s++)
                        if (u(t, s) === u(e, -1 === r ? 0 : s - r)) {
                            if (-1 === r && (r = s),
                            s - r + 1 === c)
                                return r * o
                        } else
                            -1 !== r && (s -= s - r),
                            r = -1
                } else
                    for (n + c > a && (n = a - c),
                    s = n; s >= 0; s--) {
                        let n = !0;
                        for (let r = 0; r < c; r++)
                            if (u(t, s + r) !== u(e, r)) {
                                n = !1;
                                break
                            }
                        if (n)
                            return s
                    }
                return -1
            }
            function v(t, e, n, r) {
                n = Number(n) || 0;
                const i = t.length - n;
                r ? (r = Number(r)) > i && (r = i) : r = i;
                const s = e.length;
                let o;
                for (r > s / 2 && (r = s / 2),
                o = 0; o < r; ++o) {
                    const r = parseInt(e.substr(2 * o, 2), 16);
                    if (J(r))
                        return o;
                    t[n + o] = r
                }
                return o
            }
            function m(t, e, n, r) {
                return W(K(e, t.length - n), t, n, r)
            }
            function A(t, e, n, r) {
                return W(function(t) {
                    const e = [];
                    for (let n = 0; n < t.length; ++n)
                        e.push(255 & t.charCodeAt(n));
                    return e
                }(e), t, n, r)
            }
            function E(t, e, n, r) {
                return W(V(e), t, n, r)
            }
            function x(t, e, n, r) {
                return W(function(t, e) {
                    let n, r, i;
                    const s = [];
                    for (let o = 0; o < t.length && !((e -= 2) < 0); ++o)
                        n = t.charCodeAt(o),
                        r = n >> 8,
                        i = n % 256,
                        s.push(i),
                        s.push(r);
                    return s
                }(e, t.length - n), t, n, r)
            }
            function U(t, e, n) {
                return 0 === e && n === t.length ? r.fromByteArray(t) : r.fromByteArray(t.slice(e, n))
            }
            function B(t, e, n) {
                n = Math.min(t.length, n);
                const r = [];
                let i = e;
                for (; i < n; ) {
                    const e = t[i];
                    let s = null
                      , o = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
                    if (i + o <= n) {
                        let n, r, a, c;
                        switch (o) {
                        case 1:
                            e < 128 && (s = e);
                            break;
                        case 2:
                            n = t[i + 1],
                            128 === (192 & n) && (c = (31 & e) << 6 | 63 & n,
                            c > 127 && (s = c));
                            break;
                        case 3:
                            n = t[i + 1],
                            r = t[i + 2],
                            128 === (192 & n) && 128 === (192 & r) && (c = (15 & e) << 12 | (63 & n) << 6 | 63 & r,
                            c > 2047 && (c < 55296 || c > 57343) && (s = c));
                            break;
                        case 4:
                            n = t[i + 1],
                            r = t[i + 2],
                            a = t[i + 3],
                            128 === (192 & n) && 128 === (192 & r) && 128 === (192 & a) && (c = (15 & e) << 18 | (63 & n) << 12 | (63 & r) << 6 | 63 & a,
                            c > 65535 && c < 1114112 && (s = c))
                        }
                    }
                    null === s ? (s = 65533,
                    o = 1) : s > 65535 && (s -= 65536,
                    r.push(s >>> 10 & 1023 | 55296),
                    s = 56320 | 1023 & s),
                    r.push(s),
                    i += o
                }
                return function(t) {
                    const e = t.length;
                    if (e <= T)
                        return String.fromCharCode.apply(String, t);
                    let n = ""
                      , r = 0;
                    for (; r < e; )
                        n += String.fromCharCode.apply(String, t.slice(r, r += T));
                    return n
                }(r)
            }
            c.TYPED_ARRAY_SUPPORT = function() {
                try {
                    const t = new Uint8Array(1)
                      , e = {
                        foo: function() {
                            return 42
                        }
                    };
                    return Object.setPrototypeOf(e, Uint8Array.prototype),
                    Object.setPrototypeOf(t, e),
                    42 === t.foo()
                } catch (t) {
                    return !1
                }
            }(),
            c.TYPED_ARRAY_SUPPORT || "undefined" === typeof console || "function" !== typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
            Object.defineProperty(c.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this))
                        return this.buffer
                }
            }),
            Object.defineProperty(c.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this))
                        return this.byteOffset
                }
            }),
            c.poolSize = 8192,
            c.from = function(t, e, n) {
                return u(t, e, n)
            }
            ,
            Object.setPrototypeOf(c.prototype, Uint8Array.prototype),
            Object.setPrototypeOf(c, Uint8Array),
            c.alloc = function(t, e, n) {
                return function(t, e, n) {
                    return l(t),
                    t <= 0 ? a(t) : void 0 !== e ? "string" === typeof n ? a(t).fill(e, n) : a(t).fill(e) : a(t)
                }(t, e, n)
            }
            ,
            c.allocUnsafe = function(t) {
                return h(t)
            }
            ,
            c.allocUnsafeSlow = function(t) {
                return h(t)
            }
            ,
            c.isBuffer = function(t) {
                return null != t && !0 === t._isBuffer && t !== c.prototype
            }
            ,
            c.compare = function(t, e) {
                if (Y(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)),
                Y(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)),
                !c.isBuffer(t) || !c.isBuffer(e))
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (t === e)
                    return 0;
                let n = t.length
                  , r = e.length;
                for (let i = 0, s = Math.min(n, r); i < s; ++i)
                    if (t[i] !== e[i]) {
                        n = t[i],
                        r = e[i];
                        break
                    }
                return n < r ? -1 : r < n ? 1 : 0
            }
            ,
            c.isEncoding = function(t) {
                switch (String(t).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1
                }
            }
            ,
            c.concat = function(t, e) {
                if (!Array.isArray(t))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === t.length)
                    return c.alloc(0);
                let n;
                if (void 0 === e)
                    for (e = 0,
                    n = 0; n < t.length; ++n)
                        e += t[n].length;
                const r = c.allocUnsafe(e);
                let i = 0;
                for (n = 0; n < t.length; ++n) {
                    let e = t[n];
                    if (Y(e, Uint8Array))
                        i + e.length > r.length ? (c.isBuffer(e) || (e = c.from(e)),
                        e.copy(r, i)) : Uint8Array.prototype.set.call(r, e, i);
                    else {
                        if (!c.isBuffer(e))
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        e.copy(r, i)
                    }
                    i += e.length
                }
                return r
            }
            ,
            c.byteLength = y,
            c.prototype._isBuffer = !0,
            c.prototype.swap16 = function() {
                const t = this.length;
                if (t % 2 !== 0)
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (let e = 0; e < t; e += 2)
                    w(this, e, e + 1);
                return this
            }
            ,
            c.prototype.swap32 = function() {
                const t = this.length;
                if (t % 4 !== 0)
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (let e = 0; e < t; e += 4)
                    w(this, e, e + 3),
                    w(this, e + 1, e + 2);
                return this
            }
            ,
            c.prototype.swap64 = function() {
                const t = this.length;
                if (t % 8 !== 0)
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (let e = 0; e < t; e += 8)
                    w(this, e, e + 7),
                    w(this, e + 1, e + 6),
                    w(this, e + 2, e + 5),
                    w(this, e + 3, e + 4);
                return this
            }
            ,
            c.prototype.toString = function() {
                const t = this.length;
                return 0 === t ? "" : 0 === arguments.length ? B(this, 0, t) : g.apply(this, arguments)
            }
            ,
            c.prototype.toLocaleString = c.prototype.toString,
            c.prototype.equals = function(t) {
                if (!c.isBuffer(t))
                    throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === c.compare(this, t)
            }
            ,
            c.prototype.inspect = function() {
                let t = "";
                const n = e.INSPECT_MAX_BYTES;
                return t = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(),
                this.length > n && (t += " ... "),
                "<Buffer " + t + ">"
            }
            ,
            s && (c.prototype[s] = c.prototype.inspect),
            c.prototype.compare = function(t, e, n, r, i) {
                if (Y(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)),
                !c.isBuffer(t))
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t);
                if (void 0 === e && (e = 0),
                void 0 === n && (n = t ? t.length : 0),
                void 0 === r && (r = 0),
                void 0 === i && (i = this.length),
                e < 0 || n > t.length || r < 0 || i > this.length)
                    throw new RangeError("out of range index");
                if (r >= i && e >= n)
                    return 0;
                if (r >= i)
                    return -1;
                if (e >= n)
                    return 1;
                if (this === t)
                    return 0;
                let s = (i >>>= 0) - (r >>>= 0)
                  , o = (n >>>= 0) - (e >>>= 0);
                const a = Math.min(s, o)
                  , u = this.slice(r, i)
                  , l = t.slice(e, n);
                for (let c = 0; c < a; ++c)
                    if (u[c] !== l[c]) {
                        s = u[c],
                        o = l[c];
                        break
                    }
                return s < o ? -1 : o < s ? 1 : 0
            }
            ,
            c.prototype.includes = function(t, e, n) {
                return -1 !== this.indexOf(t, e, n)
            }
            ,
            c.prototype.indexOf = function(t, e, n) {
                return b(this, t, e, n, !0)
            }
            ,
            c.prototype.lastIndexOf = function(t, e, n) {
                return b(this, t, e, n, !1)
            }
            ,
            c.prototype.write = function(t, e, n, r) {
                if (void 0 === e)
                    r = "utf8",
                    n = this.length,
                    e = 0;
                else if (void 0 === n && "string" === typeof e)
                    r = e,
                    n = this.length,
                    e = 0;
                else {
                    if (!isFinite(e))
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    e >>>= 0,
                    isFinite(n) ? (n >>>= 0,
                    void 0 === r && (r = "utf8")) : (r = n,
                    n = void 0)
                }
                const i = this.length - e;
                if ((void 0 === n || n > i) && (n = i),
                t.length > 0 && (n < 0 || e < 0) || e > this.length)
                    throw new RangeError("Attempt to write outside buffer bounds");
                r || (r = "utf8");
                let s = !1;
                for (; ; )
                    switch (r) {
                    case "hex":
                        return v(this, t, e, n);
                    case "utf8":
                    case "utf-8":
                        return m(this, t, e, n);
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return A(this, t, e, n);
                    case "base64":
                        return E(this, t, e, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return x(this, t, e, n);
                    default:
                        if (s)
                            throw new TypeError("Unknown encoding: " + r);
                        r = ("" + r).toLowerCase(),
                        s = !0
                    }
            }
            ,
            c.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }
            ;
            const T = 4096;
            function S(t, e, n) {
                let r = "";
                n = Math.min(t.length, n);
                for (let i = e; i < n; ++i)
                    r += String.fromCharCode(127 & t[i]);
                return r
            }
            function z(t, e, n) {
                let r = "";
                n = Math.min(t.length, n);
                for (let i = e; i < n; ++i)
                    r += String.fromCharCode(t[i]);
                return r
            }
            function k(t, e, n) {
                const r = t.length;
                (!e || e < 0) && (e = 0),
                (!n || n < 0 || n > r) && (n = r);
                let i = "";
                for (let s = e; s < n; ++s)
                    i += X[t[s]];
                return i
            }
            function I(t, e, n) {
                const r = t.slice(e, n);
                let i = "";
                for (let s = 0; s < r.length - 1; s += 2)
                    i += String.fromCharCode(r[s] + 256 * r[s + 1]);
                return i
            }
            function L(t, e, n) {
                if (t % 1 !== 0 || t < 0)
                    throw new RangeError("offset is not uint");
                if (t + e > n)
                    throw new RangeError("Trying to access beyond buffer length")
            }
            function C(t, e, n, r, i, s) {
                if (!c.isBuffer(t))
                    throw new TypeError('"buffer" argument must be a Buffer instance');
                if (e > i || e < s)
                    throw new RangeError('"value" argument is out of bounds');
                if (n + r > t.length)
                    throw new RangeError("Index out of range")
            }
            function O(t, e, n, r, i) {
                q(e, r, i, t, n, 7);
                let s = Number(e & BigInt(4294967295));
                t[n++] = s,
                s >>= 8,
                t[n++] = s,
                s >>= 8,
                t[n++] = s,
                s >>= 8,
                t[n++] = s;
                let o = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[n++] = o,
                o >>= 8,
                t[n++] = o,
                o >>= 8,
                t[n++] = o,
                o >>= 8,
                t[n++] = o,
                n
            }
            function R(t, e, n, r, i) {
                q(e, r, i, t, n, 7);
                let s = Number(e & BigInt(4294967295));
                t[n + 7] = s,
                s >>= 8,
                t[n + 6] = s,
                s >>= 8,
                t[n + 5] = s,
                s >>= 8,
                t[n + 4] = s;
                let o = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[n + 3] = o,
                o >>= 8,
                t[n + 2] = o,
                o >>= 8,
                t[n + 1] = o,
                o >>= 8,
                t[n] = o,
                n + 8
            }
            function N(t, e, n, r, i, s) {
                if (n + r > t.length)
                    throw new RangeError("Index out of range");
                if (n < 0)
                    throw new RangeError("Index out of range")
            }
            function H(t, e, n, r, s) {
                return e = +e,
                n >>>= 0,
                s || N(t, 0, n, 4),
                i.write(t, e, n, r, 23, 4),
                n + 4
            }
            function D(t, e, n, r, s) {
                return e = +e,
                n >>>= 0,
                s || N(t, 0, n, 8),
                i.write(t, e, n, r, 52, 8),
                n + 8
            }
            c.prototype.slice = function(t, e) {
                const n = this.length;
                (t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
                (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
                e < t && (e = t);
                const r = this.subarray(t, e);
                return Object.setPrototypeOf(r, c.prototype),
                r
            }
            ,
            c.prototype.readUintLE = c.prototype.readUIntLE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || L(t, e, this.length);
                let r = this[t]
                  , i = 1
                  , s = 0;
                for (; ++s < e && (i *= 256); )
                    r += this[t + s] * i;
                return r
            }
            ,
            c.prototype.readUintBE = c.prototype.readUIntBE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || L(t, e, this.length);
                let r = this[t + --e]
                  , i = 1;
                for (; e > 0 && (i *= 256); )
                    r += this[t + --e] * i;
                return r
            }
            ,
            c.prototype.readUint8 = c.prototype.readUInt8 = function(t, e) {
                return t >>>= 0,
                e || L(t, 1, this.length),
                this[t]
            }
            ,
            c.prototype.readUint16LE = c.prototype.readUInt16LE = function(t, e) {
                return t >>>= 0,
                e || L(t, 2, this.length),
                this[t] | this[t + 1] << 8
            }
            ,
            c.prototype.readUint16BE = c.prototype.readUInt16BE = function(t, e) {
                return t >>>= 0,
                e || L(t, 2, this.length),
                this[t] << 8 | this[t + 1]
            }
            ,
            c.prototype.readUint32LE = c.prototype.readUInt32LE = function(t, e) {
                return t >>>= 0,
                e || L(t, 4, this.length),
                (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            }
            ,
            c.prototype.readUint32BE = c.prototype.readUInt32BE = function(t, e) {
                return t >>>= 0,
                e || L(t, 4, this.length),
                16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            }
            ,
            c.prototype.readBigUInt64LE = Z((function(t) {
                j(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24
                  , i = this[++t] + 256 * this[++t] + 65536 * this[++t] + n * 2 ** 24;
                return BigInt(r) + (BigInt(i) << BigInt(32))
            }
            )),
            c.prototype.readBigUInt64BE = Z((function(t) {
                j(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = e * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + this[++t]
                  , i = this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n;
                return (BigInt(r) << BigInt(32)) + BigInt(i)
            }
            )),
            c.prototype.readIntLE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || L(t, e, this.length);
                let r = this[t]
                  , i = 1
                  , s = 0;
                for (; ++s < e && (i *= 256); )
                    r += this[t + s] * i;
                return i *= 128,
                r >= i && (r -= Math.pow(2, 8 * e)),
                r
            }
            ,
            c.prototype.readIntBE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || L(t, e, this.length);
                let r = e
                  , i = 1
                  , s = this[t + --r];
                for (; r > 0 && (i *= 256); )
                    s += this[t + --r] * i;
                return i *= 128,
                s >= i && (s -= Math.pow(2, 8 * e)),
                s
            }
            ,
            c.prototype.readInt8 = function(t, e) {
                return t >>>= 0,
                e || L(t, 1, this.length),
                128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            }
            ,
            c.prototype.readInt16LE = function(t, e) {
                t >>>= 0,
                e || L(t, 2, this.length);
                const n = this[t] | this[t + 1] << 8;
                return 32768 & n ? 4294901760 | n : n
            }
            ,
            c.prototype.readInt16BE = function(t, e) {
                t >>>= 0,
                e || L(t, 2, this.length);
                const n = this[t + 1] | this[t] << 8;
                return 32768 & n ? 4294901760 | n : n
            }
            ,
            c.prototype.readInt32LE = function(t, e) {
                return t >>>= 0,
                e || L(t, 4, this.length),
                this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            }
            ,
            c.prototype.readInt32BE = function(t, e) {
                return t >>>= 0,
                e || L(t, 4, this.length),
                this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            }
            ,
            c.prototype.readBigInt64LE = Z((function(t) {
                j(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (n << 24);
                return (BigInt(r) << BigInt(32)) + BigInt(e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24)
            }
            )),
            c.prototype.readBigInt64BE = Z((function(t) {
                j(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || $(t, this.length - 8);
                const r = (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];
                return (BigInt(r) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n)
            }
            )),
            c.prototype.readFloatLE = function(t, e) {
                return t >>>= 0,
                e || L(t, 4, this.length),
                i.read(this, t, !0, 23, 4)
            }
            ,
            c.prototype.readFloatBE = function(t, e) {
                return t >>>= 0,
                e || L(t, 4, this.length),
                i.read(this, t, !1, 23, 4)
            }
            ,
            c.prototype.readDoubleLE = function(t, e) {
                return t >>>= 0,
                e || L(t, 8, this.length),
                i.read(this, t, !0, 52, 8)
            }
            ,
            c.prototype.readDoubleBE = function(t, e) {
                return t >>>= 0,
                e || L(t, 8, this.length),
                i.read(this, t, !1, 52, 8)
            }
            ,
            c.prototype.writeUintLE = c.prototype.writeUIntLE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                n >>>= 0,
                !r) {
                    C(this, t, e, n, Math.pow(2, 8 * n) - 1, 0)
                }
                let i = 1
                  , s = 0;
                for (this[e] = 255 & t; ++s < n && (i *= 256); )
                    this[e + s] = t / i & 255;
                return e + n
            }
            ,
            c.prototype.writeUintBE = c.prototype.writeUIntBE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                n >>>= 0,
                !r) {
                    C(this, t, e, n, Math.pow(2, 8 * n) - 1, 0)
                }
                let i = n - 1
                  , s = 1;
                for (this[e + i] = 255 & t; --i >= 0 && (s *= 256); )
                    this[e + i] = t / s & 255;
                return e + n
            }
            ,
            c.prototype.writeUint8 = c.prototype.writeUInt8 = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 1, 255, 0),
                this[e] = 255 & t,
                e + 1
            }
            ,
            c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 2, 65535, 0),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                e + 2
            }
            ,
            c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 2, 65535, 0),
                this[e] = t >>> 8,
                this[e + 1] = 255 & t,
                e + 2
            }
            ,
            c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 4, 4294967295, 0),
                this[e + 3] = t >>> 24,
                this[e + 2] = t >>> 16,
                this[e + 1] = t >>> 8,
                this[e] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 4, 4294967295, 0),
                this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeBigUInt64LE = Z((function(t) {
                return O(this, t, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, BigInt(0), BigInt("0xffffffffffffffff"))
            }
            )),
            c.prototype.writeBigUInt64BE = Z((function(t) {
                return R(this, t, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, BigInt(0), BigInt("0xffffffffffffffff"))
            }
            )),
            c.prototype.writeIntLE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                !r) {
                    const r = Math.pow(2, 8 * n - 1);
                    C(this, t, e, n, r - 1, -r)
                }
                let i = 0
                  , s = 1
                  , o = 0;
                for (this[e] = 255 & t; ++i < n && (s *= 256); )
                    t < 0 && 0 === o && 0 !== this[e + i - 1] && (o = 1),
                    this[e + i] = (t / s >> 0) - o & 255;
                return e + n
            }
            ,
            c.prototype.writeIntBE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                !r) {
                    const r = Math.pow(2, 8 * n - 1);
                    C(this, t, e, n, r - 1, -r)
                }
                let i = n - 1
                  , s = 1
                  , o = 0;
                for (this[e + i] = 255 & t; --i >= 0 && (s *= 256); )
                    t < 0 && 0 === o && 0 !== this[e + i + 1] && (o = 1),
                    this[e + i] = (t / s >> 0) - o & 255;
                return e + n
            }
            ,
            c.prototype.writeInt8 = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 1, 127, -128),
                t < 0 && (t = 255 + t + 1),
                this[e] = 255 & t,
                e + 1
            }
            ,
            c.prototype.writeInt16LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 2, 32767, -32768),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                e + 2
            }
            ,
            c.prototype.writeInt16BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 2, 32767, -32768),
                this[e] = t >>> 8,
                this[e + 1] = 255 & t,
                e + 2
            }
            ,
            c.prototype.writeInt32LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 4, 2147483647, -2147483648),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                this[e + 2] = t >>> 16,
                this[e + 3] = t >>> 24,
                e + 4
            }
            ,
            c.prototype.writeInt32BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || C(this, t, e, 4, 2147483647, -2147483648),
                t < 0 && (t = 4294967295 + t + 1),
                this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeBigInt64LE = Z((function(t) {
                return O(this, t, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }
            )),
            c.prototype.writeBigInt64BE = Z((function(t) {
                return R(this, t, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }
            )),
            c.prototype.writeFloatLE = function(t, e, n) {
                return H(this, t, e, !0, n)
            }
            ,
            c.prototype.writeFloatBE = function(t, e, n) {
                return H(this, t, e, !1, n)
            }
            ,
            c.prototype.writeDoubleLE = function(t, e, n) {
                return D(this, t, e, !0, n)
            }
            ,
            c.prototype.writeDoubleBE = function(t, e, n) {
                return D(this, t, e, !1, n)
            }
            ,
            c.prototype.copy = function(t, e, n, r) {
                if (!c.isBuffer(t))
                    throw new TypeError("argument should be a Buffer");
                if (n || (n = 0),
                r || 0 === r || (r = this.length),
                e >= t.length && (e = t.length),
                e || (e = 0),
                r > 0 && r < n && (r = n),
                r === n)
                    return 0;
                if (0 === t.length || 0 === this.length)
                    return 0;
                if (e < 0)
                    throw new RangeError("targetStart out of bounds");
                if (n < 0 || n >= this.length)
                    throw new RangeError("Index out of range");
                if (r < 0)
                    throw new RangeError("sourceEnd out of bounds");
                r > this.length && (r = this.length),
                t.length - e < r - n && (r = t.length - e + n);
                const i = r - n;
                return this === t && "function" === typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e, n, r) : Uint8Array.prototype.set.call(t, this.subarray(n, r), e),
                i
            }
            ,
            c.prototype.fill = function(t, e, n, r) {
                if ("string" === typeof t) {
                    if ("string" === typeof e ? (r = e,
                    e = 0,
                    n = this.length) : "string" === typeof n && (r = n,
                    n = this.length),
                    void 0 !== r && "string" !== typeof r)
                        throw new TypeError("encoding must be a string");
                    if ("string" === typeof r && !c.isEncoding(r))
                        throw new TypeError("Unknown encoding: " + r);
                    if (1 === t.length) {
                        const e = t.charCodeAt(0);
                        ("utf8" === r && e < 128 || "latin1" === r) && (t = e)
                    }
                } else
                    "number" === typeof t ? t &= 255 : "boolean" === typeof t && (t = Number(t));
                if (e < 0 || this.length < e || this.length < n)
                    throw new RangeError("Out of range index");
                if (n <= e)
                    return this;
                let i;
                if (e >>>= 0,
                n = void 0 === n ? this.length : n >>> 0,
                t || (t = 0),
                "number" === typeof t)
                    for (i = e; i < n; ++i)
                        this[i] = t;
                else {
                    const s = c.isBuffer(t) ? t : c.from(t, r)
                      , o = s.length;
                    if (0 === o)
                        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
                    for (i = 0; i < n - e; ++i)
                        this[i + e] = s[i % o]
                }
                return this
            }
            ;
            const P = {};
            function M(t, e, n) {
                P[t] = class extends n {
                    constructor() {
                        super(),
                        Object.defineProperty(this, "message", {
                            value: e.apply(this, arguments),
                            writable: !0,
                            configurable: !0
                        }),
                        this.name = "".concat(this.name, " [").concat(t, "]"),
                        this.stack,
                        delete this.name
                    }
                    get code() {
                        return t
                    }
                    set code(t) {
                        Object.defineProperty(this, "code", {
                            configurable: !0,
                            enumerable: !0,
                            value: t,
                            writable: !0
                        })
                    }
                    toString() {
                        return "".concat(this.name, " [").concat(t, "]: ").concat(this.message)
                    }
                }
            }
            function F(t) {
                let e = ""
                  , n = t.length;
                const r = "-" === t[0] ? 1 : 0;
                for (; n >= r + 4; n -= 3)
                    e = "_".concat(t.slice(n - 3, n)).concat(e);
                return "".concat(t.slice(0, n)).concat(e)
            }
            function q(t, e, n, r, i, s) {
                if (t > n || t < e) {
                    const r = "bigint" === typeof e ? "n" : "";
                    let i;
                    throw i = s > 3 ? 0 === e || e === BigInt(0) ? ">= 0".concat(r, " and < 2").concat(r, " ** ").concat(8 * (s + 1)).concat(r) : ">= -(2".concat(r, " ** ").concat(8 * (s + 1) - 1).concat(r, ") and < 2 ** ") + "".concat(8 * (s + 1) - 1).concat(r) : ">= ".concat(e).concat(r, " and <= ").concat(n).concat(r),
                    new P.ERR_OUT_OF_RANGE("value",i,t)
                }
                !function(t, e, n) {
                    j(e, "offset"),
                    void 0 !== t[e] && void 0 !== t[e + n] || $(e, t.length - (n + 1))
                }(r, i, s)
            }
            function j(t, e) {
                if ("number" !== typeof t)
                    throw new P.ERR_INVALID_ARG_TYPE(e,"number",t)
            }
            function $(t, e, n) {
                if (Math.floor(t) !== t)
                    throw j(t, n),
                    new P.ERR_OUT_OF_RANGE(n || "offset","an integer",t);
                if (e < 0)
                    throw new P.ERR_BUFFER_OUT_OF_BOUNDS;
                throw new P.ERR_OUT_OF_RANGE(n || "offset",">= ".concat(n ? 1 : 0, " and <= ").concat(e),t)
            }
            M("ERR_BUFFER_OUT_OF_BOUNDS", (function(t) {
                return t ? "".concat(t, " is outside of buffer bounds") : "Attempt to access memory outside buffer bounds"
            }
            ), RangeError),
            M("ERR_INVALID_ARG_TYPE", (function(t, e) {
                return 'The "'.concat(t, '" argument must be of type number. Received type ').concat(typeof e)
            }
            ), TypeError),
            M("ERR_OUT_OF_RANGE", (function(t, e, n) {
                let r = 'The value of "'.concat(t, '" is out of range.')
                  , i = n;
                return Number.isInteger(n) && Math.abs(n) > 2 ** 32 ? i = F(String(n)) : "bigint" === typeof n && (i = String(n),
                (n > BigInt(2) ** BigInt(32) || n < -(BigInt(2) ** BigInt(32))) && (i = F(i)),
                i += "n"),
                r += " It must be ".concat(e, ". Received ").concat(i),
                r
            }
            ), RangeError);
            const G = /[^+/0-9A-Za-z-_]/g;
            function K(t, e) {
                let n;
                e = e || 1 / 0;
                const r = t.length;
                let i = null;
                const s = [];
                for (let o = 0; o < r; ++o) {
                    if (n = t.charCodeAt(o),
                    n > 55295 && n < 57344) {
                        if (!i) {
                            if (n > 56319) {
                                (e -= 3) > -1 && s.push(239, 191, 189);
                                continue
                            }
                            if (o + 1 === r) {
                                (e -= 3) > -1 && s.push(239, 191, 189);
                                continue
                            }
                            i = n;
                            continue
                        }
                        if (n < 56320) {
                            (e -= 3) > -1 && s.push(239, 191, 189),
                            i = n;
                            continue
                        }
                        n = 65536 + (i - 55296 << 10 | n - 56320)
                    } else
                        i && (e -= 3) > -1 && s.push(239, 191, 189);
                    if (i = null,
                    n < 128) {
                        if ((e -= 1) < 0)
                            break;
                        s.push(n)
                    } else if (n < 2048) {
                        if ((e -= 2) < 0)
                            break;
                        s.push(n >> 6 | 192, 63 & n | 128)
                    } else if (n < 65536) {
                        if ((e -= 3) < 0)
                            break;
                        s.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                    } else {
                        if (!(n < 1114112))
                            throw new Error("Invalid code point");
                        if ((e -= 4) < 0)
                            break;
                        s.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                    }
                }
                return s
            }
            function V(t) {
                return r.toByteArray(function(t) {
                    if ((t = (t = t.split("=")[0]).trim().replace(G, "")).length < 2)
                        return "";
                    for (; t.length % 4 !== 0; )
                        t += "=";
                    return t
                }(t))
            }
            function W(t, e, n, r) {
                let i;
                for (i = 0; i < r && !(i + n >= e.length || i >= t.length); ++i)
                    e[i + n] = t[i];
                return i
            }
            function Y(t, e) {
                return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name
            }
            function J(t) {
                return t !== t
            }
            const X = function() {
                const t = "0123456789abcdef"
                  , e = new Array(256);
                for (let n = 0; n < 16; ++n) {
                    const r = 16 * n;
                    for (let i = 0; i < 16; ++i)
                        e[r + i] = t[n] + t[i]
                }
                return e
            }();
            function Z(t) {
                return "undefined" === typeof BigInt ? Q : t
            }
            function Q() {
                throw new Error("BigInt not supported")
            }
        }
        ,
        107: t=>{
            "use strict";
            var e = Object.prototype.hasOwnProperty
              , n = "~";
            function r() {}
            function i(t, e, n) {
                this.fn = t,
                this.context = e,
                this.once = n || !1
            }
            function s(t, e, r, s, o) {
                if ("function" !== typeof r)
                    throw new TypeError("The listener must be a function");
                var a = new i(r,s || t,o)
                  , c = n ? n + e : e;
                return t._events[c] ? t._events[c].fn ? t._events[c] = [t._events[c], a] : t._events[c].push(a) : (t._events[c] = a,
                t._eventsCount++),
                t
            }
            function o(t, e) {
                0 === --t._eventsCount ? t._events = new r : delete t._events[e]
            }
            function a() {
                this._events = new r,
                this._eventsCount = 0
            }
            Object.create && (r.prototype = Object.create(null),
            (new r).__proto__ || (n = !1)),
            a.prototype.eventNames = function() {
                var t, r, i = [];
                if (0 === this._eventsCount)
                    return i;
                for (r in t = this._events)
                    e.call(t, r) && i.push(n ? r.slice(1) : r);
                return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(t)) : i
            }
            ,
            a.prototype.listeners = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                if (!r)
                    return [];
                if (r.fn)
                    return [r.fn];
                for (var i = 0, s = r.length, o = new Array(s); i < s; i++)
                    o[i] = r[i].fn;
                return o
            }
            ,
            a.prototype.listenerCount = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                return r ? r.fn ? 1 : r.length : 0
            }
            ,
            a.prototype.emit = function(t, e, r, i, s, o) {
                var a = n ? n + t : t;
                if (!this._events[a])
                    return !1;
                var c, u, l = this._events[a], h = arguments.length;
                if (l.fn) {
                    switch (l.once && this.removeListener(t, l.fn, void 0, !0),
                    h) {
                    case 1:
                        return l.fn.call(l.context),
                        !0;
                    case 2:
                        return l.fn.call(l.context, e),
                        !0;
                    case 3:
                        return l.fn.call(l.context, e, r),
                        !0;
                    case 4:
                        return l.fn.call(l.context, e, r, i),
                        !0;
                    case 5:
                        return l.fn.call(l.context, e, r, i, s),
                        !0;
                    case 6:
                        return l.fn.call(l.context, e, r, i, s, o),
                        !0
                    }
                    for (u = 1,
                    c = new Array(h - 1); u < h; u++)
                        c[u - 1] = arguments[u];
                    l.fn.apply(l.context, c)
                } else {
                    var d, f = l.length;
                    for (u = 0; u < f; u++)
                        switch (l[u].once && this.removeListener(t, l[u].fn, void 0, !0),
                        h) {
                        case 1:
                            l[u].fn.call(l[u].context);
                            break;
                        case 2:
                            l[u].fn.call(l[u].context, e);
                            break;
                        case 3:
                            l[u].fn.call(l[u].context, e, r);
                            break;
                        case 4:
                            l[u].fn.call(l[u].context, e, r, i);
                            break;
                        default:
                            if (!c)
                                for (d = 1,
                                c = new Array(h - 1); d < h; d++)
                                    c[d - 1] = arguments[d];
                            l[u].fn.apply(l[u].context, c)
                        }
                }
                return !0
            }
            ,
            a.prototype.on = function(t, e, n) {
                return s(this, t, e, n, !1)
            }
            ,
            a.prototype.once = function(t, e, n) {
                return s(this, t, e, n, !0)
            }
            ,
            a.prototype.removeListener = function(t, e, r, i) {
                var s = n ? n + t : t;
                if (!this._events[s])
                    return this;
                if (!e)
                    return o(this, s),
                    this;
                var a = this._events[s];
                if (a.fn)
                    a.fn !== e || i && !a.once || r && a.context !== r || o(this, s);
                else {
                    for (var c = 0, u = [], l = a.length; c < l; c++)
                        (a[c].fn !== e || i && !a[c].once || r && a[c].context !== r) && u.push(a[c]);
                    u.length ? this._events[s] = 1 === u.length ? u[0] : u : o(this, s)
                }
                return this
            }
            ,
            a.prototype.removeAllListeners = function(t) {
                var e;
                return t ? (e = n ? n + t : t,
                this._events[e] && o(this, e)) : (this._events = new r,
                this._eventsCount = 0),
                this
            }
            ,
            a.prototype.off = a.prototype.removeListener,
            a.prototype.addListener = a.prototype.on,
            a.prefixed = n,
            a.EventEmitter = a,
            t.exports = a
        }
        ,
        7013: (t,e)=>{
            e.read = function(t, e, n, r, i) {
                var s, o, a = 8 * i - r - 1, c = (1 << a) - 1, u = c >> 1, l = -7, h = n ? i - 1 : 0, d = n ? -1 : 1, f = t[e + h];
                for (h += d,
                s = f & (1 << -l) - 1,
                f >>= -l,
                l += a; l > 0; s = 256 * s + t[e + h],
                h += d,
                l -= 8)
                    ;
                for (o = s & (1 << -l) - 1,
                s >>= -l,
                l += r; l > 0; o = 256 * o + t[e + h],
                h += d,
                l -= 8)
                    ;
                if (0 === s)
                    s = 1 - u;
                else {
                    if (s === c)
                        return o ? NaN : 1 / 0 * (f ? -1 : 1);
                    o += Math.pow(2, r),
                    s -= u
                }
                return (f ? -1 : 1) * o * Math.pow(2, s - r)
            }
            ,
            e.write = function(t, e, n, r, i, s) {
                var o, a, c, u = 8 * s - i - 1, l = (1 << u) - 1, h = l >> 1, d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, f = r ? 0 : s - 1, p = r ? 1 : -1, y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                for (e = Math.abs(e),
                isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0,
                o = l) : (o = Math.floor(Math.log(e) / Math.LN2),
                e * (c = Math.pow(2, -o)) < 1 && (o--,
                c *= 2),
                (e += o + h >= 1 ? d / c : d * Math.pow(2, 1 - h)) * c >= 2 && (o++,
                c /= 2),
                o + h >= l ? (a = 0,
                o = l) : o + h >= 1 ? (a = (e * c - 1) * Math.pow(2, i),
                o += h) : (a = e * Math.pow(2, h - 1) * Math.pow(2, i),
                o = 0)); i >= 8; t[n + f] = 255 & a,
                f += p,
                a /= 256,
                i -= 8)
                    ;
                for (o = o << i | a,
                u += i; u > 0; t[n + f] = 255 & o,
                f += p,
                o /= 256,
                u -= 8)
                    ;
                t[n + f - p] |= 128 * y
            }
        }
        ,
        23054: (t,e,n)=>{
            !function(t) {
                "use strict";
                var e = function(t) {
                    var e, n = new Float64Array(16);
                    if (t)
                        for (e = 0; e < t.length; e++)
                            n[e] = t[e];
                    return n
                }
                  , r = function() {
                    throw new Error("no PRNG")
                }
                  , i = new Uint8Array(16)
                  , s = new Uint8Array(32);
                s[0] = 9;
                var o = e()
                  , a = e([1])
                  , c = e([56129, 1])
                  , u = e([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995])
                  , l = e([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222])
                  , h = e([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553])
                  , d = e([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214])
                  , f = e([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
                function p(t, e, n, r) {
                    t[e] = n >> 24 & 255,
                    t[e + 1] = n >> 16 & 255,
                    t[e + 2] = n >> 8 & 255,
                    t[e + 3] = 255 & n,
                    t[e + 4] = r >> 24 & 255,
                    t[e + 5] = r >> 16 & 255,
                    t[e + 6] = r >> 8 & 255,
                    t[e + 7] = 255 & r
                }
                function y(t, e, n, r, i) {
                    var s, o = 0;
                    for (s = 0; s < i; s++)
                        o |= t[e + s] ^ n[r + s];
                    return (1 & o - 1 >>> 8) - 1
                }
                function g(t, e, n, r) {
                    return y(t, e, n, r, 16)
                }
                function w(t, e, n, r) {
                    return y(t, e, n, r, 32)
                }
                function b(t, e, n, r) {
                    !function(t, e, n, r) {
                        for (var i, s = 255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24, o = 255 & n[0] | (255 & n[1]) << 8 | (255 & n[2]) << 16 | (255 & n[3]) << 24, a = 255 & n[4] | (255 & n[5]) << 8 | (255 & n[6]) << 16 | (255 & n[7]) << 24, c = 255 & n[8] | (255 & n[9]) << 8 | (255 & n[10]) << 16 | (255 & n[11]) << 24, u = 255 & n[12] | (255 & n[13]) << 8 | (255 & n[14]) << 16 | (255 & n[15]) << 24, l = 255 & r[4] | (255 & r[5]) << 8 | (255 & r[6]) << 16 | (255 & r[7]) << 24, h = 255 & e[0] | (255 & e[1]) << 8 | (255 & e[2]) << 16 | (255 & e[3]) << 24, d = 255 & e[4] | (255 & e[5]) << 8 | (255 & e[6]) << 16 | (255 & e[7]) << 24, f = 255 & e[8] | (255 & e[9]) << 8 | (255 & e[10]) << 16 | (255 & e[11]) << 24, p = 255 & e[12] | (255 & e[13]) << 8 | (255 & e[14]) << 16 | (255 & e[15]) << 24, y = 255 & r[8] | (255 & r[9]) << 8 | (255 & r[10]) << 16 | (255 & r[11]) << 24, g = 255 & n[16] | (255 & n[17]) << 8 | (255 & n[18]) << 16 | (255 & n[19]) << 24, w = 255 & n[20] | (255 & n[21]) << 8 | (255 & n[22]) << 16 | (255 & n[23]) << 24, b = 255 & n[24] | (255 & n[25]) << 8 | (255 & n[26]) << 16 | (255 & n[27]) << 24, _ = 255 & n[28] | (255 & n[29]) << 8 | (255 & n[30]) << 16 | (255 & n[31]) << 24, v = 255 & r[12] | (255 & r[13]) << 8 | (255 & r[14]) << 16 | (255 & r[15]) << 24, m = s, A = o, E = a, x = c, U = u, B = l, T = h, S = d, z = f, k = p, I = y, L = g, C = w, O = b, R = _, N = v, H = 0; H < 20; H += 2)
                            m ^= (i = (C ^= (i = (z ^= (i = (U ^= (i = m + C | 0) << 7 | i >>> 25) + m | 0) << 9 | i >>> 23) + U | 0) << 13 | i >>> 19) + z | 0) << 18 | i >>> 14,
                            B ^= (i = (A ^= (i = (O ^= (i = (k ^= (i = B + A | 0) << 7 | i >>> 25) + B | 0) << 9 | i >>> 23) + k | 0) << 13 | i >>> 19) + O | 0) << 18 | i >>> 14,
                            I ^= (i = (T ^= (i = (E ^= (i = (R ^= (i = I + T | 0) << 7 | i >>> 25) + I | 0) << 9 | i >>> 23) + R | 0) << 13 | i >>> 19) + E | 0) << 18 | i >>> 14,
                            N ^= (i = (L ^= (i = (S ^= (i = (x ^= (i = N + L | 0) << 7 | i >>> 25) + N | 0) << 9 | i >>> 23) + x | 0) << 13 | i >>> 19) + S | 0) << 18 | i >>> 14,
                            m ^= (i = (x ^= (i = (E ^= (i = (A ^= (i = m + x | 0) << 7 | i >>> 25) + m | 0) << 9 | i >>> 23) + A | 0) << 13 | i >>> 19) + E | 0) << 18 | i >>> 14,
                            B ^= (i = (U ^= (i = (S ^= (i = (T ^= (i = B + U | 0) << 7 | i >>> 25) + B | 0) << 9 | i >>> 23) + T | 0) << 13 | i >>> 19) + S | 0) << 18 | i >>> 14,
                            I ^= (i = (k ^= (i = (z ^= (i = (L ^= (i = I + k | 0) << 7 | i >>> 25) + I | 0) << 9 | i >>> 23) + L | 0) << 13 | i >>> 19) + z | 0) << 18 | i >>> 14,
                            N ^= (i = (R ^= (i = (O ^= (i = (C ^= (i = N + R | 0) << 7 | i >>> 25) + N | 0) << 9 | i >>> 23) + C | 0) << 13 | i >>> 19) + O | 0) << 18 | i >>> 14;
                        m = m + s | 0,
                        A = A + o | 0,
                        E = E + a | 0,
                        x = x + c | 0,
                        U = U + u | 0,
                        B = B + l | 0,
                        T = T + h | 0,
                        S = S + d | 0,
                        z = z + f | 0,
                        k = k + p | 0,
                        I = I + y | 0,
                        L = L + g | 0,
                        C = C + w | 0,
                        O = O + b | 0,
                        R = R + _ | 0,
                        N = N + v | 0,
                        t[0] = m >>> 0 & 255,
                        t[1] = m >>> 8 & 255,
                        t[2] = m >>> 16 & 255,
                        t[3] = m >>> 24 & 255,
                        t[4] = A >>> 0 & 255,
                        t[5] = A >>> 8 & 255,
                        t[6] = A >>> 16 & 255,
                        t[7] = A >>> 24 & 255,
                        t[8] = E >>> 0 & 255,
                        t[9] = E >>> 8 & 255,
                        t[10] = E >>> 16 & 255,
                        t[11] = E >>> 24 & 255,
                        t[12] = x >>> 0 & 255,
                        t[13] = x >>> 8 & 255,
                        t[14] = x >>> 16 & 255,
                        t[15] = x >>> 24 & 255,
                        t[16] = U >>> 0 & 255,
                        t[17] = U >>> 8 & 255,
                        t[18] = U >>> 16 & 255,
                        t[19] = U >>> 24 & 255,
                        t[20] = B >>> 0 & 255,
                        t[21] = B >>> 8 & 255,
                        t[22] = B >>> 16 & 255,
                        t[23] = B >>> 24 & 255,
                        t[24] = T >>> 0 & 255,
                        t[25] = T >>> 8 & 255,
                        t[26] = T >>> 16 & 255,
                        t[27] = T >>> 24 & 255,
                        t[28] = S >>> 0 & 255,
                        t[29] = S >>> 8 & 255,
                        t[30] = S >>> 16 & 255,
                        t[31] = S >>> 24 & 255,
                        t[32] = z >>> 0 & 255,
                        t[33] = z >>> 8 & 255,
                        t[34] = z >>> 16 & 255,
                        t[35] = z >>> 24 & 255,
                        t[36] = k >>> 0 & 255,
                        t[37] = k >>> 8 & 255,
                        t[38] = k >>> 16 & 255,
                        t[39] = k >>> 24 & 255,
                        t[40] = I >>> 0 & 255,
                        t[41] = I >>> 8 & 255,
                        t[42] = I >>> 16 & 255,
                        t[43] = I >>> 24 & 255,
                        t[44] = L >>> 0 & 255,
                        t[45] = L >>> 8 & 255,
                        t[46] = L >>> 16 & 255,
                        t[47] = L >>> 24 & 255,
                        t[48] = C >>> 0 & 255,
                        t[49] = C >>> 8 & 255,
                        t[50] = C >>> 16 & 255,
                        t[51] = C >>> 24 & 255,
                        t[52] = O >>> 0 & 255,
                        t[53] = O >>> 8 & 255,
                        t[54] = O >>> 16 & 255,
                        t[55] = O >>> 24 & 255,
                        t[56] = R >>> 0 & 255,
                        t[57] = R >>> 8 & 255,
                        t[58] = R >>> 16 & 255,
                        t[59] = R >>> 24 & 255,
                        t[60] = N >>> 0 & 255,
                        t[61] = N >>> 8 & 255,
                        t[62] = N >>> 16 & 255,
                        t[63] = N >>> 24 & 255
                    }(t, e, n, r)
                }
                function _(t, e, n, r) {
                    !function(t, e, n, r) {
                        for (var i, s = 255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24, o = 255 & n[0] | (255 & n[1]) << 8 | (255 & n[2]) << 16 | (255 & n[3]) << 24, a = 255 & n[4] | (255 & n[5]) << 8 | (255 & n[6]) << 16 | (255 & n[7]) << 24, c = 255 & n[8] | (255 & n[9]) << 8 | (255 & n[10]) << 16 | (255 & n[11]) << 24, u = 255 & n[12] | (255 & n[13]) << 8 | (255 & n[14]) << 16 | (255 & n[15]) << 24, l = 255 & r[4] | (255 & r[5]) << 8 | (255 & r[6]) << 16 | (255 & r[7]) << 24, h = 255 & e[0] | (255 & e[1]) << 8 | (255 & e[2]) << 16 | (255 & e[3]) << 24, d = 255 & e[4] | (255 & e[5]) << 8 | (255 & e[6]) << 16 | (255 & e[7]) << 24, f = 255 & e[8] | (255 & e[9]) << 8 | (255 & e[10]) << 16 | (255 & e[11]) << 24, p = 255 & e[12] | (255 & e[13]) << 8 | (255 & e[14]) << 16 | (255 & e[15]) << 24, y = 255 & r[8] | (255 & r[9]) << 8 | (255 & r[10]) << 16 | (255 & r[11]) << 24, g = 255 & n[16] | (255 & n[17]) << 8 | (255 & n[18]) << 16 | (255 & n[19]) << 24, w = 255 & n[20] | (255 & n[21]) << 8 | (255 & n[22]) << 16 | (255 & n[23]) << 24, b = 255 & n[24] | (255 & n[25]) << 8 | (255 & n[26]) << 16 | (255 & n[27]) << 24, _ = 255 & n[28] | (255 & n[29]) << 8 | (255 & n[30]) << 16 | (255 & n[31]) << 24, v = 255 & r[12] | (255 & r[13]) << 8 | (255 & r[14]) << 16 | (255 & r[15]) << 24, m = 0; m < 20; m += 2)
                            s ^= (i = (w ^= (i = (f ^= (i = (u ^= (i = s + w | 0) << 7 | i >>> 25) + s | 0) << 9 | i >>> 23) + u | 0) << 13 | i >>> 19) + f | 0) << 18 | i >>> 14,
                            l ^= (i = (o ^= (i = (b ^= (i = (p ^= (i = l + o | 0) << 7 | i >>> 25) + l | 0) << 9 | i >>> 23) + p | 0) << 13 | i >>> 19) + b | 0) << 18 | i >>> 14,
                            y ^= (i = (h ^= (i = (a ^= (i = (_ ^= (i = y + h | 0) << 7 | i >>> 25) + y | 0) << 9 | i >>> 23) + _ | 0) << 13 | i >>> 19) + a | 0) << 18 | i >>> 14,
                            v ^= (i = (g ^= (i = (d ^= (i = (c ^= (i = v + g | 0) << 7 | i >>> 25) + v | 0) << 9 | i >>> 23) + c | 0) << 13 | i >>> 19) + d | 0) << 18 | i >>> 14,
                            s ^= (i = (c ^= (i = (a ^= (i = (o ^= (i = s + c | 0) << 7 | i >>> 25) + s | 0) << 9 | i >>> 23) + o | 0) << 13 | i >>> 19) + a | 0) << 18 | i >>> 14,
                            l ^= (i = (u ^= (i = (d ^= (i = (h ^= (i = l + u | 0) << 7 | i >>> 25) + l | 0) << 9 | i >>> 23) + h | 0) << 13 | i >>> 19) + d | 0) << 18 | i >>> 14,
                            y ^= (i = (p ^= (i = (f ^= (i = (g ^= (i = y + p | 0) << 7 | i >>> 25) + y | 0) << 9 | i >>> 23) + g | 0) << 13 | i >>> 19) + f | 0) << 18 | i >>> 14,
                            v ^= (i = (_ ^= (i = (b ^= (i = (w ^= (i = v + _ | 0) << 7 | i >>> 25) + v | 0) << 9 | i >>> 23) + w | 0) << 13 | i >>> 19) + b | 0) << 18 | i >>> 14;
                        t[0] = s >>> 0 & 255,
                        t[1] = s >>> 8 & 255,
                        t[2] = s >>> 16 & 255,
                        t[3] = s >>> 24 & 255,
                        t[4] = l >>> 0 & 255,
                        t[5] = l >>> 8 & 255,
                        t[6] = l >>> 16 & 255,
                        t[7] = l >>> 24 & 255,
                        t[8] = y >>> 0 & 255,
                        t[9] = y >>> 8 & 255,
                        t[10] = y >>> 16 & 255,
                        t[11] = y >>> 24 & 255,
                        t[12] = v >>> 0 & 255,
                        t[13] = v >>> 8 & 255,
                        t[14] = v >>> 16 & 255,
                        t[15] = v >>> 24 & 255,
                        t[16] = h >>> 0 & 255,
                        t[17] = h >>> 8 & 255,
                        t[18] = h >>> 16 & 255,
                        t[19] = h >>> 24 & 255,
                        t[20] = d >>> 0 & 255,
                        t[21] = d >>> 8 & 255,
                        t[22] = d >>> 16 & 255,
                        t[23] = d >>> 24 & 255,
                        t[24] = f >>> 0 & 255,
                        t[25] = f >>> 8 & 255,
                        t[26] = f >>> 16 & 255,
                        t[27] = f >>> 24 & 255,
                        t[28] = p >>> 0 & 255,
                        t[29] = p >>> 8 & 255,
                        t[30] = p >>> 16 & 255,
                        t[31] = p >>> 24 & 255
                    }(t, e, n, r)
                }
                var v = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
                function m(t, e, n, r, i, s, o) {
                    var a, c, u = new Uint8Array(16), l = new Uint8Array(64);
                    for (c = 0; c < 16; c++)
                        u[c] = 0;
                    for (c = 0; c < 8; c++)
                        u[c] = s[c];
                    for (; i >= 64; ) {
                        for (b(l, u, o, v),
                        c = 0; c < 64; c++)
                            t[e + c] = n[r + c] ^ l[c];
                        for (a = 1,
                        c = 8; c < 16; c++)
                            a = a + (255 & u[c]) | 0,
                            u[c] = 255 & a,
                            a >>>= 8;
                        i -= 64,
                        e += 64,
                        r += 64
                    }
                    if (i > 0)
                        for (b(l, u, o, v),
                        c = 0; c < i; c++)
                            t[e + c] = n[r + c] ^ l[c];
                    return 0
                }
                function A(t, e, n, r, i) {
                    var s, o, a = new Uint8Array(16), c = new Uint8Array(64);
                    for (o = 0; o < 16; o++)
                        a[o] = 0;
                    for (o = 0; o < 8; o++)
                        a[o] = r[o];
                    for (; n >= 64; ) {
                        for (b(c, a, i, v),
                        o = 0; o < 64; o++)
                            t[e + o] = c[o];
                        for (s = 1,
                        o = 8; o < 16; o++)
                            s = s + (255 & a[o]) | 0,
                            a[o] = 255 & s,
                            s >>>= 8;
                        n -= 64,
                        e += 64
                    }
                    if (n > 0)
                        for (b(c, a, i, v),
                        o = 0; o < n; o++)
                            t[e + o] = c[o];
                    return 0
                }
                function E(t, e, n, r, i) {
                    var s = new Uint8Array(32);
                    _(s, r, i, v);
                    for (var o = new Uint8Array(8), a = 0; a < 8; a++)
                        o[a] = r[a + 16];
                    return A(t, e, n, o, s)
                }
                function x(t, e, n, r, i, s, o) {
                    var a = new Uint8Array(32);
                    _(a, s, o, v);
                    for (var c = new Uint8Array(8), u = 0; u < 8; u++)
                        c[u] = s[u + 16];
                    return m(t, e, n, r, i, c, a)
                }
                var U = function(t) {
                    var e, n, r, i, s, o, a, c;
                    this.buffer = new Uint8Array(16),
                    this.r = new Uint16Array(10),
                    this.h = new Uint16Array(10),
                    this.pad = new Uint16Array(8),
                    this.leftover = 0,
                    this.fin = 0,
                    e = 255 & t[0] | (255 & t[1]) << 8,
                    this.r[0] = 8191 & e,
                    n = 255 & t[2] | (255 & t[3]) << 8,
                    this.r[1] = 8191 & (e >>> 13 | n << 3),
                    r = 255 & t[4] | (255 & t[5]) << 8,
                    this.r[2] = 7939 & (n >>> 10 | r << 6),
                    i = 255 & t[6] | (255 & t[7]) << 8,
                    this.r[3] = 8191 & (r >>> 7 | i << 9),
                    s = 255 & t[8] | (255 & t[9]) << 8,
                    this.r[4] = 255 & (i >>> 4 | s << 12),
                    this.r[5] = s >>> 1 & 8190,
                    o = 255 & t[10] | (255 & t[11]) << 8,
                    this.r[6] = 8191 & (s >>> 14 | o << 2),
                    a = 255 & t[12] | (255 & t[13]) << 8,
                    this.r[7] = 8065 & (o >>> 11 | a << 5),
                    c = 255 & t[14] | (255 & t[15]) << 8,
                    this.r[8] = 8191 & (a >>> 8 | c << 8),
                    this.r[9] = c >>> 5 & 127,
                    this.pad[0] = 255 & t[16] | (255 & t[17]) << 8,
                    this.pad[1] = 255 & t[18] | (255 & t[19]) << 8,
                    this.pad[2] = 255 & t[20] | (255 & t[21]) << 8,
                    this.pad[3] = 255 & t[22] | (255 & t[23]) << 8,
                    this.pad[4] = 255 & t[24] | (255 & t[25]) << 8,
                    this.pad[5] = 255 & t[26] | (255 & t[27]) << 8,
                    this.pad[6] = 255 & t[28] | (255 & t[29]) << 8,
                    this.pad[7] = 255 & t[30] | (255 & t[31]) << 8
                };
                function B(t, e, n, r, i, s) {
                    var o = new U(s);
                    return o.update(n, r, i),
                    o.finish(t, e),
                    0
                }
                function T(t, e, n, r, i, s) {
                    var o = new Uint8Array(16);
                    return B(o, 0, n, r, i, s),
                    g(t, e, o, 0)
                }
                function S(t, e, n, r, i) {
                    var s;
                    if (n < 32)
                        return -1;
                    for (x(t, 0, e, 0, n, r, i),
                    B(t, 16, t, 32, n - 32, t),
                    s = 0; s < 16; s++)
                        t[s] = 0;
                    return 0
                }
                function z(t, e, n, r, i) {
                    var s, o = new Uint8Array(32);
                    if (n < 32)
                        return -1;
                    if (E(o, 0, 32, r, i),
                    0 !== T(e, 16, e, 32, n - 32, o))
                        return -1;
                    for (x(t, 0, e, 0, n, r, i),
                    s = 0; s < 32; s++)
                        t[s] = 0;
                    return 0
                }
                function k(t, e) {
                    var n;
                    for (n = 0; n < 16; n++)
                        t[n] = 0 | e[n]
                }
                function I(t) {
                    var e, n, r = 1;
                    for (e = 0; e < 16; e++)
                        n = t[e] + r + 65535,
                        r = Math.floor(n / 65536),
                        t[e] = n - 65536 * r;
                    t[0] += r - 1 + 37 * (r - 1)
                }
                function L(t, e, n) {
                    for (var r, i = ~(n - 1), s = 0; s < 16; s++)
                        r = i & (t[s] ^ e[s]),
                        t[s] ^= r,
                        e[s] ^= r
                }
                function C(t, n) {
                    var r, i, s, o = e(), a = e();
                    for (r = 0; r < 16; r++)
                        a[r] = n[r];
                    for (I(a),
                    I(a),
                    I(a),
                    i = 0; i < 2; i++) {
                        for (o[0] = a[0] - 65517,
                        r = 1; r < 15; r++)
                            o[r] = a[r] - 65535 - (o[r - 1] >> 16 & 1),
                            o[r - 1] &= 65535;
                        o[15] = a[15] - 32767 - (o[14] >> 16 & 1),
                        s = o[15] >> 16 & 1,
                        o[14] &= 65535,
                        L(a, o, 1 - s)
                    }
                    for (r = 0; r < 16; r++)
                        t[2 * r] = 255 & a[r],
                        t[2 * r + 1] = a[r] >> 8
                }
                function O(t, e) {
                    var n = new Uint8Array(32)
                      , r = new Uint8Array(32);
                    return C(n, t),
                    C(r, e),
                    w(n, 0, r, 0)
                }
                function R(t) {
                    var e = new Uint8Array(32);
                    return C(e, t),
                    1 & e[0]
                }
                function N(t, e) {
                    var n;
                    for (n = 0; n < 16; n++)
                        t[n] = e[2 * n] + (e[2 * n + 1] << 8);
                    t[15] &= 32767
                }
                function H(t, e, n) {
                    for (var r = 0; r < 16; r++)
                        t[r] = e[r] + n[r]
                }
                function D(t, e, n) {
                    for (var r = 0; r < 16; r++)
                        t[r] = e[r] - n[r]
                }
                function P(t, e, n) {
                    var r, i, s = 0, o = 0, a = 0, c = 0, u = 0, l = 0, h = 0, d = 0, f = 0, p = 0, y = 0, g = 0, w = 0, b = 0, _ = 0, v = 0, m = 0, A = 0, E = 0, x = 0, U = 0, B = 0, T = 0, S = 0, z = 0, k = 0, I = 0, L = 0, C = 0, O = 0, R = 0, N = n[0], H = n[1], D = n[2], P = n[3], M = n[4], F = n[5], q = n[6], j = n[7], $ = n[8], G = n[9], K = n[10], V = n[11], W = n[12], Y = n[13], J = n[14], X = n[15];
                    s += (r = e[0]) * N,
                    o += r * H,
                    a += r * D,
                    c += r * P,
                    u += r * M,
                    l += r * F,
                    h += r * q,
                    d += r * j,
                    f += r * $,
                    p += r * G,
                    y += r * K,
                    g += r * V,
                    w += r * W,
                    b += r * Y,
                    _ += r * J,
                    v += r * X,
                    o += (r = e[1]) * N,
                    a += r * H,
                    c += r * D,
                    u += r * P,
                    l += r * M,
                    h += r * F,
                    d += r * q,
                    f += r * j,
                    p += r * $,
                    y += r * G,
                    g += r * K,
                    w += r * V,
                    b += r * W,
                    _ += r * Y,
                    v += r * J,
                    m += r * X,
                    a += (r = e[2]) * N,
                    c += r * H,
                    u += r * D,
                    l += r * P,
                    h += r * M,
                    d += r * F,
                    f += r * q,
                    p += r * j,
                    y += r * $,
                    g += r * G,
                    w += r * K,
                    b += r * V,
                    _ += r * W,
                    v += r * Y,
                    m += r * J,
                    A += r * X,
                    c += (r = e[3]) * N,
                    u += r * H,
                    l += r * D,
                    h += r * P,
                    d += r * M,
                    f += r * F,
                    p += r * q,
                    y += r * j,
                    g += r * $,
                    w += r * G,
                    b += r * K,
                    _ += r * V,
                    v += r * W,
                    m += r * Y,
                    A += r * J,
                    E += r * X,
                    u += (r = e[4]) * N,
                    l += r * H,
                    h += r * D,
                    d += r * P,
                    f += r * M,
                    p += r * F,
                    y += r * q,
                    g += r * j,
                    w += r * $,
                    b += r * G,
                    _ += r * K,
                    v += r * V,
                    m += r * W,
                    A += r * Y,
                    E += r * J,
                    x += r * X,
                    l += (r = e[5]) * N,
                    h += r * H,
                    d += r * D,
                    f += r * P,
                    p += r * M,
                    y += r * F,
                    g += r * q,
                    w += r * j,
                    b += r * $,
                    _ += r * G,
                    v += r * K,
                    m += r * V,
                    A += r * W,
                    E += r * Y,
                    x += r * J,
                    U += r * X,
                    h += (r = e[6]) * N,
                    d += r * H,
                    f += r * D,
                    p += r * P,
                    y += r * M,
                    g += r * F,
                    w += r * q,
                    b += r * j,
                    _ += r * $,
                    v += r * G,
                    m += r * K,
                    A += r * V,
                    E += r * W,
                    x += r * Y,
                    U += r * J,
                    B += r * X,
                    d += (r = e[7]) * N,
                    f += r * H,
                    p += r * D,
                    y += r * P,
                    g += r * M,
                    w += r * F,
                    b += r * q,
                    _ += r * j,
                    v += r * $,
                    m += r * G,
                    A += r * K,
                    E += r * V,
                    x += r * W,
                    U += r * Y,
                    B += r * J,
                    T += r * X,
                    f += (r = e[8]) * N,
                    p += r * H,
                    y += r * D,
                    g += r * P,
                    w += r * M,
                    b += r * F,
                    _ += r * q,
                    v += r * j,
                    m += r * $,
                    A += r * G,
                    E += r * K,
                    x += r * V,
                    U += r * W,
                    B += r * Y,
                    T += r * J,
                    S += r * X,
                    p += (r = e[9]) * N,
                    y += r * H,
                    g += r * D,
                    w += r * P,
                    b += r * M,
                    _ += r * F,
                    v += r * q,
                    m += r * j,
                    A += r * $,
                    E += r * G,
                    x += r * K,
                    U += r * V,
                    B += r * W,
                    T += r * Y,
                    S += r * J,
                    z += r * X,
                    y += (r = e[10]) * N,
                    g += r * H,
                    w += r * D,
                    b += r * P,
                    _ += r * M,
                    v += r * F,
                    m += r * q,
                    A += r * j,
                    E += r * $,
                    x += r * G,
                    U += r * K,
                    B += r * V,
                    T += r * W,
                    S += r * Y,
                    z += r * J,
                    k += r * X,
                    g += (r = e[11]) * N,
                    w += r * H,
                    b += r * D,
                    _ += r * P,
                    v += r * M,
                    m += r * F,
                    A += r * q,
                    E += r * j,
                    x += r * $,
                    U += r * G,
                    B += r * K,
                    T += r * V,
                    S += r * W,
                    z += r * Y,
                    k += r * J,
                    I += r * X,
                    w += (r = e[12]) * N,
                    b += r * H,
                    _ += r * D,
                    v += r * P,
                    m += r * M,
                    A += r * F,
                    E += r * q,
                    x += r * j,
                    U += r * $,
                    B += r * G,
                    T += r * K,
                    S += r * V,
                    z += r * W,
                    k += r * Y,
                    I += r * J,
                    L += r * X,
                    b += (r = e[13]) * N,
                    _ += r * H,
                    v += r * D,
                    m += r * P,
                    A += r * M,
                    E += r * F,
                    x += r * q,
                    U += r * j,
                    B += r * $,
                    T += r * G,
                    S += r * K,
                    z += r * V,
                    k += r * W,
                    I += r * Y,
                    L += r * J,
                    C += r * X,
                    _ += (r = e[14]) * N,
                    v += r * H,
                    m += r * D,
                    A += r * P,
                    E += r * M,
                    x += r * F,
                    U += r * q,
                    B += r * j,
                    T += r * $,
                    S += r * G,
                    z += r * K,
                    k += r * V,
                    I += r * W,
                    L += r * Y,
                    C += r * J,
                    O += r * X,
                    v += (r = e[15]) * N,
                    o += 38 * (A += r * D),
                    a += 38 * (E += r * P),
                    c += 38 * (x += r * M),
                    u += 38 * (U += r * F),
                    l += 38 * (B += r * q),
                    h += 38 * (T += r * j),
                    d += 38 * (S += r * $),
                    f += 38 * (z += r * G),
                    p += 38 * (k += r * K),
                    y += 38 * (I += r * V),
                    g += 38 * (L += r * W),
                    w += 38 * (C += r * Y),
                    b += 38 * (O += r * J),
                    _ += 38 * (R += r * X),
                    s = (r = (s += 38 * (m += r * H)) + (i = 1) + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    o = (r = o + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    a = (r = a + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    c = (r = c + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    u = (r = u + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    l = (r = l + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    h = (r = h + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    d = (r = d + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    f = (r = f + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    p = (r = p + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    y = (r = y + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    g = (r = g + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    w = (r = w + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    b = (r = b + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    _ = (r = _ + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    v = (r = v + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    s = (r = (s += i - 1 + 37 * (i - 1)) + (i = 1) + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    o = (r = o + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    a = (r = a + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    c = (r = c + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    u = (r = u + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    l = (r = l + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    h = (r = h + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    d = (r = d + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    f = (r = f + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    p = (r = p + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    y = (r = y + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    g = (r = g + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    w = (r = w + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    b = (r = b + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    _ = (r = _ + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    v = (r = v + i + 65535) - 65536 * (i = Math.floor(r / 65536)),
                    s += i - 1 + 37 * (i - 1),
                    t[0] = s,
                    t[1] = o,
                    t[2] = a,
                    t[3] = c,
                    t[4] = u,
                    t[5] = l,
                    t[6] = h,
                    t[7] = d,
                    t[8] = f,
                    t[9] = p,
                    t[10] = y,
                    t[11] = g,
                    t[12] = w,
                    t[13] = b,
                    t[14] = _,
                    t[15] = v
                }
                function M(t, e) {
                    P(t, e, e)
                }
                function F(t, n) {
                    var r, i = e();
                    for (r = 0; r < 16; r++)
                        i[r] = n[r];
                    for (r = 253; r >= 0; r--)
                        M(i, i),
                        2 !== r && 4 !== r && P(i, i, n);
                    for (r = 0; r < 16; r++)
                        t[r] = i[r]
                }
                function q(t, n) {
                    var r, i = e();
                    for (r = 0; r < 16; r++)
                        i[r] = n[r];
                    for (r = 250; r >= 0; r--)
                        M(i, i),
                        1 !== r && P(i, i, n);
                    for (r = 0; r < 16; r++)
                        t[r] = i[r]
                }
                function j(t, n, r) {
                    var i, s, o = new Uint8Array(32), a = new Float64Array(80), u = e(), l = e(), h = e(), d = e(), f = e(), p = e();
                    for (s = 0; s < 31; s++)
                        o[s] = n[s];
                    for (o[31] = 127 & n[31] | 64,
                    o[0] &= 248,
                    N(a, r),
                    s = 0; s < 16; s++)
                        l[s] = a[s],
                        d[s] = u[s] = h[s] = 0;
                    for (u[0] = d[0] = 1,
                    s = 254; s >= 0; --s)
                        L(u, l, i = o[s >>> 3] >>> (7 & s) & 1),
                        L(h, d, i),
                        H(f, u, h),
                        D(u, u, h),
                        H(h, l, d),
                        D(l, l, d),
                        M(d, f),
                        M(p, u),
                        P(u, h, u),
                        P(h, l, f),
                        H(f, u, h),
                        D(u, u, h),
                        M(l, u),
                        D(h, d, p),
                        P(u, h, c),
                        H(u, u, d),
                        P(h, h, u),
                        P(u, d, p),
                        P(d, l, a),
                        M(l, f),
                        L(u, l, i),
                        L(h, d, i);
                    for (s = 0; s < 16; s++)
                        a[s + 16] = u[s],
                        a[s + 32] = h[s],
                        a[s + 48] = l[s],
                        a[s + 64] = d[s];
                    var y = a.subarray(32)
                      , g = a.subarray(16);
                    return F(y, y),
                    P(g, g, y),
                    C(t, g),
                    0
                }
                function $(t, e) {
                    return j(t, e, s)
                }
                function G(t, e) {
                    return r(e, 32),
                    $(t, e)
                }
                function K(t, e, n) {
                    var r = new Uint8Array(32);
                    return j(r, n, e),
                    _(t, i, r, v)
                }
                U.prototype.blocks = function(t, e, n) {
                    for (var r, i, s, o, a, c, u, l, h, d, f, p, y, g, w, b, _, v, m, A = this.fin ? 0 : 2048, E = this.h[0], x = this.h[1], U = this.h[2], B = this.h[3], T = this.h[4], S = this.h[5], z = this.h[6], k = this.h[7], I = this.h[8], L = this.h[9], C = this.r[0], O = this.r[1], R = this.r[2], N = this.r[3], H = this.r[4], D = this.r[5], P = this.r[6], M = this.r[7], F = this.r[8], q = this.r[9]; n >= 16; )
                        d = h = 0,
                        d += (E += 8191 & (r = 255 & t[e + 0] | (255 & t[e + 1]) << 8)) * C,
                        d += (x += 8191 & (r >>> 13 | (i = 255 & t[e + 2] | (255 & t[e + 3]) << 8) << 3)) * (5 * q),
                        d += (U += 8191 & (i >>> 10 | (s = 255 & t[e + 4] | (255 & t[e + 5]) << 8) << 6)) * (5 * F),
                        d += (B += 8191 & (s >>> 7 | (o = 255 & t[e + 6] | (255 & t[e + 7]) << 8) << 9)) * (5 * M),
                        h = (d += (T += 8191 & (o >>> 4 | (a = 255 & t[e + 8] | (255 & t[e + 9]) << 8) << 12)) * (5 * P)) >>> 13,
                        d &= 8191,
                        d += (S += a >>> 1 & 8191) * (5 * D),
                        d += (z += 8191 & (a >>> 14 | (c = 255 & t[e + 10] | (255 & t[e + 11]) << 8) << 2)) * (5 * H),
                        d += (k += 8191 & (c >>> 11 | (u = 255 & t[e + 12] | (255 & t[e + 13]) << 8) << 5)) * (5 * N),
                        d += (I += 8191 & (u >>> 8 | (l = 255 & t[e + 14] | (255 & t[e + 15]) << 8) << 8)) * (5 * R),
                        f = h += (d += (L += l >>> 5 | A) * (5 * O)) >>> 13,
                        f += E * O,
                        f += x * C,
                        f += U * (5 * q),
                        f += B * (5 * F),
                        h = (f += T * (5 * M)) >>> 13,
                        f &= 8191,
                        f += S * (5 * P),
                        f += z * (5 * D),
                        f += k * (5 * H),
                        f += I * (5 * N),
                        h += (f += L * (5 * R)) >>> 13,
                        f &= 8191,
                        p = h,
                        p += E * R,
                        p += x * O,
                        p += U * C,
                        p += B * (5 * q),
                        h = (p += T * (5 * F)) >>> 13,
                        p &= 8191,
                        p += S * (5 * M),
                        p += z * (5 * P),
                        p += k * (5 * D),
                        p += I * (5 * H),
                        y = h += (p += L * (5 * N)) >>> 13,
                        y += E * N,
                        y += x * R,
                        y += U * O,
                        y += B * C,
                        h = (y += T * (5 * q)) >>> 13,
                        y &= 8191,
                        y += S * (5 * F),
                        y += z * (5 * M),
                        y += k * (5 * P),
                        y += I * (5 * D),
                        g = h += (y += L * (5 * H)) >>> 13,
                        g += E * H,
                        g += x * N,
                        g += U * R,
                        g += B * O,
                        h = (g += T * C) >>> 13,
                        g &= 8191,
                        g += S * (5 * q),
                        g += z * (5 * F),
                        g += k * (5 * M),
                        g += I * (5 * P),
                        w = h += (g += L * (5 * D)) >>> 13,
                        w += E * D,
                        w += x * H,
                        w += U * N,
                        w += B * R,
                        h = (w += T * O) >>> 13,
                        w &= 8191,
                        w += S * C,
                        w += z * (5 * q),
                        w += k * (5 * F),
                        w += I * (5 * M),
                        b = h += (w += L * (5 * P)) >>> 13,
                        b += E * P,
                        b += x * D,
                        b += U * H,
                        b += B * N,
                        h = (b += T * R) >>> 13,
                        b &= 8191,
                        b += S * O,
                        b += z * C,
                        b += k * (5 * q),
                        b += I * (5 * F),
                        _ = h += (b += L * (5 * M)) >>> 13,
                        _ += E * M,
                        _ += x * P,
                        _ += U * D,
                        _ += B * H,
                        h = (_ += T * N) >>> 13,
                        _ &= 8191,
                        _ += S * R,
                        _ += z * O,
                        _ += k * C,
                        _ += I * (5 * q),
                        v = h += (_ += L * (5 * F)) >>> 13,
                        v += E * F,
                        v += x * M,
                        v += U * P,
                        v += B * D,
                        h = (v += T * H) >>> 13,
                        v &= 8191,
                        v += S * N,
                        v += z * R,
                        v += k * O,
                        v += I * C,
                        m = h += (v += L * (5 * q)) >>> 13,
                        m += E * q,
                        m += x * F,
                        m += U * M,
                        m += B * P,
                        h = (m += T * D) >>> 13,
                        m &= 8191,
                        m += S * H,
                        m += z * N,
                        m += k * R,
                        m += I * O,
                        E = d = 8191 & (h = (h = ((h += (m += L * C) >>> 13) << 2) + h | 0) + (d &= 8191) | 0),
                        x = f += h >>>= 13,
                        U = p &= 8191,
                        B = y &= 8191,
                        T = g &= 8191,
                        S = w &= 8191,
                        z = b &= 8191,
                        k = _ &= 8191,
                        I = v &= 8191,
                        L = m &= 8191,
                        e += 16,
                        n -= 16;
                    this.h[0] = E,
                    this.h[1] = x,
                    this.h[2] = U,
                    this.h[3] = B,
                    this.h[4] = T,
                    this.h[5] = S,
                    this.h[6] = z,
                    this.h[7] = k,
                    this.h[8] = I,
                    this.h[9] = L
                }
                ,
                U.prototype.finish = function(t, e) {
                    var n, r, i, s, o = new Uint16Array(10);
                    if (this.leftover) {
                        for (s = this.leftover,
                        this.buffer[s++] = 1; s < 16; s++)
                            this.buffer[s] = 0;
                        this.fin = 1,
                        this.blocks(this.buffer, 0, 16)
                    }
                    for (n = this.h[1] >>> 13,
                    this.h[1] &= 8191,
                    s = 2; s < 10; s++)
                        this.h[s] += n,
                        n = this.h[s] >>> 13,
                        this.h[s] &= 8191;
                    for (this.h[0] += 5 * n,
                    n = this.h[0] >>> 13,
                    this.h[0] &= 8191,
                    this.h[1] += n,
                    n = this.h[1] >>> 13,
                    this.h[1] &= 8191,
                    this.h[2] += n,
                    o[0] = this.h[0] + 5,
                    n = o[0] >>> 13,
                    o[0] &= 8191,
                    s = 1; s < 10; s++)
                        o[s] = this.h[s] + n,
                        n = o[s] >>> 13,
                        o[s] &= 8191;
                    for (o[9] -= 8192,
                    r = (1 ^ n) - 1,
                    s = 0; s < 10; s++)
                        o[s] &= r;
                    for (r = ~r,
                    s = 0; s < 10; s++)
                        this.h[s] = this.h[s] & r | o[s];
                    for (this.h[0] = 65535 & (this.h[0] | this.h[1] << 13),
                    this.h[1] = 65535 & (this.h[1] >>> 3 | this.h[2] << 10),
                    this.h[2] = 65535 & (this.h[2] >>> 6 | this.h[3] << 7),
                    this.h[3] = 65535 & (this.h[3] >>> 9 | this.h[4] << 4),
                    this.h[4] = 65535 & (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14),
                    this.h[5] = 65535 & (this.h[6] >>> 2 | this.h[7] << 11),
                    this.h[6] = 65535 & (this.h[7] >>> 5 | this.h[8] << 8),
                    this.h[7] = 65535 & (this.h[8] >>> 8 | this.h[9] << 5),
                    i = this.h[0] + this.pad[0],
                    this.h[0] = 65535 & i,
                    s = 1; s < 8; s++)
                        i = (this.h[s] + this.pad[s] | 0) + (i >>> 16) | 0,
                        this.h[s] = 65535 & i;
                    t[e + 0] = this.h[0] >>> 0 & 255,
                    t[e + 1] = this.h[0] >>> 8 & 255,
                    t[e + 2] = this.h[1] >>> 0 & 255,
                    t[e + 3] = this.h[1] >>> 8 & 255,
                    t[e + 4] = this.h[2] >>> 0 & 255,
                    t[e + 5] = this.h[2] >>> 8 & 255,
                    t[e + 6] = this.h[3] >>> 0 & 255,
                    t[e + 7] = this.h[3] >>> 8 & 255,
                    t[e + 8] = this.h[4] >>> 0 & 255,
                    t[e + 9] = this.h[4] >>> 8 & 255,
                    t[e + 10] = this.h[5] >>> 0 & 255,
                    t[e + 11] = this.h[5] >>> 8 & 255,
                    t[e + 12] = this.h[6] >>> 0 & 255,
                    t[e + 13] = this.h[6] >>> 8 & 255,
                    t[e + 14] = this.h[7] >>> 0 & 255,
                    t[e + 15] = this.h[7] >>> 8 & 255
                }
                ,
                U.prototype.update = function(t, e, n) {
                    var r, i;
                    if (this.leftover) {
                        for ((i = 16 - this.leftover) > n && (i = n),
                        r = 0; r < i; r++)
                            this.buffer[this.leftover + r] = t[e + r];
                        if (n -= i,
                        e += i,
                        this.leftover += i,
                        this.leftover < 16)
                            return;
                        this.blocks(this.buffer, 0, 16),
                        this.leftover = 0
                    }
                    if (n >= 16 && (i = n - n % 16,
                    this.blocks(t, e, i),
                    e += i,
                    n -= i),
                    n) {
                        for (r = 0; r < n; r++)
                            this.buffer[this.leftover + r] = t[e + r];
                        this.leftover += n
                    }
                }
                ;
                var V = S
                  , W = z;
                var Y = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];
                function J(t, e, n, r) {
                    for (var i, s, o, a, c, u, l, h, d, f, p, y, g, w, b, _, v, m, A, E, x, U, B, T, S, z, k = new Int32Array(16), I = new Int32Array(16), L = t[0], C = t[1], O = t[2], R = t[3], N = t[4], H = t[5], D = t[6], P = t[7], M = e[0], F = e[1], q = e[2], j = e[3], $ = e[4], G = e[5], K = e[6], V = e[7], W = 0; r >= 128; ) {
                        for (A = 0; A < 16; A++)
                            E = 8 * A + W,
                            k[A] = n[E + 0] << 24 | n[E + 1] << 16 | n[E + 2] << 8 | n[E + 3],
                            I[A] = n[E + 4] << 24 | n[E + 5] << 16 | n[E + 6] << 8 | n[E + 7];
                        for (A = 0; A < 80; A++)
                            if (i = L,
                            s = C,
                            o = O,
                            a = R,
                            c = N,
                            u = H,
                            l = D,
                            P,
                            d = M,
                            f = F,
                            p = q,
                            y = j,
                            g = $,
                            w = G,
                            b = K,
                            V,
                            B = 65535 & (U = V),
                            T = U >>> 16,
                            S = 65535 & (x = P),
                            z = x >>> 16,
                            B += 65535 & (U = ($ >>> 14 | N << 18) ^ ($ >>> 18 | N << 14) ^ (N >>> 9 | $ << 23)),
                            T += U >>> 16,
                            S += 65535 & (x = (N >>> 14 | $ << 18) ^ (N >>> 18 | $ << 14) ^ ($ >>> 9 | N << 23)),
                            z += x >>> 16,
                            B += 65535 & (U = $ & G ^ ~$ & K),
                            T += U >>> 16,
                            S += 65535 & (x = N & H ^ ~N & D),
                            z += x >>> 16,
                            x = Y[2 * A],
                            B += 65535 & (U = Y[2 * A + 1]),
                            T += U >>> 16,
                            S += 65535 & x,
                            z += x >>> 16,
                            x = k[A % 16],
                            T += (U = I[A % 16]) >>> 16,
                            S += 65535 & x,
                            z += x >>> 16,
                            S += (T += (B += 65535 & U) >>> 16) >>> 16,
                            B = 65535 & (U = m = 65535 & B | T << 16),
                            T = U >>> 16,
                            S = 65535 & (x = v = 65535 & S | (z += S >>> 16) << 16),
                            z = x >>> 16,
                            B += 65535 & (U = (M >>> 28 | L << 4) ^ (L >>> 2 | M << 30) ^ (L >>> 7 | M << 25)),
                            T += U >>> 16,
                            S += 65535 & (x = (L >>> 28 | M << 4) ^ (M >>> 2 | L << 30) ^ (M >>> 7 | L << 25)),
                            z += x >>> 16,
                            T += (U = M & F ^ M & q ^ F & q) >>> 16,
                            S += 65535 & (x = L & C ^ L & O ^ C & O),
                            z += x >>> 16,
                            h = 65535 & (S += (T += (B += 65535 & U) >>> 16) >>> 16) | (z += S >>> 16) << 16,
                            _ = 65535 & B | T << 16,
                            B = 65535 & (U = y),
                            T = U >>> 16,
                            S = 65535 & (x = a),
                            z = x >>> 16,
                            T += (U = m) >>> 16,
                            S += 65535 & (x = v),
                            z += x >>> 16,
                            C = i,
                            O = s,
                            R = o,
                            N = a = 65535 & (S += (T += (B += 65535 & U) >>> 16) >>> 16) | (z += S >>> 16) << 16,
                            H = c,
                            D = u,
                            P = l,
                            L = h,
                            F = d,
                            q = f,
                            j = p,
                            $ = y = 65535 & B | T << 16,
                            G = g,
                            K = w,
                            V = b,
                            M = _,
                            A % 16 === 15)
                                for (E = 0; E < 16; E++)
                                    x = k[E],
                                    B = 65535 & (U = I[E]),
                                    T = U >>> 16,
                                    S = 65535 & x,
                                    z = x >>> 16,
                                    x = k[(E + 9) % 16],
                                    B += 65535 & (U = I[(E + 9) % 16]),
                                    T += U >>> 16,
                                    S += 65535 & x,
                                    z += x >>> 16,
                                    v = k[(E + 1) % 16],
                                    B += 65535 & (U = ((m = I[(E + 1) % 16]) >>> 1 | v << 31) ^ (m >>> 8 | v << 24) ^ (m >>> 7 | v << 25)),
                                    T += U >>> 16,
                                    S += 65535 & (x = (v >>> 1 | m << 31) ^ (v >>> 8 | m << 24) ^ v >>> 7),
                                    z += x >>> 16,
                                    v = k[(E + 14) % 16],
                                    T += (U = ((m = I[(E + 14) % 16]) >>> 19 | v << 13) ^ (v >>> 29 | m << 3) ^ (m >>> 6 | v << 26)) >>> 16,
                                    S += 65535 & (x = (v >>> 19 | m << 13) ^ (m >>> 29 | v << 3) ^ v >>> 6),
                                    z += x >>> 16,
                                    z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                                    k[E] = 65535 & S | z << 16,
                                    I[E] = 65535 & B | T << 16;
                        B = 65535 & (U = M),
                        T = U >>> 16,
                        S = 65535 & (x = L),
                        z = x >>> 16,
                        x = t[0],
                        T += (U = e[0]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[0] = L = 65535 & S | z << 16,
                        e[0] = M = 65535 & B | T << 16,
                        B = 65535 & (U = F),
                        T = U >>> 16,
                        S = 65535 & (x = C),
                        z = x >>> 16,
                        x = t[1],
                        T += (U = e[1]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[1] = C = 65535 & S | z << 16,
                        e[1] = F = 65535 & B | T << 16,
                        B = 65535 & (U = q),
                        T = U >>> 16,
                        S = 65535 & (x = O),
                        z = x >>> 16,
                        x = t[2],
                        T += (U = e[2]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[2] = O = 65535 & S | z << 16,
                        e[2] = q = 65535 & B | T << 16,
                        B = 65535 & (U = j),
                        T = U >>> 16,
                        S = 65535 & (x = R),
                        z = x >>> 16,
                        x = t[3],
                        T += (U = e[3]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[3] = R = 65535 & S | z << 16,
                        e[3] = j = 65535 & B | T << 16,
                        B = 65535 & (U = $),
                        T = U >>> 16,
                        S = 65535 & (x = N),
                        z = x >>> 16,
                        x = t[4],
                        T += (U = e[4]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[4] = N = 65535 & S | z << 16,
                        e[4] = $ = 65535 & B | T << 16,
                        B = 65535 & (U = G),
                        T = U >>> 16,
                        S = 65535 & (x = H),
                        z = x >>> 16,
                        x = t[5],
                        T += (U = e[5]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[5] = H = 65535 & S | z << 16,
                        e[5] = G = 65535 & B | T << 16,
                        B = 65535 & (U = K),
                        T = U >>> 16,
                        S = 65535 & (x = D),
                        z = x >>> 16,
                        x = t[6],
                        T += (U = e[6]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[6] = D = 65535 & S | z << 16,
                        e[6] = K = 65535 & B | T << 16,
                        B = 65535 & (U = V),
                        T = U >>> 16,
                        S = 65535 & (x = P),
                        z = x >>> 16,
                        x = t[7],
                        T += (U = e[7]) >>> 16,
                        S += 65535 & x,
                        z += x >>> 16,
                        z += (S += (T += (B += 65535 & U) >>> 16) >>> 16) >>> 16,
                        t[7] = P = 65535 & S | z << 16,
                        e[7] = V = 65535 & B | T << 16,
                        W += 128,
                        r -= 128
                    }
                    return r
                }
                function X(t, e, n) {
                    var r, i = new Int32Array(8), s = new Int32Array(8), o = new Uint8Array(256), a = n;
                    for (i[0] = 1779033703,
                    i[1] = 3144134277,
                    i[2] = 1013904242,
                    i[3] = 2773480762,
                    i[4] = 1359893119,
                    i[5] = 2600822924,
                    i[6] = 528734635,
                    i[7] = 1541459225,
                    s[0] = 4089235720,
                    s[1] = 2227873595,
                    s[2] = 4271175723,
                    s[3] = 1595750129,
                    s[4] = 2917565137,
                    s[5] = 725511199,
                    s[6] = 4215389547,
                    s[7] = 327033209,
                    J(i, s, e, n),
                    n %= 128,
                    r = 0; r < n; r++)
                        o[r] = e[a - n + r];
                    for (o[n] = 128,
                    o[(n = 256 - 128 * (n < 112 ? 1 : 0)) - 9] = 0,
                    p(o, n - 8, a / 536870912 | 0, a << 3),
                    J(i, s, o, n),
                    r = 0; r < 8; r++)
                        p(t, 8 * r, i[r], s[r]);
                    return 0
                }
                function Z(t, n) {
                    var r = e()
                      , i = e()
                      , s = e()
                      , o = e()
                      , a = e()
                      , c = e()
                      , u = e()
                      , h = e()
                      , d = e();
                    D(r, t[1], t[0]),
                    D(d, n[1], n[0]),
                    P(r, r, d),
                    H(i, t[0], t[1]),
                    H(d, n[0], n[1]),
                    P(i, i, d),
                    P(s, t[3], n[3]),
                    P(s, s, l),
                    P(o, t[2], n[2]),
                    H(o, o, o),
                    D(a, i, r),
                    D(c, o, s),
                    H(u, o, s),
                    H(h, i, r),
                    P(t[0], a, c),
                    P(t[1], h, u),
                    P(t[2], u, c),
                    P(t[3], a, h)
                }
                function Q(t, e, n) {
                    var r;
                    for (r = 0; r < 4; r++)
                        L(t[r], e[r], n)
                }
                function tt(t, n) {
                    var r = e()
                      , i = e()
                      , s = e();
                    F(s, n[2]),
                    P(r, n[0], s),
                    P(i, n[1], s),
                    C(t, i),
                    t[31] ^= R(r) << 7
                }
                function et(t, e, n) {
                    var r, i;
                    for (k(t[0], o),
                    k(t[1], a),
                    k(t[2], a),
                    k(t[3], o),
                    i = 255; i >= 0; --i)
                        Q(t, e, r = n[i / 8 | 0] >> (7 & i) & 1),
                        Z(e, t),
                        Z(t, t),
                        Q(t, e, r)
                }
                function nt(t, n) {
                    var r = [e(), e(), e(), e()];
                    k(r[0], h),
                    k(r[1], d),
                    k(r[2], a),
                    P(r[3], h, d),
                    et(t, r, n)
                }
                function rt(t, n, i) {
                    var s, o = new Uint8Array(64), a = [e(), e(), e(), e()];
                    for (i || r(n, 32),
                    X(o, n, 32),
                    o[0] &= 248,
                    o[31] &= 127,
                    o[31] |= 64,
                    nt(a, o),
                    tt(t, a),
                    s = 0; s < 32; s++)
                        n[s + 32] = t[s];
                    return 0
                }
                var it = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
                function st(t, e) {
                    var n, r, i, s;
                    for (r = 63; r >= 32; --r) {
                        for (n = 0,
                        i = r - 32,
                        s = r - 12; i < s; ++i)
                            e[i] += n - 16 * e[r] * it[i - (r - 32)],
                            n = Math.floor((e[i] + 128) / 256),
                            e[i] -= 256 * n;
                        e[i] += n,
                        e[r] = 0
                    }
                    for (n = 0,
                    i = 0; i < 32; i++)
                        e[i] += n - (e[31] >> 4) * it[i],
                        n = e[i] >> 8,
                        e[i] &= 255;
                    for (i = 0; i < 32; i++)
                        e[i] -= n * it[i];
                    for (r = 0; r < 32; r++)
                        e[r + 1] += e[r] >> 8,
                        t[r] = 255 & e[r]
                }
                function ot(t) {
                    var e, n = new Float64Array(64);
                    for (e = 0; e < 64; e++)
                        n[e] = t[e];
                    for (e = 0; e < 64; e++)
                        t[e] = 0;
                    st(t, n)
                }
                function at(t, n, r, i) {
                    var s, o, a = new Uint8Array(64), c = new Uint8Array(64), u = new Uint8Array(64), l = new Float64Array(64), h = [e(), e(), e(), e()];
                    X(a, i, 32),
                    a[0] &= 248,
                    a[31] &= 127,
                    a[31] |= 64;
                    var d = r + 64;
                    for (s = 0; s < r; s++)
                        t[64 + s] = n[s];
                    for (s = 0; s < 32; s++)
                        t[32 + s] = a[32 + s];
                    for (X(u, t.subarray(32), r + 32),
                    ot(u),
                    nt(h, u),
                    tt(t, h),
                    s = 32; s < 64; s++)
                        t[s] = i[s];
                    for (X(c, t, r + 64),
                    ot(c),
                    s = 0; s < 64; s++)
                        l[s] = 0;
                    for (s = 0; s < 32; s++)
                        l[s] = u[s];
                    for (s = 0; s < 32; s++)
                        for (o = 0; o < 32; o++)
                            l[s + o] += c[s] * a[o];
                    return st(t.subarray(32), l),
                    d
                }
                function ct(t, n, r, i) {
                    var s, c = new Uint8Array(32), l = new Uint8Array(64), h = [e(), e(), e(), e()], d = [e(), e(), e(), e()];
                    if (r < 64)
                        return -1;
                    if (function(t, n) {
                        var r = e()
                          , i = e()
                          , s = e()
                          , c = e()
                          , l = e()
                          , h = e()
                          , d = e();
                        return k(t[2], a),
                        N(t[1], n),
                        M(s, t[1]),
                        P(c, s, u),
                        D(s, s, t[2]),
                        H(c, t[2], c),
                        M(l, c),
                        M(h, l),
                        P(d, h, l),
                        P(r, d, s),
                        P(r, r, c),
                        q(r, r),
                        P(r, r, s),
                        P(r, r, c),
                        P(r, r, c),
                        P(t[0], r, c),
                        M(i, t[0]),
                        P(i, i, c),
                        O(i, s) && P(t[0], t[0], f),
                        M(i, t[0]),
                        P(i, i, c),
                        O(i, s) ? -1 : (R(t[0]) === n[31] >> 7 && D(t[0], o, t[0]),
                        P(t[3], t[0], t[1]),
                        0)
                    }(d, i))
                        return -1;
                    for (s = 0; s < r; s++)
                        t[s] = n[s];
                    for (s = 0; s < 32; s++)
                        t[s + 32] = i[s];
                    if (X(l, t, r),
                    ot(l),
                    et(h, d, l),
                    nt(d, n.subarray(32)),
                    Z(h, d),
                    tt(c, h),
                    r -= 64,
                    w(n, 0, c, 0)) {
                        for (s = 0; s < r; s++)
                            t[s] = 0;
                        return -1
                    }
                    for (s = 0; s < r; s++)
                        t[s] = n[s + 64];
                    return r
                }
                var ut = 32
                  , lt = 24
                  , ht = 16
                  , dt = 32
                  , ft = 32
                  , pt = lt
                  , yt = 64
                  , gt = 32
                  , wt = 64;
                function bt(t, e) {
                    if (t.length !== ut)
                        throw new Error("bad key size");
                    if (e.length !== lt)
                        throw new Error("bad nonce size")
                }
                function _t() {
                    for (var t = 0; t < arguments.length; t++)
                        if (!(arguments[t]instanceof Uint8Array))
                            throw new TypeError("unexpected type, use Uint8Array")
                }
                function vt(t) {
                    for (var e = 0; e < t.length; e++)
                        t[e] = 0
                }
                t.lowlevel = {
                    crypto_core_hsalsa20: _,
                    crypto_stream_xor: x,
                    crypto_stream: E,
                    crypto_stream_salsa20_xor: m,
                    crypto_stream_salsa20: A,
                    crypto_onetimeauth: B,
                    crypto_onetimeauth_verify: T,
                    crypto_verify_16: g,
                    crypto_verify_32: w,
                    crypto_secretbox: S,
                    crypto_secretbox_open: z,
                    crypto_scalarmult: j,
                    crypto_scalarmult_base: $,
                    crypto_box_beforenm: K,
                    crypto_box_afternm: V,
                    crypto_box: function(t, e, n, r, i, s) {
                        var o = new Uint8Array(32);
                        return K(o, i, s),
                        V(t, e, n, r, o)
                    },
                    crypto_box_open: function(t, e, n, r, i, s) {
                        var o = new Uint8Array(32);
                        return K(o, i, s),
                        W(t, e, n, r, o)
                    },
                    crypto_box_keypair: G,
                    crypto_hash: X,
                    crypto_sign: at,
                    crypto_sign_keypair: rt,
                    crypto_sign_open: ct,
                    crypto_secretbox_KEYBYTES: ut,
                    crypto_secretbox_NONCEBYTES: lt,
                    crypto_secretbox_ZEROBYTES: 32,
                    crypto_secretbox_BOXZEROBYTES: ht,
                    crypto_scalarmult_BYTES: 32,
                    crypto_scalarmult_SCALARBYTES: 32,
                    crypto_box_PUBLICKEYBYTES: dt,
                    crypto_box_SECRETKEYBYTES: ft,
                    crypto_box_BEFORENMBYTES: 32,
                    crypto_box_NONCEBYTES: pt,
                    crypto_box_ZEROBYTES: 32,
                    crypto_box_BOXZEROBYTES: 16,
                    crypto_sign_BYTES: yt,
                    crypto_sign_PUBLICKEYBYTES: gt,
                    crypto_sign_SECRETKEYBYTES: wt,
                    crypto_sign_SEEDBYTES: 32,
                    crypto_hash_BYTES: 64,
                    gf: e,
                    D: u,
                    L: it,
                    pack25519: C,
                    unpack25519: N,
                    M: P,
                    A: H,
                    S: M,
                    Z: D,
                    pow2523: q,
                    add: Z,
                    set25519: k,
                    modL: st,
                    scalarmult: et,
                    scalarbase: nt
                },
                t.randomBytes = function(t) {
                    var e = new Uint8Array(t);
                    return r(e, t),
                    e
                }
                ,
                t.secretbox = function(t, e, n) {
                    _t(t, e, n),
                    bt(n, e);
                    for (var r = new Uint8Array(32 + t.length), i = new Uint8Array(r.length), s = 0; s < t.length; s++)
                        r[s + 32] = t[s];
                    return S(i, r, r.length, e, n),
                    i.subarray(ht)
                }
                ,
                t.secretbox.open = function(t, e, n) {
                    _t(t, e, n),
                    bt(n, e);
                    for (var r = new Uint8Array(ht + t.length), i = new Uint8Array(r.length), s = 0; s < t.length; s++)
                        r[s + ht] = t[s];
                    return r.length < 32 || 0 !== z(i, r, r.length, e, n) ? null : i.subarray(32)
                }
                ,
                t.secretbox.keyLength = ut,
                t.secretbox.nonceLength = lt,
                t.secretbox.overheadLength = ht,
                t.scalarMult = function(t, e) {
                    if (_t(t, e),
                    32 !== t.length)
                        throw new Error("bad n size");
                    if (32 !== e.length)
                        throw new Error("bad p size");
                    var n = new Uint8Array(32);
                    return j(n, t, e),
                    n
                }
                ,
                t.scalarMult.base = function(t) {
                    if (_t(t),
                    32 !== t.length)
                        throw new Error("bad n size");
                    var e = new Uint8Array(32);
                    return $(e, t),
                    e
                }
                ,
                t.scalarMult.scalarLength = 32,
                t.scalarMult.groupElementLength = 32,
                t.box = function(e, n, r, i) {
                    var s = t.box.before(r, i);
                    return t.secretbox(e, n, s)
                }
                ,
                t.box.before = function(t, e) {
                    _t(t, e),
                    function(t, e) {
                        if (t.length !== dt)
                            throw new Error("bad public key size");
                        if (e.length !== ft)
                            throw new Error("bad secret key size")
                    }(t, e);
                    var n = new Uint8Array(32);
                    return K(n, t, e),
                    n
                }
                ,
                t.box.after = t.secretbox,
                t.box.open = function(e, n, r, i) {
                    var s = t.box.before(r, i);
                    return t.secretbox.open(e, n, s)
                }
                ,
                t.box.open.after = t.secretbox.open,
                t.box.keyPair = function() {
                    var t = new Uint8Array(dt)
                      , e = new Uint8Array(ft);
                    return G(t, e),
                    {
                        publicKey: t,
                        secretKey: e
                    }
                }
                ,
                t.box.keyPair.fromSecretKey = function(t) {
                    if (_t(t),
                    t.length !== ft)
                        throw new Error("bad secret key size");
                    var e = new Uint8Array(dt);
                    return $(e, t),
                    {
                        publicKey: e,
                        secretKey: new Uint8Array(t)
                    }
                }
                ,
                t.box.publicKeyLength = dt,
                t.box.secretKeyLength = ft,
                t.box.sharedKeyLength = 32,
                t.box.nonceLength = pt,
                t.box.overheadLength = t.secretbox.overheadLength,
                t.sign = function(t, e) {
                    if (_t(t, e),
                    e.length !== wt)
                        throw new Error("bad secret key size");
                    var n = new Uint8Array(yt + t.length);
                    return at(n, t, t.length, e),
                    n
                }
                ,
                t.sign.open = function(t, e) {
                    if (_t(t, e),
                    e.length !== gt)
                        throw new Error("bad public key size");
                    var n = new Uint8Array(t.length)
                      , r = ct(n, t, t.length, e);
                    if (r < 0)
                        return null;
                    for (var i = new Uint8Array(r), s = 0; s < i.length; s++)
                        i[s] = n[s];
                    return i
                }
                ,
                t.sign.detached = function(e, n) {
                    for (var r = t.sign(e, n), i = new Uint8Array(yt), s = 0; s < i.length; s++)
                        i[s] = r[s];
                    return i
                }
                ,
                t.sign.detached.verify = function(t, e, n) {
                    if (_t(t, e, n),
                    e.length !== yt)
                        throw new Error("bad signature size");
                    if (n.length !== gt)
                        throw new Error("bad public key size");
                    var r, i = new Uint8Array(yt + t.length), s = new Uint8Array(yt + t.length);
                    for (r = 0; r < yt; r++)
                        i[r] = e[r];
                    for (r = 0; r < t.length; r++)
                        i[r + yt] = t[r];
                    return ct(s, i, i.length, n) >= 0
                }
                ,
                t.sign.keyPair = function() {
                    var t = new Uint8Array(gt)
                      , e = new Uint8Array(wt);
                    return rt(t, e),
                    {
                        publicKey: t,
                        secretKey: e
                    }
                }
                ,
                t.sign.keyPair.fromSecretKey = function(t) {
                    if (_t(t),
                    t.length !== wt)
                        throw new Error("bad secret key size");
                    for (var e = new Uint8Array(gt), n = 0; n < e.length; n++)
                        e[n] = t[32 + n];
                    return {
                        publicKey: e,
                        secretKey: new Uint8Array(t)
                    }
                }
                ,
                t.sign.keyPair.fromSeed = function(t) {
                    if (_t(t),
                    32 !== t.length)
                        throw new Error("bad seed size");
                    for (var e = new Uint8Array(gt), n = new Uint8Array(wt), r = 0; r < 32; r++)
                        n[r] = t[r];
                    return rt(e, n, !0),
                    {
                        publicKey: e,
                        secretKey: n
                    }
                }
                ,
                t.sign.publicKeyLength = gt,
                t.sign.secretKeyLength = wt,
                t.sign.seedLength = 32,
                t.sign.signatureLength = yt,
                t.hash = function(t) {
                    _t(t);
                    var e = new Uint8Array(64);
                    return X(e, t, t.length),
                    e
                }
                ,
                t.hash.hashLength = 64,
                t.verify = function(t, e) {
                    return _t(t, e),
                    0 !== t.length && 0 !== e.length && (t.length === e.length && 0 === y(t, 0, e, 0, t.length))
                }
                ,
                t.setPRNG = function(t) {
                    r = t
                }
                ,
                function() {
                    var e = "undefined" !== typeof self ? self.crypto || self.msCrypto : null;
                    if (e && e.getRandomValues) {
                        t.setPRNG((function(t, n) {
                            var r, i = new Uint8Array(n);
                            for (r = 0; r < n; r += 65536)
                                e.getRandomValues(i.subarray(r, r + Math.min(n - r, 65536)));
                            for (r = 0; r < n; r++)
                                t[r] = i[r];
                            vt(i)
                        }
                        ))
                    } else
                        (e = n(23938)) && e.randomBytes && t.setPRNG((function(t, n) {
                            var r, i = e.randomBytes(n);
                            for (r = 0; r < n; r++)
                                t[r] = i[r];
                            vt(i)
                        }
                        ))
                }()
            }(t.exports ? t.exports : self.nacl = self.nacl || {})
        }
        ,
        23938: ()=>{}
    }
      , e = {};
    function n(r) {
        var i = e[r];
        if (void 0 !== i)
            return i.exports;
        var s = e[r] = {
            exports: {}
        };
        return t[r](s, s.exports, n),
        s.exports
    }
    (()=>{
        "use strict";
        var t = n(23054)
          , e = n(79530);
        "object" === typeof self && "crypto"in self && self.crypto;
        const r = t=>new DataView(t.buffer,t.byteOffset,t.byteLength)
          , i = (t,e)=>t << 32 - e | t >>> e;
        if (!(68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0]))
            throw new Error("Non little-endian hardware is not supported");
        const s = Array.from({
            length: 256
        }, ((t,e)=>e.toString(16).padStart(2, "0")));
        function o(t) {
            if (!(t instanceof Uint8Array))
                throw new Error("Uint8Array expected");
            let e = "";
            for (let n = 0; n < t.length; n++)
                e += s[t[n]];
            return e
        }
        function a(t) {
            if ("string" !== typeof t)
                throw new TypeError("hexToBytes: expected string, got " + typeof t);
            if (t.length % 2)
                throw new Error("hexToBytes: received invalid unpadded hex");
            const e = new Uint8Array(t.length / 2);
            for (let n = 0; n < e.length; n++) {
                const r = 2 * n
                  , i = t.slice(r, r + 2)
                  , s = Number.parseInt(i, 16);
                if (Number.isNaN(s) || s < 0)
                    throw new Error("Invalid byte sequence");
                e[n] = s
            }
            return e
        }
        function c(t) {
            if ("string" === typeof t && (t = function(t) {
                if ("string" !== typeof t)
                    throw new TypeError("utf8ToBytes expected string, got ".concat(typeof t));
                return (new TextEncoder).encode(t)
            }(t)),
            !(t instanceof Uint8Array))
                throw new TypeError("Expected input type is Uint8Array (got ".concat(typeof t, ")"));
            return t
        }
        class u {
            clone() {
                return this._cloneInto()
            }
        }
        function l(t) {
            const e = e=>t().update(c(e)).digest()
              , n = t();
            return e.outputLen = n.outputLen,
            e.blockLen = n.blockLen,
            e.create = ()=>t(),
            e
        }
        function h(t) {
            if (!Number.isSafeInteger(t) || t < 0)
                throw new Error("Wrong positive integer: ".concat(t))
        }
        function d(t) {
            if (!(t instanceof Uint8Array))
                throw new TypeError("Expected Uint8Array");
            for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
                n[r - 1] = arguments[r];
            if (n.length > 0 && !n.includes(t.length))
                throw new TypeError("Expected Uint8Array of length ".concat(n, ", not of length=").concat(t.length))
        }
        const f = {
            number: h,
            bool: function(t) {
                if ("boolean" !== typeof t)
                    throw new Error("Expected boolean, not ".concat(t))
            },
            bytes: d,
            hash: function(t) {
                if ("function" !== typeof t || "function" !== typeof t.create)
                    throw new Error("Hash should be wrapped by utils.wrapConstructor");
                h(t.outputLen),
                h(t.blockLen)
            },
            exists: function(t) {
                let e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                if (t.destroyed)
                    throw new Error("Hash instance has been destroyed");
                if (e && t.finished)
                    throw new Error("Hash#digest() has already been called")
            },
            output: function(t, e) {
                d(t);
                const n = e.outputLen;
                if (t.length < n)
                    throw new Error("digestInto() expects output buffer of length at least ".concat(n))
            }
        }
          , p = f;
        class y extends u {
            constructor(t, e, n, i) {
                super(),
                this.blockLen = t,
                this.outputLen = e,
                this.padOffset = n,
                this.isLE = i,
                this.finished = !1,
                this.length = 0,
                this.pos = 0,
                this.destroyed = !1,
                this.buffer = new Uint8Array(t),
                this.view = r(this.buffer)
            }
            update(t) {
                p.exists(this);
                const {view: e, buffer: n, blockLen: i} = this
                  , s = (t = c(t)).length;
                for (let o = 0; o < s; ) {
                    const a = Math.min(i - this.pos, s - o);
                    if (a !== i)
                        n.set(t.subarray(o, o + a), this.pos),
                        this.pos += a,
                        o += a,
                        this.pos === i && (this.process(e, 0),
                        this.pos = 0);
                    else {
                        const e = r(t);
                        for (; i <= s - o; o += i)
                            this.process(e, o)
                    }
                }
                return this.length += t.length,
                this.roundClean(),
                this
            }
            digestInto(t) {
                p.exists(this),
                p.output(t, this),
                this.finished = !0;
                const {buffer: e, view: n, blockLen: i, isLE: s} = this;
                let {pos: o} = this;
                e[o++] = 128,
                this.buffer.subarray(o).fill(0),
                this.padOffset > i - o && (this.process(n, 0),
                o = 0);
                for (let r = o; r < i; r++)
                    e[r] = 0;
                !function(t, e, n, r) {
                    if ("function" === typeof t.setBigUint64)
                        return t.setBigUint64(e, n, r);
                    const i = BigInt(32)
                      , s = BigInt(4294967295)
                      , o = Number(n >> i & s)
                      , a = Number(n & s)
                      , c = r ? 4 : 0
                      , u = r ? 0 : 4;
                    t.setUint32(e + c, o, r),
                    t.setUint32(e + u, a, r)
                }(n, i - 8, BigInt(8 * this.length), s),
                this.process(n, 0);
                const a = r(t)
                  , c = this.outputLen;
                if (c % 4)
                    throw new Error("_sha2: outputLen should be aligned to 32bit");
                const u = c / 4
                  , l = this.get();
                if (u > l.length)
                    throw new Error("_sha2: outputLen bigger than state");
                for (let r = 0; r < u; r++)
                    a.setUint32(4 * r, l[r], s)
            }
            digest() {
                const {buffer: t, outputLen: e} = this;
                this.digestInto(t);
                const n = t.slice(0, e);
                return this.destroy(),
                n
            }
            _cloneInto(t) {
                t || (t = new this.constructor),
                t.set(...this.get());
                const {blockLen: e, buffer: n, length: r, finished: i, destroyed: s, pos: o} = this;
                return t.length = r,
                t.pos = o,
                t.finished = i,
                t.destroyed = s,
                r % e && t.buffer.set(n),
                t
            }
        }
        const g = (t,e,n)=>t & e ^ t & n ^ e & n
          , w = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298])
          , b = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225])
          , _ = new Uint32Array(64);
        class v extends y {
            constructor() {
                super(64, 32, 8, !1),
                this.A = 0 | b[0],
                this.B = 0 | b[1],
                this.C = 0 | b[2],
                this.D = 0 | b[3],
                this.E = 0 | b[4],
                this.F = 0 | b[5],
                this.G = 0 | b[6],
                this.H = 0 | b[7]
            }
            get() {
                const {A: t, B: e, C: n, D: r, E: i, F: s, G: o, H: a} = this;
                return [t, e, n, r, i, s, o, a]
            }
            set(t, e, n, r, i, s, o, a) {
                this.A = 0 | t,
                this.B = 0 | e,
                this.C = 0 | n,
                this.D = 0 | r,
                this.E = 0 | i,
                this.F = 0 | s,
                this.G = 0 | o,
                this.H = 0 | a
            }
            process(t, e) {
                for (let i = 0; i < 16; i++,
                e += 4)
                    _[i] = t.getUint32(e, !1);
                for (let d = 16; d < 64; d++) {
                    const t = _[d - 15]
                      , e = _[d - 2]
                      , n = i(t, 7) ^ i(t, 18) ^ t >>> 3
                      , r = i(e, 17) ^ i(e, 19) ^ e >>> 10;
                    _[d] = r + _[d - 7] + n + _[d - 16] | 0
                }
                let {A: n, B: r, C: s, D: o, E: a, F: c, G: u, H: l} = this;
                for (let d = 0; d < 64; d++) {
                    const t = l + (i(a, 6) ^ i(a, 11) ^ i(a, 25)) + ((h = a) & c ^ ~h & u) + w[d] + _[d] | 0
                      , e = (i(n, 2) ^ i(n, 13) ^ i(n, 22)) + g(n, r, s) | 0;
                    l = u,
                    u = c,
                    c = a,
                    a = o + t | 0,
                    o = s,
                    s = r,
                    r = n,
                    n = t + e | 0
                }
                var h;
                n = n + this.A | 0,
                r = r + this.B | 0,
                s = s + this.C | 0,
                o = o + this.D | 0,
                a = a + this.E | 0,
                c = c + this.F | 0,
                u = u + this.G | 0,
                l = l + this.H | 0,
                this.set(n, r, s, o, a, c, u, l)
            }
            roundClean() {
                _.fill(0)
            }
            destroy() {
                this.set(0, 0, 0, 0, 0, 0, 0, 0),
                this.buffer.fill(0)
            }
        }
        class m extends v {
            constructor() {
                super(),
                this.A = -1056596264,
                this.B = 914150663,
                this.C = 812702999,
                this.D = -150054599,
                this.E = -4191439,
                this.F = 1750603025,
                this.G = 1694076839,
                this.H = -1090891868,
                this.outputLen = 28
            }
        }
        const A = l((()=>new v))
          , E = (l((()=>new m)),
        BigInt(2 ** 32 - 1))
          , x = BigInt(32);
        function U(t) {
            return arguments.length > 1 && void 0 !== arguments[1] && arguments[1] ? {
                h: Number(t & E),
                l: Number(t >> x & E)
            } : {
                h: 0 | Number(t >> x & E),
                l: 0 | Number(t & E)
            }
        }
        const B = {
            fromBig: U,
            split: function(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
                  , n = new Uint32Array(t.length)
                  , r = new Uint32Array(t.length);
                for (let i = 0; i < t.length; i++) {
                    const {h: s, l: o} = U(t[i], e);
                    [n[i],r[i]] = [s, o]
                }
                return [n, r]
            },
            toBig: (t,e)=>BigInt(t >>> 0) << x | BigInt(e >>> 0),
            shrSH: (t,e,n)=>t >>> n,
            shrSL: (t,e,n)=>t << 32 - n | e >>> n,
            rotrSH: (t,e,n)=>t >>> n | e << 32 - n,
            rotrSL: (t,e,n)=>t << 32 - n | e >>> n,
            rotrBH: (t,e,n)=>t << 64 - n | e >>> n - 32,
            rotrBL: (t,e,n)=>t >>> n - 32 | e << 64 - n,
            rotr32H: (t,e)=>e,
            rotr32L: (t,e)=>t,
            rotlSH: (t,e,n)=>t << n | e >>> 32 - n,
            rotlSL: (t,e,n)=>e << n | t >>> 32 - n,
            rotlBH: (t,e,n)=>e << n - 32 | t >>> 64 - n,
            rotlBL: (t,e,n)=>t << n - 32 | e >>> 64 - n,
            add: function(t, e, n, r) {
                const i = (e >>> 0) + (r >>> 0);
                return {
                    h: t + n + (i / 2 ** 32 | 0) | 0,
                    l: 0 | i
                }
            },
            add3L: (t,e,n)=>(t >>> 0) + (e >>> 0) + (n >>> 0),
            add3H: (t,e,n,r)=>e + n + r + (t / 2 ** 32 | 0) | 0,
            add4L: (t,e,n,r)=>(t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0),
            add4H: (t,e,n,r,i)=>e + n + r + i + (t / 2 ** 32 | 0) | 0,
            add5H: (t,e,n,r,i,s)=>e + n + r + i + s + (t / 2 ** 32 | 0) | 0,
            add5L: (t,e,n,r,i)=>(t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0)
        }
          , [T,S,z] = [[], [], []]
          , k = BigInt(0)
          , I = BigInt(1)
          , L = BigInt(2)
          , C = BigInt(7)
          , O = BigInt(256)
          , R = BigInt(113);
        for (let n = 0, kr = I, Ir = 1, Lr = 0; n < 24; n++) {
            [Ir,Lr] = [Lr, (2 * Ir + 3 * Lr) % 5],
            T.push(2 * (5 * Lr + Ir)),
            S.push((n + 1) * (n + 2) / 2 % 64);
            let t = k;
            for (let e = 0; e < 7; e++)
                kr = (kr << I ^ (kr >> C) * R) % O,
                kr & L && (t ^= I << (I << BigInt(e)) - I);
            z.push(t)
        }
        const [N,H] = B.split(z, !0)
          , D = (t,e,n)=>n > 32 ? B.rotlBH(t, e, n) : B.rotlSH(t, e, n)
          , P = (t,e,n)=>n > 32 ? B.rotlBL(t, e, n) : B.rotlSL(t, e, n);
        class M extends u {
            constructor(t, e, n) {
                let r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3]
                  , i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 24;
                if (super(),
                this.blockLen = t,
                this.suffix = e,
                this.outputLen = n,
                this.enableXOF = r,
                this.rounds = i,
                this.pos = 0,
                this.posOut = 0,
                this.finished = !1,
                this.destroyed = !1,
                p.number(n),
                0 >= this.blockLen || this.blockLen >= 200)
                    throw new Error("Sha3 supports only keccak-f1600 function");
                var s;
                this.state = new Uint8Array(200),
                this.state32 = (s = this.state,
                new Uint32Array(s.buffer,s.byteOffset,Math.floor(s.byteLength / 4)))
            }
            keccak() {
                !function(t) {
                    let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 24;
                    const n = new Uint32Array(10);
                    for (let r = 24 - e; r < 24; r++) {
                        for (let r = 0; r < 10; r++)
                            n[r] = t[r] ^ t[r + 10] ^ t[r + 20] ^ t[r + 30] ^ t[r + 40];
                        for (let r = 0; r < 10; r += 2) {
                            const e = (r + 8) % 10
                              , i = (r + 2) % 10
                              , s = n[i]
                              , o = n[i + 1]
                              , a = D(s, o, 1) ^ n[e]
                              , c = P(s, o, 1) ^ n[e + 1];
                            for (let n = 0; n < 50; n += 10)
                                t[r + n] ^= a,
                                t[r + n + 1] ^= c
                        }
                        let e = t[2]
                          , i = t[3];
                        for (let n = 0; n < 24; n++) {
                            const r = S[n]
                              , s = D(e, i, r)
                              , o = P(e, i, r)
                              , a = T[n];
                            e = t[a],
                            i = t[a + 1],
                            t[a] = s,
                            t[a + 1] = o
                        }
                        for (let r = 0; r < 50; r += 10) {
                            for (let e = 0; e < 10; e++)
                                n[e] = t[r + e];
                            for (let e = 0; e < 10; e++)
                                t[r + e] ^= ~n[(e + 2) % 10] & n[(e + 4) % 10]
                        }
                        t[0] ^= N[r],
                        t[1] ^= H[r]
                    }
                    n.fill(0)
                }(this.state32, this.rounds),
                this.posOut = 0,
                this.pos = 0
            }
            update(t) {
                p.exists(this);
                const {blockLen: e, state: n} = this
                  , r = (t = c(t)).length;
                for (let i = 0; i < r; ) {
                    const s = Math.min(e - this.pos, r - i);
                    for (let e = 0; e < s; e++)
                        n[this.pos++] ^= t[i++];
                    this.pos === e && this.keccak()
                }
                return this
            }
            finish() {
                if (this.finished)
                    return;
                this.finished = !0;
                const {state: t, suffix: e, pos: n, blockLen: r} = this;
                t[n] ^= e,
                0 !== (128 & e) && n === r - 1 && this.keccak(),
                t[r - 1] ^= 128,
                this.keccak()
            }
            writeInto(t) {
                p.exists(this, !1),
                p.bytes(t),
                this.finish();
                const e = this.state
                  , {blockLen: n} = this;
                for (let r = 0, i = t.length; r < i; ) {
                    this.posOut >= n && this.keccak();
                    const s = Math.min(n - this.posOut, i - r);
                    t.set(e.subarray(this.posOut, this.posOut + s), r),
                    this.posOut += s,
                    r += s
                }
                return t
            }
            xofInto(t) {
                if (!this.enableXOF)
                    throw new Error("XOF is not possible for this instance");
                return this.writeInto(t)
            }
            xof(t) {
                return p.number(t),
                this.xofInto(new Uint8Array(t))
            }
            digestInto(t) {
                if (p.output(t, this),
                this.finished)
                    throw new Error("digest() was already called");
                return this.writeInto(t),
                this.destroy(),
                t
            }
            digest() {
                return this.digestInto(new Uint8Array(this.outputLen))
            }
            destroy() {
                this.destroyed = !0,
                this.state.fill(0)
            }
            _cloneInto(t) {
                const {blockLen: e, suffix: n, outputLen: r, rounds: i, enableXOF: s} = this;
                return t || (t = new M(e,n,r,s,i)),
                t.state32.set(this.state32),
                t.pos = this.pos,
                t.posOut = this.posOut,
                t.finished = this.finished,
                t.rounds = i,
                t.suffix = n,
                t.outputLen = r,
                t.enableXOF = s,
                t.destroyed = this.destroyed,
                t
            }
        }
        const F = (t,e,n)=>l((()=>new M(e,t,n)))
          , q = (F(6, 144, 28),
        F(6, 136, 32))
          , j = (F(6, 104, 48),
        F(6, 72, 64),
        F(1, 144, 28),
        F(1, 136, 32),
        F(1, 104, 48),
        F(1, 72, 64),
        (t,e,n)=>function(t) {
            const e = (e,n)=>t(n).update(c(e)).digest()
              , n = t({});
            return e.outputLen = n.outputLen,
            e.blockLen = n.blockLen,
            e.create = e=>t(e),
            e
        }((function() {
            let r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            return new M(e,t,void 0 === r.dkLen ? n : r.dkLen,!0)
        }
        )));
        j(31, 168, 16),
        j(31, 136, 32);
        class $ extends u {
            constructor(t, e) {
                super(),
                this.finished = !1,
                this.destroyed = !1,
                p.hash(t);
                const n = c(e);
                if (this.iHash = t.create(),
                "function" !== typeof this.iHash.update)
                    throw new TypeError("Expected instance of class which extends utils.Hash");
                this.blockLen = this.iHash.blockLen,
                this.outputLen = this.iHash.outputLen;
                const r = this.blockLen
                  , i = new Uint8Array(r);
                i.set(n.length > r ? t.create().update(n).digest() : n);
                for (let s = 0; s < i.length; s++)
                    i[s] ^= 54;
                this.iHash.update(i),
                this.oHash = t.create();
                for (let s = 0; s < i.length; s++)
                    i[s] ^= 106;
                this.oHash.update(i),
                i.fill(0)
            }
            update(t) {
                return p.exists(this),
                this.iHash.update(t),
                this
            }
            digestInto(t) {
                p.exists(this),
                p.bytes(t, this.outputLen),
                this.finished = !0,
                this.iHash.digestInto(t),
                this.oHash.update(t),
                this.oHash.digestInto(t),
                this.destroy()
            }
            digest() {
                const t = new Uint8Array(this.oHash.outputLen);
                return this.digestInto(t),
                t
            }
            _cloneInto(t) {
                t || (t = Object.create(Object.getPrototypeOf(this), {}));
                const {oHash: e, iHash: n, finished: r, destroyed: i, blockLen: s, outputLen: o} = this;
                return t.finished = r,
                t.destroyed = i,
                t.blockLen = s,
                t.outputLen = o,
                t.oHash = e._cloneInto(t.oHash),
                t.iHash = n._cloneInto(t.iHash),
                t
            }
            destroy() {
                this.destroyed = !0,
                this.oHash.destroy(),
                this.iHash.destroy()
            }
        }
        const G = (t,e,n)=>new $(t,e).update(n).digest();
        G.create = (t,e)=>new $(t,e);
        const [K,V] = B.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((t=>BigInt(t))))
          , W = new Uint32Array(80)
          , Y = new Uint32Array(80);
        class J extends y {
            constructor() {
                super(128, 64, 16, !1),
                this.Ah = 1779033703,
                this.Al = -205731576,
                this.Bh = -1150833019,
                this.Bl = -2067093701,
                this.Ch = 1013904242,
                this.Cl = -23791573,
                this.Dh = -1521486534,
                this.Dl = 1595750129,
                this.Eh = 1359893119,
                this.El = -1377402159,
                this.Fh = -1694144372,
                this.Fl = 725511199,
                this.Gh = 528734635,
                this.Gl = -79577749,
                this.Hh = 1541459225,
                this.Hl = 327033209
            }
            get() {
                const {Ah: t, Al: e, Bh: n, Bl: r, Ch: i, Cl: s, Dh: o, Dl: a, Eh: c, El: u, Fh: l, Fl: h, Gh: d, Gl: f, Hh: p, Hl: y} = this;
                return [t, e, n, r, i, s, o, a, c, u, l, h, d, f, p, y]
            }
            set(t, e, n, r, i, s, o, a, c, u, l, h, d, f, p, y) {
                this.Ah = 0 | t,
                this.Al = 0 | e,
                this.Bh = 0 | n,
                this.Bl = 0 | r,
                this.Ch = 0 | i,
                this.Cl = 0 | s,
                this.Dh = 0 | o,
                this.Dl = 0 | a,
                this.Eh = 0 | c,
                this.El = 0 | u,
                this.Fh = 0 | l,
                this.Fl = 0 | h,
                this.Gh = 0 | d,
                this.Gl = 0 | f,
                this.Hh = 0 | p,
                this.Hl = 0 | y
            }
            process(t, e) {
                for (let b = 0; b < 16; b++,
                e += 4)
                    W[b] = t.getUint32(e),
                    Y[b] = t.getUint32(e += 4);
                for (let b = 16; b < 80; b++) {
                    const t = 0 | W[b - 15]
                      , e = 0 | Y[b - 15]
                      , n = B.rotrSH(t, e, 1) ^ B.rotrSH(t, e, 8) ^ B.shrSH(t, e, 7)
                      , r = B.rotrSL(t, e, 1) ^ B.rotrSL(t, e, 8) ^ B.shrSL(t, e, 7)
                      , i = 0 | W[b - 2]
                      , s = 0 | Y[b - 2]
                      , o = B.rotrSH(i, s, 19) ^ B.rotrBH(i, s, 61) ^ B.shrSH(i, s, 6)
                      , a = B.rotrSL(i, s, 19) ^ B.rotrBL(i, s, 61) ^ B.shrSL(i, s, 6)
                      , c = B.add4L(r, a, Y[b - 7], Y[b - 16])
                      , u = B.add4H(c, n, o, W[b - 7], W[b - 16]);
                    W[b] = 0 | u,
                    Y[b] = 0 | c
                }
                let {Ah: n, Al: r, Bh: i, Bl: s, Ch: o, Cl: a, Dh: c, Dl: u, Eh: l, El: h, Fh: d, Fl: f, Gh: p, Gl: y, Hh: g, Hl: w} = this;
                for (let b = 0; b < 80; b++) {
                    const t = B.rotrSH(l, h, 14) ^ B.rotrSH(l, h, 18) ^ B.rotrBH(l, h, 41)
                      , e = B.rotrSL(l, h, 14) ^ B.rotrSL(l, h, 18) ^ B.rotrBL(l, h, 41)
                      , _ = l & d ^ ~l & p
                      , v = h & f ^ ~h & y
                      , m = B.add5L(w, e, v, V[b], Y[b])
                      , A = B.add5H(m, g, t, _, K[b], W[b])
                      , E = 0 | m
                      , x = B.rotrSH(n, r, 28) ^ B.rotrBH(n, r, 34) ^ B.rotrBH(n, r, 39)
                      , U = B.rotrSL(n, r, 28) ^ B.rotrBL(n, r, 34) ^ B.rotrBL(n, r, 39)
                      , T = n & i ^ n & o ^ i & o
                      , S = r & s ^ r & a ^ s & a;
                    g = 0 | p,
                    w = 0 | y,
                    p = 0 | d,
                    y = 0 | f,
                    d = 0 | l,
                    f = 0 | h,
                    ({h: l, l: h} = B.add(0 | c, 0 | u, 0 | A, 0 | E)),
                    c = 0 | o,
                    u = 0 | a,
                    o = 0 | i,
                    a = 0 | s,
                    i = 0 | n,
                    s = 0 | r;
                    const z = B.add3L(E, U, S);
                    n = B.add3H(z, A, x, T),
                    r = 0 | z
                }
                ({h: n, l: r} = B.add(0 | this.Ah, 0 | this.Al, 0 | n, 0 | r)),
                ({h: i, l: s} = B.add(0 | this.Bh, 0 | this.Bl, 0 | i, 0 | s)),
                ({h: o, l: a} = B.add(0 | this.Ch, 0 | this.Cl, 0 | o, 0 | a)),
                ({h: c, l: u} = B.add(0 | this.Dh, 0 | this.Dl, 0 | c, 0 | u)),
                ({h: l, l: h} = B.add(0 | this.Eh, 0 | this.El, 0 | l, 0 | h)),
                ({h: d, l: f} = B.add(0 | this.Fh, 0 | this.Fl, 0 | d, 0 | f)),
                ({h: p, l: y} = B.add(0 | this.Gh, 0 | this.Gl, 0 | p, 0 | y)),
                ({h: g, l: w} = B.add(0 | this.Hh, 0 | this.Hl, 0 | g, 0 | w)),
                this.set(n, r, i, s, o, a, c, u, l, h, d, f, p, y, g, w)
            }
            roundClean() {
                W.fill(0),
                Y.fill(0)
            }
            destroy() {
                this.buffer.fill(0),
                this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            }
        }
        class X extends J {
            constructor() {
                super(),
                this.Ah = -1942145080,
                this.Al = 424955298,
                this.Bh = 1944164710,
                this.Bl = -1982016298,
                this.Ch = 502970286,
                this.Cl = 855612546,
                this.Dh = 1738396948,
                this.Dl = 1479516111,
                this.Eh = 258812777,
                this.El = 2077511080,
                this.Fh = 2011393907,
                this.Fl = 79989058,
                this.Gh = 1067287976,
                this.Gl = 1780299464,
                this.Hh = 286451373,
                this.Hl = -1848208735,
                this.outputLen = 28
            }
        }
        class Z extends J {
            constructor() {
                super(),
                this.Ah = 573645204,
                this.Al = -64227540,
                this.Bh = -1621794909,
                this.Bl = -934517566,
                this.Ch = 596883563,
                this.Cl = 1867755857,
                this.Dh = -1774684391,
                this.Dl = 1497426621,
                this.Eh = -1775747358,
                this.El = -1467023389,
                this.Fh = -1101128155,
                this.Fl = 1401305490,
                this.Gh = 721525244,
                this.Gl = 746961066,
                this.Hh = 246885852,
                this.Hl = -2117784414,
                this.outputLen = 32
            }
        }
        class Q extends J {
            constructor() {
                super(),
                this.Ah = -876896931,
                this.Al = -1056596264,
                this.Bh = 1654270250,
                this.Bl = 914150663,
                this.Ch = -1856437926,
                this.Cl = 812702999,
                this.Dh = 355462360,
                this.Dl = -150054599,
                this.Eh = 1731405415,
                this.El = -4191439,
                this.Fh = -1900787065,
                this.Fl = 1750603025,
                this.Gh = -619958771,
                this.Gl = 1694076839,
                this.Hh = 1203062813,
                this.Hl = -1090891868,
                this.outputLen = 48
            }
        }
        const tt = l((()=>new J));
        l((()=>new X)),
        l((()=>new Z)),
        l((()=>new Q));
        var et = n(26925);
        n(107);
        var nt = Object.defineProperty
          , rt = Object.getOwnPropertyDescriptor
          , it = (t,e)=>{
            for (var n in e)
                nt(t, n, {
                    get: e[n],
                    enumerable: !0
                })
        }
          , st = (t,e,n,r)=>{
            for (var i, s = r > 1 ? void 0 : r ? rt(e, n) : e, o = t.length - 1; o >= 0; o--)
                (i = t[o]) && (s = (r ? i(e, n, s) : i(s)) || s);
            return r && s && nt(e, n, s),
            s
        }
          , ot = /^m(\/[0-9]+')+$/
          , at = t=>t.replace("'", "")
          , ct = function(t, e) {
            let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2147483648;
            if (!(t=>!!ot.test(t) && !t.split("/").slice(1).map(at).some(Number.isNaN))(t))
                throw new Error("Invalid derivation path");
            const {key: r, chainCode: i} = (t=>{
                const e = G.create(tt, "ed25519 seed").update(a(t)).digest();
                return {
                    key: e.slice(0, 32),
                    chainCode: e.slice(32)
                }
            }
            )(e);
            return t.split("/").slice(1).map(at).map((t=>parseInt(t, 10))).reduce(((t,e)=>((t,e)=>{
                let {key: n, chainCode: r} = t;
                const i = new ArrayBuffer(4);
                new DataView(i).setUint32(0, e);
                const s = new Uint8Array(i)
                  , o = new Uint8Array([0])
                  , a = new Uint8Array([...o, ...n, ...s])
                  , c = G.create(tt, r).update(a).digest();
                return {
                    key: c.slice(0, 32),
                    chainCode: c.slice(32)
                }
            }
            )(t, e + n)), {
                key: r,
                chainCode: i
            })
        }
          , ut = "1.20.0";
        async function lt(t) {
            return new Promise((e=>{
                setTimeout(e, t)
            }
            ))
        }
        var ht = 2e5
          , dt = "0x1::aptos_coin::AptosCoin";
        "aptos-ts-sdk/".concat(ut);
        function ft(t) {
            let e, n, r;
            return "object" === typeof t ? (e = t.hashFunction,
            n = t.ttlMs,
            r = t.tags) : e = t,
            (t,i,s)=>{
                if (null != s.value)
                    s.value = gt(s.value, e, n, r);
                else {
                    if (null == s.get)
                        throw new Error("Only put a Memoize() decorator on a method or get accessor.");
                    s.get = gt(s.get, e, n, r)
                }
            }
        }
        function pt(t, e) {
            return ft({
                ttlMs: t,
                hashFunction: e
            })
        }
        var yt = new Map;
        function gt(t, e) {
            let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0
              , r = arguments.length > 3 ? arguments[3] : void 0;
            const i = Symbol("__memoized_map__");
            return function() {
                let s;
                const o = this;
                o.hasOwnProperty(i) || Object.defineProperty(o, i, {
                    configurable: !1,
                    enumerable: !1,
                    writable: !1,
                    value: new Map
                });
                const a = o[i];
                if (Array.isArray(r))
                    for (const t of r)
                        yt.has(t) ? yt.get(t).push(a) : yt.set(t, [a]);
                for (var c = arguments.length, u = new Array(c), l = 0; l < c; l++)
                    u[l] = arguments[l];
                if (e || u.length > 0 || n > 0) {
                    let r;
                    r = !0 === e ? u.map((t=>t.toString())).join("!") : e ? e.apply(o, u) : u[0];
                    const i = "".concat(r, "__timestamp");
                    let c = !1;
                    if (n > 0)
                        if (a.has(i)) {
                            const t = a.get(i);
                            c = Date.now() - t > n
                        } else
                            c = !0;
                    a.has(r) && !c ? s = a.get(r) : (s = t.apply(o, u),
                    a.set(r, s),
                    n > 0 && a.set(i, Date.now()))
                } else {
                    const e = o;
                    a.has(e) ? s = a.get(e) : (s = t.apply(o, u),
                    a.set(e, s))
                }
                return s
            }
        }
        var wt = class extends Error {
            constructor(t, e, n) {
                super(n),
                this.name = "AptosApiError",
                this.url = e.url,
                this.status = e.status,
                this.statusText = e.statusText,
                this.data = e.data,
                this.request = t
            }
        }
          , bt = {
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            429: "Too Many Requests",
            500: "Internal Server Error",
            502: "Bad Gateway",
            503: "Service Unavailable"
        };
        async function _t(t, e, n, r, i, s) {
            const o = {
                ...null == s ? void 0 : s.HEADERS,
                "x-aptos-client": "aptos-ts-sdk/".concat(ut),
                "content-type": null != r ? r : "application/json"
            };
            (null == s ? void 0 : s.TOKEN) && (o.Authorization = "Bearer ".concat(null == s ? void 0 : s.TOKEN));
            const a = await async function(t) {
                var e;
                const {params: n, method: r, url: i, headers: s, body: o, overrides: a} = t
                  , c = {
                    headers: s,
                    method: r,
                    url: i,
                    params: n,
                    data: o,
                    withCredentials: null == (e = null == a ? void 0 : a.WITH_CREDENTIALS) || e
                };
                try {
                    const t = await et(c);
                    return {
                        status: t.status,
                        statusText: t.statusText,
                        data: t.data,
                        headers: t.headers,
                        config: t.config
                    }
                } catch (u) {
                    const t = u;
                    if (t.response)
                        return t.response;
                    throw u
                }
            }({
                url: t,
                method: e,
                body: n,
                params: i,
                headers: o,
                overrides: s
            });
            return a
        }
        async function vt(t) {
            const {url: e, endpoint: n, method: r, body: i, contentType: s, params: o, overrides: a} = t
              , c = "".concat(e, "/").concat(null != n ? n : "")
              , u = await _t(c, r, i, s, o, a)
              , l = {
                status: u.status,
                statusText: u.statusText,
                data: u.data,
                headers: u.headers,
                config: u.config,
                url: c
            };
            if (l.status >= 200 && l.status < 300)
                return l;
            const h = bt[l.status];
            throw new wt(t,l,null != h ? h : "Generic Error")
        }
        async function mt(t) {
            return await vt({
                ...t,
                method: "GET"
            })
        }
        async function At(t) {
            return await vt({
                ...t,
                method: "POST"
            })
        }
        async function Et(t) {
            const e = [];
            let n;
            const r = t.params;
            for (; ; ) {
                r.start = n;
                const i = await mt({
                    url: t.url,
                    endpoint: t.endpoint,
                    params: r,
                    originMethod: t.originMethod,
                    overrides: t.overrides
                });
                if (n = i.headers["x-aptos-cursor"],
                delete i.headers,
                e.push(...i.data),
                null === n || void 0 === n)
                    break
            }
            return e
        }
        var xt = {
            mainnet: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
            testnet: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
            devnet: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql"
        }
          , Ut = {
            mainnet: "https://fullnode.mainnet.aptoslabs.com/v1",
            testnet: "https://fullnode.testnet.aptoslabs.com/v1",
            devnet: "https://fullnode.devnet.aptoslabs.com/v1",
            local: "http://localhost:8080/v1"
        }
          , Bt = class {
            static fromBuffer(t) {
                return Bt.fromUint8Array(t)
            }
            static fromUint8Array(t) {
                return new Bt(o(t))
            }
            static ensure(t) {
                return "string" === typeof t ? new Bt(t) : t
            }
            constructor(t) {
                t.startsWith("0x") ? this.hexString = t : this.hexString = "0x".concat(t)
            }
            hex() {
                return this.hexString
            }
            noPrefix() {
                return this.hexString.slice(2)
            }
            toString() {
                return this.hex()
            }
            toShortString() {
                const t = this.hexString.replace(/^0x0*/, "");
                return "0x".concat(t)
            }
            toUint8Array() {
                return Uint8Array.from(a(this.noPrefix()))
            }
        }
          , Tt = {};
        it(Tt, {
            AccountAddress: ()=>Xt,
            AccountAuthenticator: ()=>le,
            AccountAuthenticatorEd25519: ()=>he,
            AccountAuthenticatorMultiEd25519: ()=>de,
            ArgumentABI: ()=>pn,
            AuthenticationKey: ()=>_n,
            ChainId: ()=>Qe,
            ChangeSet: ()=>je,
            Ed25519PublicKey: ()=>Qt,
            Ed25519Signature: ()=>ee,
            EntryFunction: ()=>De,
            EntryFunctionABI: ()=>wn,
            FeePayerRawTransaction: ()=>We,
            Identifier: ()=>fe,
            Module: ()=>Fe,
            ModuleId: ()=>qe,
            MultiAgentRawTransaction: ()=>Ve,
            MultiEd25519PublicKey: ()=>ne,
            MultiEd25519Signature: ()=>ie,
            MultiSig: ()=>Me,
            MultiSigTransactionPayload: ()=>Pe,
            RawTransaction: ()=>Ne,
            RawTransactionWithData: ()=>Ke,
            RotationProofChallenge: ()=>vn,
            Script: ()=>He,
            ScriptABI: ()=>yn,
            SignedTransaction: ()=>Ge,
            StructTag: ()=>Be,
            Transaction: ()=>hn,
            TransactionArgument: ()=>tn,
            TransactionArgumentAddress: ()=>cn,
            TransactionArgumentBool: ()=>ln,
            TransactionArgumentU128: ()=>on,
            TransactionArgumentU16: ()=>nn,
            TransactionArgumentU256: ()=>an,
            TransactionArgumentU32: ()=>rn,
            TransactionArgumentU64: ()=>sn,
            TransactionArgumentU8: ()=>en,
            TransactionArgumentU8Vector: ()=>un,
            TransactionAuthenticator: ()=>se,
            TransactionAuthenticatorEd25519: ()=>oe,
            TransactionAuthenticatorFeePayer: ()=>ue,
            TransactionAuthenticatorMultiAgent: ()=>ce,
            TransactionAuthenticatorMultiEd25519: ()=>ae,
            TransactionPayload: ()=>Ye,
            TransactionPayloadEntryFunction: ()=>Xe,
            TransactionPayloadMultisig: ()=>Ze,
            TransactionPayloadScript: ()=>Je,
            TransactionScriptABI: ()=>gn,
            TypeArgumentABI: ()=>fn,
            TypeTag: ()=>pe,
            TypeTagAddress: ()=>Ae,
            TypeTagBool: ()=>ye,
            TypeTagParser: ()=>Oe,
            TypeTagParserError: ()=>Re,
            TypeTagSigner: ()=>Ee,
            TypeTagStruct: ()=>Ue,
            TypeTagU128: ()=>ve,
            TypeTagU16: ()=>we,
            TypeTagU256: ()=>me,
            TypeTagU32: ()=>be,
            TypeTagU64: ()=>_e,
            TypeTagU8: ()=>ge,
            TypeTagVector: ()=>xe,
            UserTransaction: ()=>dn,
            WriteSet: ()=>$e,
            objectStructTag: ()=>ze,
            optionStructTag: ()=>Se,
            stringStructTag: ()=>Te
        });
        var St = {};
        it(St, {
            Deserializer: ()=>Rt,
            Serializer: ()=>Ct,
            bcsSerializeBool: ()=>Kt,
            bcsSerializeBytes: ()=>Wt,
            bcsSerializeFixedBytes: ()=>Yt,
            bcsSerializeStr: ()=>Vt,
            bcsSerializeU128: ()=>$t,
            bcsSerializeU16: ()=>qt,
            bcsSerializeU256: ()=>Gt,
            bcsSerializeU32: ()=>jt,
            bcsSerializeU8: ()=>Ft,
            bcsSerializeUint64: ()=>Mt,
            bcsToBytes: ()=>Pt,
            deserializeVector: ()=>Dt,
            serializeVector: ()=>Nt,
            serializeVectorWithFunc: ()=>Ht
        });
        var zt = 2 ** 32 - 1
          , kt = BigInt(2 ** 64) - BigInt(1)
          , It = BigInt(2 ** 128) - BigInt(1)
          , Lt = BigInt(2 ** 256) - BigInt(1)
          , Ct = class {
            constructor() {
                this.buffer = new ArrayBuffer(64),
                this.offset = 0
            }
            ensureBufferWillHandleSize(t) {
                for (; this.buffer.byteLength < this.offset + t; ) {
                    const t = new ArrayBuffer(2 * this.buffer.byteLength);
                    new Uint8Array(t).set(new Uint8Array(this.buffer)),
                    this.buffer = t
                }
            }
            serialize(t) {
                this.ensureBufferWillHandleSize(t.length),
                new Uint8Array(this.buffer,this.offset).set(t),
                this.offset += t.length
            }
            serializeWithFunction(t, e, n) {
                this.ensureBufferWillHandleSize(e);
                const r = new DataView(this.buffer,this.offset);
                t.apply(r, [0, n, !0]),
                this.offset += e
            }
            serializeStr(t) {
                const e = new TextEncoder;
                this.serializeBytes(e.encode(t))
            }
            serializeBytes(t) {
                this.serializeU32AsUleb128(t.length),
                this.serialize(t)
            }
            serializeFixedBytes(t) {
                this.serialize(t)
            }
            serializeBool(t) {
                if ("boolean" !== typeof t)
                    throw new Error("Value needs to be a boolean");
                const e = t ? 1 : 0;
                this.serialize(new Uint8Array([e]))
            }
            serializeU8(t) {
                this.serialize(new Uint8Array([t]))
            }
            serializeU16(t) {
                this.serializeWithFunction(DataView.prototype.setUint16, 2, t)
            }
            serializeU32(t) {
                this.serializeWithFunction(DataView.prototype.setUint32, 4, t)
            }
            serializeU64(t) {
                const e = BigInt(t.toString()) & BigInt(zt)
                  , n = BigInt(t.toString()) >> BigInt(32);
                this.serializeU32(Number(e)),
                this.serializeU32(Number(n))
            }
            serializeU128(t) {
                const e = BigInt(t.toString()) & kt
                  , n = BigInt(t.toString()) >> BigInt(64);
                this.serializeU64(e),
                this.serializeU64(n)
            }
            serializeU256(t) {
                const e = BigInt(t.toString()) & It
                  , n = BigInt(t.toString()) >> BigInt(128);
                this.serializeU128(e),
                this.serializeU128(n)
            }
            serializeU32AsUleb128(t) {
                let e = t;
                const n = [];
                for (; e >>> 7 !== 0; )
                    n.push(127 & e | 128),
                    e >>>= 7;
                n.push(e),
                this.serialize(new Uint8Array(n))
            }
            getBytes() {
                return new Uint8Array(this.buffer).slice(0, this.offset)
            }
        }
        ;
        function Ot(t, e, n) {
            return (r,i,s)=>{
                const o = s.value;
                return s.value = function(r) {
                    const i = BigInt(r.toString());
                    if (i > BigInt(e.toString()) || i < BigInt(t.toString()))
                        throw new Error(n || "Value is out of range");
                    o.apply(this, [r])
                }
                ,
                s
            }
        }
        st([Ot(0, 255)], Ct.prototype, "serializeU8", 1),
        st([Ot(0, 65535)], Ct.prototype, "serializeU16", 1),
        st([Ot(0, zt)], Ct.prototype, "serializeU32", 1),
        st([Ot(BigInt(0), kt)], Ct.prototype, "serializeU64", 1),
        st([Ot(BigInt(0), It)], Ct.prototype, "serializeU128", 1),
        st([Ot(BigInt(0), Lt)], Ct.prototype, "serializeU256", 1),
        st([Ot(0, zt)], Ct.prototype, "serializeU32AsUleb128", 1);
        var Rt = class {
            constructor(t) {
                this.buffer = new ArrayBuffer(t.length),
                new Uint8Array(this.buffer).set(t, 0),
                this.offset = 0
            }
            read(t) {
                if (this.offset + t > this.buffer.byteLength)
                    throw new Error("Reached to the end of buffer");
                const e = this.buffer.slice(this.offset, this.offset + t);
                return this.offset += t,
                e
            }
            deserializeStr() {
                const t = this.deserializeBytes();
                return (new TextDecoder).decode(t)
            }
            deserializeBytes() {
                const t = this.deserializeUleb128AsU32();
                return new Uint8Array(this.read(t))
            }
            deserializeFixedBytes(t) {
                return new Uint8Array(this.read(t))
            }
            deserializeBool() {
                const t = new Uint8Array(this.read(1))[0];
                if (1 !== t && 0 !== t)
                    throw new Error("Invalid boolean value");
                return 1 === t
            }
            deserializeU8() {
                return new DataView(this.read(1)).getUint8(0)
            }
            deserializeU16() {
                return new DataView(this.read(2)).getUint16(0, !0)
            }
            deserializeU32() {
                return new DataView(this.read(4)).getUint32(0, !0)
            }
            deserializeU64() {
                const t = this.deserializeU32()
                  , e = this.deserializeU32();
                return BigInt(BigInt(e) << BigInt(32) | BigInt(t))
            }
            deserializeU128() {
                const t = this.deserializeU64()
                  , e = this.deserializeU64();
                return BigInt(e << BigInt(64) | t)
            }
            deserializeU256() {
                const t = this.deserializeU128()
                  , e = this.deserializeU128();
                return BigInt(e << BigInt(128) | t)
            }
            deserializeUleb128AsU32() {
                let t = BigInt(0)
                  , e = 0;
                for (; t < zt; ) {
                    const n = this.deserializeU8();
                    if (t |= BigInt(127 & n) << BigInt(e),
                    0 === (128 & n))
                        break;
                    e += 7
                }
                if (t > zt)
                    throw new Error("Overflow while parsing uleb128-encoded uint32 value");
                return Number(t)
            }
        }
        ;
        function Nt(t, e) {
            e.serializeU32AsUleb128(t.length),
            t.forEach((t=>{
                t.serialize(e)
            }
            ))
        }
        function Ht(t, e) {
            const n = new Ct;
            n.serializeU32AsUleb128(t.length);
            const r = n[e];
            return t.forEach((t=>{
                r.call(n, t)
            }
            )),
            n.getBytes()
        }
        function Dt(t, e) {
            const n = t.deserializeUleb128AsU32()
              , r = [];
            for (let i = 0; i < n; i += 1)
                r.push(e.deserialize(t));
            return r
        }
        function Pt(t) {
            const e = new Ct;
            return t.serialize(e),
            e.getBytes()
        }
        function Mt(t) {
            const e = new Ct;
            return e.serializeU64(t),
            e.getBytes()
        }
        function Ft(t) {
            const e = new Ct;
            return e.serializeU8(t),
            e.getBytes()
        }
        function qt(t) {
            const e = new Ct;
            return e.serializeU16(t),
            e.getBytes()
        }
        function jt(t) {
            const e = new Ct;
            return e.serializeU32(t),
            e.getBytes()
        }
        function $t(t) {
            const e = new Ct;
            return e.serializeU128(t),
            e.getBytes()
        }
        function Gt(t) {
            const e = new Ct;
            return e.serializeU256(t),
            e.getBytes()
        }
        function Kt(t) {
            const e = new Ct;
            return e.serializeBool(t),
            e.getBytes()
        }
        function Vt(t) {
            const e = new Ct;
            return e.serializeStr(t),
            e.getBytes()
        }
        function Wt(t) {
            const e = new Ct;
            return e.serializeBytes(t),
            e.getBytes()
        }
        function Yt(t) {
            const e = new Ct;
            return e.serializeFixedBytes(t),
            e.getBytes()
        }
        var Jt = class {
            constructor(t) {
                if (t.length !== Jt.LENGTH)
                    throw new Error("Expected address of length 32");
                this.address = t
            }
            static fromHex(t) {
                let e = Bt.ensure(t);
                e.noPrefix().length % 2 !== 0 && (e = new Bt("0".concat(e.noPrefix())));
                const n = e.toUint8Array();
                if (n.length > Jt.LENGTH)
                    throw new Error("Hex string is too long. Address's length is 32 bytes.");
                if (n.length === Jt.LENGTH)
                    return new Jt(n);
                const r = new Uint8Array(Jt.LENGTH);
                return r.set(n, Jt.LENGTH - n.length),
                new Jt(r)
            }
            static isValid(t) {
                if ("" === t)
                    return !1;
                let e = Bt.ensure(t);
                e.noPrefix().length % 2 !== 0 && (e = new Bt("0".concat(e.noPrefix())));
                return e.toUint8Array().length <= Jt.LENGTH
            }
            toHexString() {
                return Bt.fromUint8Array(this.address).hex()
            }
            serialize(t) {
                t.serializeFixedBytes(this.address)
            }
            static deserialize(t) {
                return new Jt(t.deserializeFixedBytes(Jt.LENGTH))
            }
            static standardizeAddress(t) {
                const e = t.toLowerCase()
                  , n = (e.startsWith("0x") ? e.slice(2) : e).padStart(64, "0");
                return "0x".concat(n)
            }
        }
          , Xt = Jt;
        Xt.LENGTH = 32,
        Xt.CORE_CODE_ADDRESS = Jt.fromHex("0x1");
        var Zt = class {
            constructor(t) {
                if (t.length !== Zt.LENGTH)
                    throw new Error("Ed25519PublicKey length should be ".concat(Zt.LENGTH));
                this.value = t
            }
            toBytes() {
                return this.value
            }
            serialize(t) {
                t.serializeBytes(this.value)
            }
            static deserialize(t) {
                const e = t.deserializeBytes();
                return new Zt(e)
            }
        }
          , Qt = Zt;
        Qt.LENGTH = 32;
        var te = class {
            constructor(t) {
                if (this.value = t,
                t.length !== te.LENGTH)
                    throw new Error("Ed25519Signature length should be ".concat(te.LENGTH))
            }
            serialize(t) {
                t.serializeBytes(this.value)
            }
            static deserialize(t) {
                const e = t.deserializeBytes();
                return new te(e)
            }
        }
          , ee = te;
        ee.LENGTH = 64;
        var ne = class {
            constructor(t, e) {
                if (this.public_keys = t,
                this.threshold = e,
                e > 32)
                    throw new Error('"threshold" cannot be larger than '.concat(32))
            }
            toBytes() {
                const t = new Uint8Array(this.public_keys.length * Qt.LENGTH + 1);
                return this.public_keys.forEach(((e,n)=>{
                    t.set(e.value, n * Qt.LENGTH)
                }
                )),
                t[this.public_keys.length * Qt.LENGTH] = this.threshold,
                t
            }
            serialize(t) {
                t.serializeBytes(this.toBytes())
            }
            static deserialize(t) {
                const e = t.deserializeBytes()
                  , n = e[e.length - 1]
                  , r = [];
                for (let i = 0; i < e.length - 1; i += Qt.LENGTH) {
                    const t = i;
                    r.push(new Qt(e.subarray(t, t + Qt.LENGTH)))
                }
                return new ne(r,n)
            }
        }
          , re = class {
            constructor(t, e) {
                if (this.signatures = t,
                this.bitmap = e,
                e.length !== re.BITMAP_LEN)
                    throw new Error('"bitmap" length should be '.concat(re.BITMAP_LEN))
            }
            toBytes() {
                const t = new Uint8Array(this.signatures.length * ee.LENGTH + re.BITMAP_LEN);
                return this.signatures.forEach(((e,n)=>{
                    t.set(e.value, n * ee.LENGTH)
                }
                )),
                t.set(this.bitmap, this.signatures.length * ee.LENGTH),
                t
            }
            static createBitmap(t) {
                const e = new Uint8Array([0, 0, 0, 0])
                  , n = new Set;
                return t.forEach((t=>{
                    if (t >= 32)
                        throw new Error("Invalid bit value ".concat(t, "."));
                    if (n.has(t))
                        throw new Error("Duplicated bits detected.");
                    n.add(t);
                    const r = Math.floor(t / 8);
                    let i = e[r];
                    i |= 128 >> t % 8,
                    e[r] = i
                }
                )),
                e
            }
            serialize(t) {
                t.serializeBytes(this.toBytes())
            }
            static deserialize(t) {
                const e = t.deserializeBytes()
                  , n = e.subarray(e.length - 4)
                  , r = [];
                for (let i = 0; i < e.length - n.length; i += ee.LENGTH) {
                    const t = i;
                    r.push(new ee(e.subarray(t, t + ee.LENGTH)))
                }
                return new re(r,n)
            }
        }
          , ie = re;
        ie.BITMAP_LEN = 4;
        var se = class {
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                switch (e) {
                case 0:
                    return oe.load(t);
                case 1:
                    return ae.load(t);
                case 2:
                    return ce.load(t);
                case 3:
                    return ue.load(t);
                default:
                    throw new Error("Unknown variant index for TransactionAuthenticator: ".concat(e))
                }
            }
        }
          , oe = class extends se {
            constructor(t, e) {
                super(),
                this.public_key = t,
                this.signature = e
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                this.public_key.serialize(t),
                this.signature.serialize(t)
            }
            static load(t) {
                const e = Qt.deserialize(t)
                  , n = ee.deserialize(t);
                return new oe(e,n)
            }
        }
          , ae = class extends se {
            constructor(t, e) {
                super(),
                this.public_key = t,
                this.signature = e
            }
            serialize(t) {
                t.serializeU32AsUleb128(1),
                this.public_key.serialize(t),
                this.signature.serialize(t)
            }
            static load(t) {
                const e = ne.deserialize(t)
                  , n = ie.deserialize(t);
                return new ae(e,n)
            }
        }
          , ce = class extends se {
            constructor(t, e, n) {
                super(),
                this.sender = t,
                this.secondary_signer_addresses = e,
                this.secondary_signers = n
            }
            serialize(t) {
                t.serializeU32AsUleb128(2),
                this.sender.serialize(t),
                Nt(this.secondary_signer_addresses, t),
                Nt(this.secondary_signers, t)
            }
            static load(t) {
                const e = le.deserialize(t)
                  , n = Dt(t, Xt)
                  , r = Dt(t, le);
                return new ce(e,n,r)
            }
        }
          , ue = class extends se {
            constructor(t, e, n, r) {
                super(),
                this.sender = t,
                this.secondary_signer_addresses = e,
                this.secondary_signers = n,
                this.fee_payer = r
            }
            serialize(t) {
                t.serializeU32AsUleb128(3),
                this.sender.serialize(t),
                Nt(this.secondary_signer_addresses, t),
                Nt(this.secondary_signers, t),
                this.fee_payer.address.serialize(t),
                this.fee_payer.authenticator.serialize(t)
            }
            static load(t) {
                const e = le.deserialize(t)
                  , n = Dt(t, Xt)
                  , r = Dt(t, le)
                  , i = Xt.deserialize(t)
                  , s = le.deserialize(t);
                return new ue(e,n,r,{
                    address: i,
                    authenticator: s
                })
            }
        }
          , le = class {
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                switch (e) {
                case 0:
                    return he.load(t);
                case 1:
                    return de.load(t);
                default:
                    throw new Error("Unknown variant index for AccountAuthenticator: ".concat(e))
                }
            }
        }
          , he = class extends le {
            constructor(t, e) {
                super(),
                this.public_key = t,
                this.signature = e
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                this.public_key.serialize(t),
                this.signature.serialize(t)
            }
            static load(t) {
                const e = Qt.deserialize(t)
                  , n = ee.deserialize(t);
                return new he(e,n)
            }
        }
          , de = class extends le {
            constructor(t, e) {
                super(),
                this.public_key = t,
                this.signature = e
            }
            serialize(t) {
                t.serializeU32AsUleb128(1),
                this.public_key.serialize(t),
                this.signature.serialize(t)
            }
            static load(t) {
                const e = ne.deserialize(t)
                  , n = ie.deserialize(t);
                return new de(e,n)
            }
        }
          , fe = class {
            constructor(t) {
                this.value = t
            }
            serialize(t) {
                t.serializeStr(this.value)
            }
            static deserialize(t) {
                const e = t.deserializeStr();
                return new fe(e)
            }
        }
          , pe = class {
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                switch (e) {
                case 0:
                    return ye.load(t);
                case 1:
                    return ge.load(t);
                case 2:
                    return _e.load(t);
                case 3:
                    return ve.load(t);
                case 4:
                    return Ae.load(t);
                case 5:
                    return Ee.load(t);
                case 6:
                    return xe.load(t);
                case 7:
                    return Ue.load(t);
                case 8:
                    return we.load(t);
                case 9:
                    return be.load(t);
                case 10:
                    return me.load(t);
                default:
                    throw new Error("Unknown variant index for TypeTag: ".concat(e))
                }
            }
        }
          , ye = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(0)
            }
            static load(t) {
                return new ye
            }
        }
          , ge = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(1)
            }
            static load(t) {
                return new ge
            }
        }
          , we = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(8)
            }
            static load(t) {
                return new we
            }
        }
          , be = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(9)
            }
            static load(t) {
                return new be
            }
        }
          , _e = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(2)
            }
            static load(t) {
                return new _e
            }
        }
          , ve = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(3)
            }
            static load(t) {
                return new ve
            }
        }
          , me = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(10)
            }
            static load(t) {
                return new me
            }
        }
          , Ae = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(4)
            }
            static load(t) {
                return new Ae
            }
        }
          , Ee = class extends pe {
            serialize(t) {
                t.serializeU32AsUleb128(5)
            }
            static load(t) {
                return new Ee
            }
        }
          , xe = class extends pe {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(6),
                this.value.serialize(t)
            }
            static load(t) {
                const e = pe.deserialize(t);
                return new xe(e)
            }
        }
          , Ue = class extends pe {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(7),
                this.value.serialize(t)
            }
            static load(t) {
                const e = Be.deserialize(t);
                return new Ue(e)
            }
            isStringTypeTag() {
                return "string" === this.value.module_name.value && "String" === this.value.name.value && this.value.address.toHexString() === Xt.CORE_CODE_ADDRESS.toHexString()
            }
        }
          , Be = class {
            constructor(t, e, n, r) {
                this.address = t,
                this.module_name = e,
                this.name = n,
                this.type_args = r
            }
            static fromString(t) {
                const e = new Oe(t).parseTypeTag();
                return new Be(e.value.address,e.value.module_name,e.value.name,e.value.type_args)
            }
            serialize(t) {
                this.address.serialize(t),
                this.module_name.serialize(t),
                this.name.serialize(t),
                Nt(this.type_args, t)
            }
            static deserialize(t) {
                const e = Xt.deserialize(t)
                  , n = fe.deserialize(t)
                  , r = fe.deserialize(t)
                  , i = Dt(t, pe);
                return new Be(e,n,r,i)
            }
        }
          , Te = new Be(Xt.fromHex("0x1"),new fe("string"),new fe("String"),[]);
        function Se(t) {
            return new Be(Xt.fromHex("0x1"),new fe("option"),new fe("Option"),[t])
        }
        function ze(t) {
            return new Be(Xt.fromHex("0x1"),new fe("object"),new fe("Object"),[t])
        }
        function ke(t) {
            throw new Re(t)
        }
        function Ie(t) {
            return !!t.match(/\s/)
        }
        function Le(t) {
            return !!t.match(/[_A-Za-z0-9]/g)
        }
        function Ce(t, e) {
            const n = t[e];
            if (":" === n) {
                if ("::" === t.slice(e, e + 2))
                    return [["COLON", "::"], 2];
                ke("Unrecognized token.")
            } else {
                if ("<" === n)
                    return [["LT", "<"], 1];
                if (">" === n)
                    return [["GT", ">"], 1];
                if ("," === n)
                    return [["COMMA", ","], 1];
                if (Ie(n)) {
                    let n = "";
                    for (let r = e; r < t.length; r += 1) {
                        const e = t[r];
                        if (!Ie(e))
                            break;
                        n = "".concat(n).concat(e)
                    }
                    return [["SPACE", n], n.length]
                }
                if (Le(n)) {
                    let n = "";
                    for (let r = e; r < t.length; r += 1) {
                        const e = t[r];
                        if (!Le(e))
                            break;
                        n = "".concat(n).concat(e)
                    }
                    return function(t) {
                        return !!t.match(/T\d+/g)
                    }(n) ? [["GENERIC", n], n.length] : [["IDENT", n], n.length]
                }
            }
            throw new Error("Unrecognized token.")
        }
        var Oe = class {
            constructor(t, e) {
                this.typeTags = [],
                this.tokens = function(t) {
                    let e = 0;
                    const n = [];
                    for (; e < t.length; ) {
                        const [r,i] = Ce(t, e);
                        "SPACE" !== r[0] && n.push(r),
                        e += i
                    }
                    return n
                }(t),
                this.typeTags = e || []
            }
            consume(t) {
                const e = this.tokens.shift();
                e && e[1] === t || ke("Invalid type tag.")
            }
            consumeWholeGeneric() {
                for (this.consume("<"); ">" !== this.tokens[0][1]; )
                    "<" === this.tokens[0][1] && this.consumeWholeGeneric(),
                    this.tokens.shift();
                this.consume(">")
            }
            parseCommaList(t, e) {
                const n = [];
                for (this.tokens.length <= 0 && ke("Invalid type tag."); this.tokens[0][1] !== t && (n.push(this.parseTypeTag()),
                !(this.tokens.length > 0 && this.tokens[0][1] === t)) && (this.consume(","),
                !(this.tokens.length > 0 && this.tokens[0][1] === t && e)); )
                    this.tokens.length <= 0 && ke("Invalid type tag.");
                return n
            }
            parseTypeTag() {
                0 === this.tokens.length && ke("Invalid type tag.");
                const [t,e] = this.tokens.shift();
                if ("u8" === e)
                    return new ge;
                if ("u16" === e)
                    return new we;
                if ("u32" === e)
                    return new be;
                if ("u64" === e)
                    return new _e;
                if ("u128" === e)
                    return new ve;
                if ("u256" === e)
                    return new me;
                if ("bool" === e)
                    return new ye;
                if ("address" === e)
                    return new Ae;
                if ("vector" === e) {
                    this.consume("<");
                    const t = this.parseTypeTag();
                    return this.consume(">"),
                    new xe(t)
                }
                if ("string" === e)
                    return new Ue(Te);
                if ("IDENT" === t && (e.startsWith("0x") || e.startsWith("0X"))) {
                    const t = Xt.fromHex(e);
                    this.consume("::");
                    const [n,r] = this.tokens.shift();
                    "IDENT" !== n && ke("Invalid type tag."),
                    this.consume("::");
                    const [i,s] = this.tokens.shift();
                    if ("IDENT" !== i && ke("Invalid type tag."),
                    Xt.CORE_CODE_ADDRESS.toHexString() === t.toHexString() && "object" === r && "Object" === s)
                        return this.consumeWholeGeneric(),
                        new Ae;
                    let o = [];
                    this.tokens.length > 0 && "<" === this.tokens[0][1] && (this.consume("<"),
                    o = this.parseCommaList(">", !0),
                    this.consume(">"));
                    const a = new Be(t,new fe(r),new fe(s),o);
                    return new Ue(a)
                }
                if ("GENERIC" === t) {
                    0 === this.typeTags.length && ke("Can't convert generic type since no typeTags were specified.");
                    const t = parseInt(e.substring(1), 10);
                    return new Oe(this.typeTags[t]).parseTypeTag()
                }
                throw new Error("Invalid type tag.")
            }
        }
          , Re = class extends Error {
            constructor(t) {
                super(t),
                this.name = "TypeTagParserError"
            }
        }
          , Ne = class {
            constructor(t, e, n, r, i, s, o) {
                this.sender = t,
                this.sequence_number = e,
                this.payload = n,
                this.max_gas_amount = r,
                this.gas_unit_price = i,
                this.expiration_timestamp_secs = s,
                this.chain_id = o
            }
            serialize(t) {
                this.sender.serialize(t),
                t.serializeU64(this.sequence_number),
                this.payload.serialize(t),
                t.serializeU64(this.max_gas_amount),
                t.serializeU64(this.gas_unit_price),
                t.serializeU64(this.expiration_timestamp_secs),
                this.chain_id.serialize(t)
            }
            static deserialize(t) {
                const e = Xt.deserialize(t)
                  , n = t.deserializeU64()
                  , r = Ye.deserialize(t)
                  , i = t.deserializeU64()
                  , s = t.deserializeU64()
                  , o = t.deserializeU64()
                  , a = Qe.deserialize(t);
                return new Ne(e,n,r,i,s,o,a)
            }
        }
          , He = class {
            constructor(t, e, n) {
                this.code = t,
                this.ty_args = e,
                this.args = n
            }
            serialize(t) {
                t.serializeBytes(this.code),
                Nt(this.ty_args, t),
                Nt(this.args, t)
            }
            static deserialize(t) {
                const e = t.deserializeBytes()
                  , n = Dt(t, pe)
                  , r = Dt(t, tn);
                return new He(e,n,r)
            }
        }
          , De = class {
            constructor(t, e, n, r) {
                this.module_name = t,
                this.function_name = e,
                this.ty_args = n,
                this.args = r
            }
            static natural(t, e, n, r) {
                return new De(qe.fromStr(t),new fe(e),n,r)
            }
            static natual(t, e, n, r) {
                return De.natural(t, e, n, r)
            }
            serialize(t) {
                this.module_name.serialize(t),
                this.function_name.serialize(t),
                Nt(this.ty_args, t),
                t.serializeU32AsUleb128(this.args.length),
                this.args.forEach((e=>{
                    t.serializeBytes(e)
                }
                ))
            }
            static deserialize(t) {
                const e = qe.deserialize(t)
                  , n = fe.deserialize(t)
                  , r = Dt(t, pe)
                  , i = t.deserializeUleb128AsU32()
                  , s = [];
                for (let o = 0; o < i; o += 1)
                    s.push(t.deserializeBytes());
                return new De(e,n,r,s)
            }
        }
          , Pe = class {
            constructor(t) {
                this.transaction_payload = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                this.transaction_payload.serialize(t)
            }
            static deserialize(t) {
                return t.deserializeUleb128AsU32(),
                new Pe(De.deserialize(t))
            }
        }
          , Me = class {
            constructor(t, e) {
                this.multisig_address = t,
                this.transaction_payload = e
            }
            serialize(t) {
                this.multisig_address.serialize(t),
                void 0 === this.transaction_payload ? t.serializeBool(!1) : (t.serializeBool(!0),
                this.transaction_payload.serialize(t))
            }
            static deserialize(t) {
                const e = Xt.deserialize(t);
                let n;
                return t.deserializeBool() && (n = Pe.deserialize(t)),
                new Me(e,n)
            }
        }
          , Fe = class {
            constructor(t) {
                this.code = t
            }
            serialize(t) {
                t.serializeBytes(this.code)
            }
            static deserialize(t) {
                const e = t.deserializeBytes();
                return new Fe(e)
            }
        }
          , qe = class {
            constructor(t, e) {
                this.address = t,
                this.name = e
            }
            static fromStr(t) {
                const e = t.split("::");
                if (2 !== e.length)
                    throw new Error("Invalid module id.");
                return new qe(Xt.fromHex(new Bt(e[0])),new fe(e[1]))
            }
            serialize(t) {
                this.address.serialize(t),
                this.name.serialize(t)
            }
            static deserialize(t) {
                const e = Xt.deserialize(t)
                  , n = fe.deserialize(t);
                return new qe(e,n)
            }
        }
          , je = class {
            serialize(t) {
                throw new Error("Not implemented.")
            }
            static deserialize(t) {
                throw new Error("Not implemented.")
            }
        }
          , $e = class {
            serialize(t) {
                throw new Error("Not implmented.")
            }
            static deserialize(t) {
                throw new Error("Not implmented.")
            }
        }
          , Ge = class {
            constructor(t, e) {
                this.raw_txn = t,
                this.authenticator = e
            }
            serialize(t) {
                this.raw_txn.serialize(t),
                this.authenticator.serialize(t)
            }
            static deserialize(t) {
                const e = Ne.deserialize(t)
                  , n = se.deserialize(t);
                return new Ge(e,n)
            }
        }
          , Ke = class {
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                switch (e) {
                case 0:
                    return Ve.load(t);
                case 1:
                    return We.load(t);
                default:
                    throw new Error("Unknown variant index for RawTransactionWithData: ".concat(e))
                }
            }
        }
          , Ve = class extends Ke {
            constructor(t, e) {
                super(),
                this.raw_txn = t,
                this.secondary_signer_addresses = e
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                this.raw_txn.serialize(t),
                Nt(this.secondary_signer_addresses, t)
            }
            static load(t) {
                const e = Ne.deserialize(t)
                  , n = Dt(t, Xt);
                return new Ve(e,n)
            }
        }
          , We = class extends Ke {
            constructor(t, e, n) {
                super(),
                this.raw_txn = t,
                this.secondary_signer_addresses = e,
                this.fee_payer_address = n
            }
            serialize(t) {
                t.serializeU32AsUleb128(1),
                this.raw_txn.serialize(t),
                Nt(this.secondary_signer_addresses, t),
                this.fee_payer_address.serialize(t)
            }
            static load(t) {
                const e = Ne.deserialize(t)
                  , n = Dt(t, Xt)
                  , r = Xt.deserialize(t);
                return new We(e,n,r)
            }
        }
          , Ye = class {
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                switch (e) {
                case 0:
                    return Je.load(t);
                case 2:
                    return Xe.load(t);
                case 3:
                    return Ze.load(t);
                default:
                    throw new Error("Unknown variant index for TransactionPayload: ".concat(e))
                }
            }
        }
          , Je = class extends Ye {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                this.value.serialize(t)
            }
            static load(t) {
                const e = He.deserialize(t);
                return new Je(e)
            }
        }
          , Xe = class extends Ye {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(2),
                this.value.serialize(t)
            }
            static load(t) {
                const e = De.deserialize(t);
                return new Xe(e)
            }
        }
          , Ze = class extends Ye {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(3),
                this.value.serialize(t)
            }
            static load(t) {
                const e = Me.deserialize(t);
                return new Ze(e)
            }
        }
          , Qe = class {
            constructor(t) {
                this.value = t
            }
            serialize(t) {
                t.serializeU8(this.value)
            }
            static deserialize(t) {
                const e = t.deserializeU8();
                return new Qe(e)
            }
        }
          , tn = class {
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                switch (e) {
                case 0:
                    return en.load(t);
                case 1:
                    return sn.load(t);
                case 2:
                    return on.load(t);
                case 3:
                    return cn.load(t);
                case 4:
                    return un.load(t);
                case 5:
                    return ln.load(t);
                case 6:
                    return nn.load(t);
                case 7:
                    return rn.load(t);
                case 8:
                    return an.load(t);
                default:
                    throw new Error("Unknown variant index for TransactionArgument: ".concat(e))
                }
            }
        }
          , en = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                t.serializeU8(this.value)
            }
            static load(t) {
                const e = t.deserializeU8();
                return new en(e)
            }
        }
          , nn = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(6),
                t.serializeU16(this.value)
            }
            static load(t) {
                const e = t.deserializeU16();
                return new nn(e)
            }
        }
          , rn = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(7),
                t.serializeU32(this.value)
            }
            static load(t) {
                const e = t.deserializeU32();
                return new rn(e)
            }
        }
          , sn = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(1),
                t.serializeU64(this.value)
            }
            static load(t) {
                const e = t.deserializeU64();
                return new sn(e)
            }
        }
          , on = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(2),
                t.serializeU128(this.value)
            }
            static load(t) {
                const e = t.deserializeU128();
                return new on(e)
            }
        }
          , an = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(8),
                t.serializeU256(this.value)
            }
            static load(t) {
                const e = t.deserializeU256();
                return new an(e)
            }
        }
          , cn = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(3),
                this.value.serialize(t)
            }
            static load(t) {
                const e = Xt.deserialize(t);
                return new cn(e)
            }
        }
          , un = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(4),
                t.serializeBytes(this.value)
            }
            static load(t) {
                const e = t.deserializeBytes();
                return new un(e)
            }
        }
          , ln = class extends tn {
            constructor(t) {
                super(),
                this.value = t
            }
            serialize(t) {
                t.serializeU32AsUleb128(5),
                t.serializeBool(this.value)
            }
            static load(t) {
                const e = t.deserializeBool();
                return new ln(e)
            }
        }
          , hn = class {
            getHashSalt() {
                const t = q.create();
                return t.update("APTOS::Transaction"),
                t.digest()
            }
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                if (0 === e)
                    return dn.load(t);
                throw new Error("Unknown variant index for Transaction: ".concat(e))
            }
        }
          , dn = class extends hn {
            constructor(t) {
                super(),
                this.value = t
            }
            hash() {
                const t = q.create();
                return t.update(this.getHashSalt()),
                t.update(Pt(this)),
                t.digest()
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                this.value.serialize(t)
            }
            static load(t) {
                return new dn(Ge.deserialize(t))
            }
        }
          , fn = class {
            constructor(t) {
                this.name = t
            }
            serialize(t) {
                t.serializeStr(this.name)
            }
            static deserialize(t) {
                const e = t.deserializeStr();
                return new fn(e)
            }
        }
          , pn = class {
            constructor(t, e) {
                this.name = t,
                this.type_tag = e
            }
            serialize(t) {
                t.serializeStr(this.name),
                this.type_tag.serialize(t)
            }
            static deserialize(t) {
                const e = t.deserializeStr()
                  , n = pe.deserialize(t);
                return new pn(e,n)
            }
        }
          , yn = class {
            static deserialize(t) {
                const e = t.deserializeUleb128AsU32();
                switch (e) {
                case 0:
                    return gn.load(t);
                case 1:
                    return wn.load(t);
                default:
                    throw new Error("Unknown variant index for TransactionPayload: ".concat(e))
                }
            }
        }
          , gn = class extends yn {
            constructor(t, e, n, r, i) {
                super(),
                this.name = t,
                this.doc = e,
                this.code = n,
                this.ty_args = r,
                this.args = i
            }
            serialize(t) {
                t.serializeU32AsUleb128(0),
                t.serializeStr(this.name),
                t.serializeStr(this.doc),
                t.serializeBytes(this.code),
                Nt(this.ty_args, t),
                Nt(this.args, t)
            }
            static load(t) {
                const e = t.deserializeStr()
                  , n = t.deserializeStr()
                  , r = t.deserializeBytes()
                  , i = Dt(t, fn)
                  , s = Dt(t, pn);
                return new gn(e,n,r,i,s)
            }
        }
          , wn = class extends yn {
            constructor(t, e, n, r, i) {
                super(),
                this.name = t,
                this.module_name = e,
                this.doc = n,
                this.ty_args = r,
                this.args = i
            }
            serialize(t) {
                t.serializeU32AsUleb128(1),
                t.serializeStr(this.name),
                this.module_name.serialize(t),
                t.serializeStr(this.doc),
                Nt(this.ty_args, t),
                Nt(this.args, t)
            }
            static load(t) {
                const e = t.deserializeStr()
                  , n = qe.deserialize(t)
                  , r = t.deserializeStr()
                  , i = Dt(t, fn)
                  , s = Dt(t, pn);
                return new wn(e,n,r,i,s)
            }
        }
          , bn = class {
            constructor(t) {
                if (t.length !== bn.LENGTH)
                    throw new Error("Expected a byte array of length 32");
                this.bytes = t
            }
            static fromMultiEd25519PublicKey(t) {
                const e = t.toBytes()
                  , n = new Uint8Array(e.length + 1);
                n.set(e),
                n.set([bn.MULTI_ED25519_SCHEME], e.length);
                const r = q.create();
                return r.update(n),
                new bn(r.digest())
            }
            static fromEd25519PublicKey(t) {
                const e = t.value
                  , n = new Uint8Array(e.length + 1);
                n.set(e),
                n.set([bn.ED25519_SCHEME], e.length);
                const r = q.create();
                return r.update(n),
                new bn(r.digest())
            }
            derivedAddress() {
                return Bt.fromUint8Array(this.bytes)
            }
        }
          , _n = bn;
        _n.LENGTH = 32,
        _n.MULTI_ED25519_SCHEME = 1,
        _n.ED25519_SCHEME = 0,
        _n.DERIVE_RESOURCE_ACCOUNT_SCHEME = 255;
        var vn = class {
            constructor(t, e, n, r, i, s, o) {
                this.accountAddress = t,
                this.moduleName = e,
                this.structName = n,
                this.sequenceNumber = r,
                this.originator = i,
                this.currentAuthKey = s,
                this.newPublicKey = o
            }
            serialize(t) {
                this.accountAddress.serialize(t),
                t.serializeStr(this.moduleName),
                t.serializeStr(this.structName),
                t.serializeU64(this.sequenceNumber),
                this.originator.serialize(t),
                this.currentAuthKey.serialize(t),
                t.serializeBytes(this.newPublicKey)
            }
        }
          , mn = class {
            static fromAptosAccountObject(t) {
                return new mn(Bt.ensure(t.privateKeyHex).toUint8Array(),t.address)
            }
            static isValidPath(t) {
                return /^m\/44'\/637'\/[0-9]+'\/[0-9]+'\/[0-9]+'+$/.test(t)
            }
            static fromDerivePath(t, n) {
                if (!mn.isValidPath(t))
                    throw new Error("Invalid derivation path");
                const r = n.trim().split(/\s+/).map((t=>t.toLowerCase())).join(" ")
                  , {key: i} = ct(t, o(e.Z1(r)));
                return new mn(i)
            }
            constructor(e, n) {
                this.signingKey = e ? t.sign.keyPair.fromSeed(e.slice(0, 32)) : t.sign.keyPair(),
                this.accountAddress = Bt.ensure(n || this.authKey().hex())
            }
            address() {
                return this.accountAddress
            }
            authKey() {
                const t = new Qt(this.signingKey.publicKey);
                return _n.fromEd25519PublicKey(t).derivedAddress()
            }
            static getResourceAccountAddress(t, e) {
                const n = Pt(Xt.fromHex(t))
                  , r = new Uint8Array([...n, ...e, _n.DERIVE_RESOURCE_ACCOUNT_SCHEME])
                  , i = q.create();
                return i.update(r),
                Bt.fromUint8Array(i.digest())
            }
            static getCollectionID(t, e) {
                const n = (new TextEncoder).encode("".concat(t, "::").concat(e))
                  , r = A.create();
                return r.update(n),
                Bt.fromUint8Array(r.digest())
            }
            pubKey() {
                return Bt.fromUint8Array(this.signingKey.publicKey)
            }
            signBuffer(e) {
                const n = t.sign.detached(e, this.signingKey.secretKey);
                return Bt.fromUint8Array(n)
            }
            signHexString(t) {
                const e = Bt.ensure(t).toUint8Array();
                return this.signBuffer(e)
            }
            verifySignature(e, n) {
                const r = Bt.ensure(e).toUint8Array()
                  , i = Bt.ensure(n).toUint8Array();
                return t.sign.detached.verify(r, i, this.signingKey.publicKey)
            }
            toPrivateKeyObject() {
                return {
                    address: this.address().hex(),
                    publicKeyHex: this.pubKey().hex(),
                    privateKeyHex: Bt.fromUint8Array(this.signingKey.secretKey.slice(0, 32)).hex()
                }
            }
        }
          , An = mn;
        st([ft()], An.prototype, "authKey", 1);
        var En = "\n    fragment CurrentTokenOwnershipFields on current_token_ownerships_v2 {\n  token_standard\n  token_properties_mutated_v1\n  token_data_id\n  table_type_v1\n  storage_id\n  property_version_v1\n  owner_address\n  last_transaction_version\n  last_transaction_timestamp\n  is_soulbound_v2\n  is_fungible_v2\n  amount\n  current_token_data {\n    collection_id\n    description\n    is_fungible_v2\n    largest_property_version_v1\n    last_transaction_timestamp\n    last_transaction_version\n    maximum\n    supply\n    token_data_id\n    token_name\n    token_properties\n    token_standard\n    token_uri\n    current_collection {\n      collection_id\n      collection_name\n      creator_address\n      current_supply\n      description\n      last_transaction_timestamp\n      last_transaction_version\n      max_supply\n      mutable_description\n      mutable_uri\n      table_handle_v1\n      token_standard\n      total_minted_v2\n      uri\n    }\n  }\n}\n    "
          , xn = "\n    fragment TokenActivitiesFields on token_activities_v2 {\n  after_value\n  before_value\n  entry_function_id_str\n  event_account_address\n  event_index\n  from_address\n  is_fungible_v2\n  property_version_v1\n  to_address\n  token_amount\n  token_data_id\n  token_standard\n  transaction_timestamp\n  transaction_version\n  type\n}\n    "
          , Un = "\n    query getAccountCurrentTokens($address: String!, $offset: Int, $limit: Int) {\n  current_token_ownerships(\n    where: {owner_address: {_eq: $address}, amount: {_gt: 0}}\n    order_by: [{last_transaction_version: desc}, {creator_address: asc}, {collection_name: asc}, {name: asc}]\n    offset: $offset\n    limit: $limit\n  ) {\n    amount\n    current_token_data {\n      ...TokenDataFields\n    }\n    current_collection_data {\n      ...CollectionDataFields\n    }\n    last_transaction_version\n    property_version\n  }\n}\n    ".concat("\n    fragment TokenDataFields on current_token_datas {\n  creator_address\n  collection_name\n  description\n  metadata_uri\n  name\n  token_data_id_hash\n  collection_data_id_hash\n}\n    ", "\n").concat("\n    fragment CollectionDataFields on current_collection_datas {\n  metadata_uri\n  supply\n  description\n  collection_name\n  collection_data_id_hash\n  table_handle\n  creator_address\n}\n    ")
          , Bn = "\n    query getAccountTransactionsData($where_condition: account_transactions_bool_exp!, $offset: Int, $limit: Int, $order_by: [account_transactions_order_by!]) {\n  account_transactions(\n    where: $where_condition\n    order_by: $order_by\n    limit: $limit\n    offset: $offset\n  ) {\n    token_activities_v2 {\n      ...TokenActivitiesFields\n    }\n    transaction_version\n    account_address\n  }\n}\n    ".concat(xn)
          , Tn = "\n    query getOwnedTokens($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {\n  current_token_ownerships_v2(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    ...CurrentTokenOwnershipFields\n  }\n}\n    ".concat(En)
          , Sn = "\n    query getOwnedTokensByTokenData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {\n  current_token_ownerships_v2(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    ...CurrentTokenOwnershipFields\n  }\n}\n    ".concat(En)
          , zn = "\n    query getTokenActivities($where_condition: token_activities_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [token_activities_v2_order_by!]) {\n  token_activities_v2(\n    where: $where_condition\n    order_by: $order_by\n    offset: $offset\n    limit: $limit\n  ) {\n    ...TokenActivitiesFields\n  }\n}\n    ".concat(xn)
          , kn = "\n    query getTokenCurrentOwnerData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {\n  current_token_ownerships_v2(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    ...CurrentTokenOwnershipFields\n  }\n}\n    ".concat(En)
          , In = "\n    query getTokenOwnedFromCollection($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {\n  current_token_ownerships_v2(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    ...CurrentTokenOwnershipFields\n  }\n}\n    ".concat(En)
          , Ln = "\n    query getTokenOwnersData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {\n  current_token_ownerships_v2(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    ...CurrentTokenOwnershipFields\n  }\n}\n    ".concat(En);
        function Cn(t, e, n) {
            if (!(null == e ? void 0 : e.includes(typeof t)))
                throw new Error(n || "Invalid arg: ".concat(t, " type should be ").concat(e instanceof Array ? e.join(" or ") : e))
        }
        function On(t) {
            if (Cn(t, ["boolean", "string"]),
            "boolean" === typeof t)
                return t;
            if ("true" === t)
                return !0;
            if ("false" === t)
                return !1;
            throw new Error("Invalid boolean string.")
        }
        function Rn(t) {
            if (Cn(t, ["number", "string"]),
            "number" === typeof t)
                return t;
            const e = Number.parseInt(t, 10);
            if (Number.isNaN(e))
                throw new Error("Invalid number string.");
            return e
        }
        function Nn(t) {
            return Cn(t, ["number", "bigint", "string"]),
            BigInt(t)
        }
        function Hn(t, e, n) {
            Dn(t, e, n, 0)
        }
        function Dn(t, e, n, r) {
            if (e instanceof ye)
                n.serializeBool(On(t));
            else if (e instanceof ge)
                n.serializeU8(Rn(t));
            else if (e instanceof we)
                n.serializeU16(Rn(t));
            else if (e instanceof be)
                n.serializeU32(Rn(t));
            else if (e instanceof _e)
                n.serializeU64(Nn(t));
            else if (e instanceof ve)
                n.serializeU128(Nn(t));
            else if (e instanceof me)
                n.serializeU256(Nn(t));
            else if (e instanceof Ae)
                Pn(t, n);
            else if (e instanceof xe)
                !function(t, e, n, r) {
                    if (e.value instanceof ge) {
                        if (t instanceof Uint8Array)
                            return void n.serializeBytes(t);
                        if (t instanceof Bt)
                            return void n.serializeBytes(t.toUint8Array());
                        if ("string" === typeof t)
                            return void n.serializeStr(t)
                    }
                    if (!Array.isArray(t))
                        throw new Error("Invalid vector args.");
                    n.serializeU32AsUleb128(t.length),
                    t.forEach((t=>Dn(t, e.value, n, r + 1)))
                }(t, e, n, r);
            else {
                if (!(e instanceof Ue))
                    throw new Error("Unsupported arg type.");
                !function(t, e, n, r) {
                    const {address: i, module_name: s, name: o, type_args: a} = e.value
                      , c = "".concat(Bt.fromUint8Array(i.address).toShortString(), "::").concat(s.value, "::").concat(o.value);
                    if ("0x1::string::String" === c)
                        Cn(t, ["string"]),
                        n.serializeStr(t);
                    else if ("0x1::object::Object" === c)
                        Pn(t, n);
                    else {
                        if ("0x1::option::Option" !== c)
                            throw new Error("Unsupported struct type in function argument");
                        if (1 !== a.length)
                            throw new Error("Option has the wrong number of type arguments ".concat(a.length));
                        !function(t, e, n, r) {
                            void 0 === t || null === t ? n.serializeU32AsUleb128(0) : (n.serializeU32AsUleb128(1),
                            Dn(t, e, n, r + 1))
                        }(t, a[0], n, r)
                    }
                }(t, e, n, r)
            }
        }
        function Pn(t, e) {
            let n;
            if ("string" === typeof t || t instanceof Bt)
                n = Xt.fromHex(t);
            else {
                if (!(t instanceof Xt))
                    throw new Error("Invalid account address.");
                n = t
            }
            n.serialize(e)
        }
        var Mn = "APTOS::RawTransactionWithData"
          , Fn = class {
            constructor(t, e) {
                this.rawTxnBuilder = e,
                this.signingFunction = t
            }
            build(t, e, n) {
                if (!this.rawTxnBuilder)
                    throw new Error("this.rawTxnBuilder doesn't exist.");
                return this.rawTxnBuilder.build(t, e, n)
            }
            static getSigningMessage(t) {
                const e = q.create();
                if (t instanceof Ne)
                    e.update("APTOS::RawTransaction");
                else if (t instanceof Ve)
                    e.update(Mn);
                else {
                    if (!(t instanceof We))
                        throw new Error("Unknown transaction type.");
                    e.update(Mn)
                }
                const n = e.digest()
                  , r = Pt(t)
                  , i = new Uint8Array(n.length + r.length);
                return i.set(n),
                i.set(r, n.length),
                i
            }
        }
          , qn = class extends Fn {
            constructor(t, e, n) {
                super(t, n),
                this.publicKey = e
            }
            rawToSigned(t) {
                const e = Fn.getSigningMessage(t)
                  , n = this.signingFunction(e)
                  , r = new oe(new Qt(this.publicKey),n);
                return new Ge(t,r)
            }
            sign(t) {
                return Pt(this.rawToSigned(t))
            }
        }
          , jn = class extends Fn {
            constructor(t, e) {
                super(t),
                this.publicKey = e
            }
            rawToSigned(t) {
                const e = Fn.getSigningMessage(t)
                  , n = this.signingFunction(e)
                  , r = new ae(this.publicKey,n);
                return new Ge(t,r)
            }
            sign(t) {
                return Pt(this.rawToSigned(t))
            }
        }
          , $n = class {
            constructor(t, e) {
                this.abiMap = new Map,
                t.forEach((t=>{
                    const e = new Rt(t)
                      , n = yn.deserialize(e);
                    let r;
                    if (n instanceof wn) {
                        const t = n
                          , {address: e, name: i} = t.module_name;
                        r = "".concat(Bt.fromUint8Array(e.address).toShortString(), "::").concat(i.value, "::").concat(t.name)
                    } else {
                        r = n.name
                    }
                    if (this.abiMap.has(r))
                        throw new Error("Found conflicting ABI interfaces");
                    this.abiMap.set(r, n)
                }
                )),
                this.builderConfig = {
                    maxGasAmount: BigInt(ht),
                    expSecFromNow: 20,
                    ...e
                }
            }
            static toBCSArgs(t, e) {
                if (t.length !== e.length)
                    throw new Error("Wrong number of args provided.");
                return e.map(((e,n)=>{
                    const r = new Ct;
                    return Hn(e, t[n].type_tag, r),
                    r.getBytes()
                }
                ))
            }
            static toTransactionArguments(t, e) {
                if (t.length !== e.length)
                    throw new Error("Wrong number of args provided.");
                return e.map(((e,n)=>function(t, e) {
                    if (e instanceof ye)
                        return new ln(On(t));
                    if (e instanceof ge)
                        return new en(Rn(t));
                    if (e instanceof we)
                        return new nn(Rn(t));
                    if (e instanceof be)
                        return new rn(Rn(t));
                    if (e instanceof _e)
                        return new sn(Nn(t));
                    if (e instanceof ve)
                        return new on(Nn(t));
                    if (e instanceof me)
                        return new an(Nn(t));
                    if (e instanceof Ae) {
                        let e;
                        if ("string" === typeof t || t instanceof Bt)
                            e = Xt.fromHex(t);
                        else {
                            if (!(t instanceof Xt))
                                throw new Error("Invalid account address.");
                            e = t
                        }
                        return new cn(e)
                    }
                    if (e instanceof xe && e.value instanceof ge) {
                        if (!(t instanceof Uint8Array))
                            throw new Error("".concat(t, " should be an instance of Uint8Array"));
                        return new un(t)
                    }
                    throw new Error("Unknown type for TransactionArgument.")
                }(e, t[n].type_tag)))
            }
            setSequenceNumber(t) {
                this.builderConfig.sequenceNumber = BigInt(t)
            }
            buildTransactionPayload(t, e, n) {
                const r = e.map((t=>new Oe(t).parseTypeTag()));
                let i;
                if (!this.abiMap.has(t))
                    throw new Error("Cannot find function: ".concat(t));
                const s = this.abiMap.get(t);
                if (s instanceof wn) {
                    const t = s
                      , e = $n.toBCSArgs(t.args, n);
                    i = new Xe(new De(t.module_name,new fe(t.name),r,e))
                } else {
                    if (!(s instanceof gn))
                        throw new Error("Unknown ABI format.");
                    {
                        const t = s
                          , e = $n.toTransactionArguments(t.args, n);
                        i = new Je(new He(t.code,r,e))
                    }
                }
                return i
            }
            build(t, e, n) {
                const {sender: r, sequenceNumber: i, gasUnitPrice: s, maxGasAmount: o, expSecFromNow: a, chainId: c} = this.builderConfig;
                if (!s)
                    throw new Error("No gasUnitPrice provided.");
                const u = r instanceof Xt ? r : Xt.fromHex(r)
                  , l = BigInt(Math.floor(Date.now() / 1e3) + Number(a))
                  , h = this.buildTransactionPayload(t, e, n);
                if (h)
                    return new Ne(u,BigInt(i),h,BigInt(o),BigInt(s),l,new Qe(Number(c)));
                throw new Error("Invalid ABI.")
            }
        }
          , Gn = class {
            constructor(t, e) {
                this.aptosClient = t,
                this.builderConfig = e
            }
            async fetchABI(t) {
                const e = (await this.aptosClient.getAccountModules(t)).map((t=>t.abi)).flatMap((t=>t.exposed_functions.filter((t=>t.is_entry)).map((e=>({
                    fullName: "".concat(t.address, "::").concat(t.name, "::").concat(e.name),
                    ...e
                })))))
                  , n = new Map;
                return e.forEach((t=>{
                    n.set(t.fullName, t)
                }
                )),
                n
            }
            async build(t, e, n) {
                if (3 !== (t = t.replace(/^0[xX]0*/g, "0x")).split("::").length)
                    throw new Error("'func' needs to be a fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer");
                const [r,i] = t.split("::")
                  , s = await this.fetchABI(r);
                if (!s.has(t))
                    throw new Error("".concat(t, " doesn't exist."));
                const o = s.get(t)
                  , a = o.params.filter((t=>"signer" !== t && "&signer" !== t)).map(((t,n)=>new pn("var".concat(n),new Oe(t,e).parseTypeTag())))
                  , c = new wn(o.name,qe.fromStr("".concat(r, "::").concat(i)),"",o.generic_type_params.map(((t,e)=>new fn("".concat(e)))),a)
                  , {sender: u, ...l} = this.builderConfig
                  , h = u instanceof Xt ? Bt.fromUint8Array(u.address) : u
                  , [{sequence_number: d},f,{gas_estimate: p}] = await Promise.all([(null == l ? void 0 : l.sequenceNumber) ? Promise.resolve({
                    sequence_number: null == l ? void 0 : l.sequenceNumber
                }) : this.aptosClient.getAccount(h), (null == l ? void 0 : l.chainId) ? Promise.resolve(null == l ? void 0 : l.chainId) : this.aptosClient.getChainId(), (null == l ? void 0 : l.gasUnitPrice) ? Promise.resolve({
                    gas_estimate: null == l ? void 0 : l.gasUnitPrice
                }) : this.aptosClient.estimateGasPrice()]);
                return new $n([Pt(c)],{
                    sender: u,
                    sequenceNumber: d,
                    chainId: f,
                    gasUnitPrice: BigInt(p),
                    ...l
                }).build(t, e, n)
            }
        }
        ;
        st([pt(6e5)], Gn.prototype, "fetchABI", 1);
        var Kn = class {
            constructor(t, e) {
                let n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                if (!t)
                    throw new Error("Node URL cannot be empty.");
                this.nodeUrl = n ? t : function(t) {
                    let e = "".concat(t);
                    return e.endsWith("/") && (e = e.substring(0, e.length - 1)),
                    e.endsWith("/v1") || (e = "".concat(e).concat("/v1")),
                    e
                }(t),
                this.config = void 0 === e || null === e ? {} : {
                    ...e
                }
            }
            async getAccount(t) {
                const {data: e} = await mt({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(Bt.ensure(t).hex()),
                    originMethod: "getAccount",
                    overrides: {
                        ...this.config
                    }
                });
                return e
            }
            async getAccountTransactions(t, e) {
                const {data: n} = await mt({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(Bt.ensure(t).hex(), "/transactions"),
                    originMethod: "getAccountTransactions",
                    params: {
                        start: null == e ? void 0 : e.start,
                        limit: null == e ? void 0 : e.limit
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return n
            }
            async getAccountModules(t, e) {
                return await Et({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(t, "/modules"),
                    params: {
                        ledger_version: null == e ? void 0 : e.ledgerVersion,
                        limit: 1e3
                    },
                    originMethod: "getAccountModules",
                    overrides: {
                        ...this.config
                    }
                })
            }
            async getAccountModule(t, e, n) {
                const {data: r} = await mt({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(Bt.ensure(t).hex(), "/module/").concat(e),
                    originMethod: "getAccountModule",
                    params: {
                        ledger_version: null == n ? void 0 : n.ledgerVersion
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return r
            }
            async getAccountResources(t, e) {
                return await Et({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(t, "/resources"),
                    params: {
                        ledger_version: null == e ? void 0 : e.ledgerVersion,
                        limit: 9999
                    },
                    originMethod: "getAccountResources",
                    overrides: {
                        ...this.config
                    }
                })
            }
            async getAccountResource(t, e, n) {
                const {data: r} = await mt({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(Bt.ensure(t).hex(), "/resource/").concat(e),
                    originMethod: "getAccountResource",
                    params: {
                        ledger_version: null == n ? void 0 : n.ledgerVersion
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return r
            }
            static generateBCSTransaction(t, e) {
                return new qn((e=>{
                    const n = t.signBuffer(e);
                    return new Tt.Ed25519Signature(n.toUint8Array())
                }
                ),t.pubKey().toUint8Array()).sign(e)
            }
            static generateBCSSimulation(t, e) {
                return new qn((t=>{
                    const e = new Uint8Array(64);
                    return new Tt.Ed25519Signature(e)
                }
                ),t.pubKey().toUint8Array()).sign(e)
            }
            async generateTransaction(t, e, n) {
                const r = {
                    sender: t
                };
                if ((null == n ? void 0 : n.sequence_number) && (r.sequenceNumber = n.sequence_number),
                (null == n ? void 0 : n.gas_unit_price) && (r.gasUnitPrice = n.gas_unit_price),
                (null == n ? void 0 : n.max_gas_amount) && (r.maxGasAmount = n.max_gas_amount),
                null == n ? void 0 : n.expiration_timestamp_secs) {
                    const t = Number.parseInt(n.expiration_timestamp_secs, 10);
                    r.expSecFromNow = t - Math.floor(Date.now() / 1e3)
                }
                return new Gn(this,r).build(e.function, e.type_arguments, e.arguments)
            }
            async generateFeePayerTransaction(t, e, n) {
                let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : []
                  , i = arguments.length > 4 ? arguments[4] : void 0;
                const s = await this.generateTransaction(t, e, i)
                  , o = r.map((t=>Xt.fromHex(t)));
                return new Tt.FeePayerRawTransaction(s,o,Xt.fromHex(n))
            }
            async submitFeePayerTransaction(t, e, n) {
                let r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [];
                const i = new Tt.TransactionAuthenticatorFeePayer(e,t.secondary_signer_addresses,r,{
                    address: t.fee_payer_address,
                    authenticator: n
                })
                  , s = Pt(new Tt.SignedTransaction(t.raw_txn,i));
                return await this.submitSignedBCSTransaction(s)
            }
            async signMultiTransaction(t, e) {
                const n = new Tt.Ed25519Signature(t.signBuffer(Fn.getSigningMessage(e)).toUint8Array())
                  , r = new Tt.AccountAuthenticatorEd25519(new Tt.Ed25519PublicKey(t.signingKey.publicKey),n);
                return Promise.resolve(r)
            }
            async signTransaction(t, e) {
                return Promise.resolve(Kn.generateBCSTransaction(t, e))
            }
            async getEventsByCreationNumber(t, e, n) {
                const {data: r} = await mt({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(Bt.ensure(t).hex(), "/events/").concat(e),
                    originMethod: "getEventsByCreationNumber",
                    params: {
                        start: null == n ? void 0 : n.start,
                        limit: null == n ? void 0 : n.limit
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return r
            }
            async getEventsByEventHandle(t, e, n, r) {
                const {data: i} = await mt({
                    url: this.nodeUrl,
                    endpoint: "accounts/".concat(Bt.ensure(t).hex(), "/events/").concat(e, "/").concat(n),
                    originMethod: "getEventsByEventHandle",
                    params: {
                        start: null == r ? void 0 : r.start,
                        limit: null == r ? void 0 : r.limit
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return i
            }
            async submitTransaction(t) {
                return this.submitSignedBCSTransaction(t)
            }
            async simulateTransaction(t, e, n) {
                let r;
                if (t instanceof An)
                    r = Kn.generateBCSSimulation(t, e);
                else if (t instanceof ne) {
                    r = new jn((()=>{
                        const {threshold: e} = t
                          , n = []
                          , r = [];
                        for (let t = 0; t < e; t += 1)
                            n.push(t),
                            r.push(new Tt.Ed25519Signature(new Uint8Array(64)));
                        const i = Tt.MultiEd25519Signature.createBitmap(n);
                        return new Tt.MultiEd25519Signature(r,i)
                    }
                    ),t).sign(e)
                } else {
                    r = new qn((()=>{
                        const t = new Uint8Array(64);
                        return new Tt.Ed25519Signature(t)
                    }
                    ),t.toBytes()).sign(e)
                }
                return this.submitBCSSimulation(r, n)
            }
            async submitSignedBCSTransaction(t) {
                const {data: e} = await At({
                    url: this.nodeUrl,
                    body: t,
                    endpoint: "transactions",
                    originMethod: "submitSignedBCSTransaction",
                    contentType: "application/x.aptos.signed_transaction+bcs",
                    overrides: {
                        ...this.config
                    }
                });
                return e
            }
            async submitBCSSimulation(t, e) {
                var n, r, i;
                const s = {
                    estimate_gas_unit_price: null != (n = null == e ? void 0 : e.estimateGasUnitPrice) && n,
                    estimate_max_gas_amount: null != (r = null == e ? void 0 : e.estimateMaxGasAmount) && r,
                    estimate_prioritized_gas_unit_price: null != (i = null == e ? void 0 : e.estimatePrioritizedGasUnitPrice) && i
                }
                  , {data: o} = await At({
                    url: this.nodeUrl,
                    body: t,
                    endpoint: "transactions/simulate",
                    params: s,
                    originMethod: "submitBCSSimulation",
                    contentType: "application/x.aptos.signed_transaction+bcs",
                    overrides: {
                        ...this.config
                    }
                });
                return o
            }
            async getTransactions(t) {
                var e;
                const {data: n} = await mt({
                    url: this.nodeUrl,
                    endpoint: "transactions",
                    originMethod: "getTransactions",
                    params: {
                        start: null == (e = null == t ? void 0 : t.start) ? void 0 : e.toString(),
                        limit: null == t ? void 0 : t.limit
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return n
            }
            async getTransactionByHash(t) {
                const {data: e} = await mt({
                    url: this.nodeUrl,
                    endpoint: "transactions/by_hash/".concat(t),
                    originMethod: "getTransactionByHash",
                    overrides: {
                        ...this.config
                    }
                });
                return e
            }
            async getTransactionByVersion(t) {
                const {data: e} = await mt({
                    url: this.nodeUrl,
                    endpoint: "transactions/by_version/".concat(t),
                    originMethod: "getTransactionByVersion",
                    overrides: {
                        ...this.config
                    }
                });
                return e
            }
            async transactionPending(t) {
                try {
                    return "pending_transaction" === (await this.getTransactionByHash(t)).type
                } catch (e) {
                    if (404 === (null == e ? void 0 : e.status))
                        return !0;
                    throw e
                }
            }
            async waitForTransactionWithResult(t, e) {
                var n, r;
                const i = null != (n = null == e ? void 0 : e.timeoutSecs) ? n : 20
                  , s = null != (r = null == e ? void 0 : e.checkSuccess) && r;
                let o, a = !0, c = 0;
                for (; a && !(c >= i); ) {
                    try {
                        if (o = await this.getTransactionByHash(t),
                        a = "pending_transaction" === o.type,
                        !a)
                            break
                    } catch (u) {
                        const t = u instanceof Jn
                          , e = t && 404 !== u.status && u.status >= 400 && u.status < 500;
                        if (!t || e)
                            throw u
                    }
                    await lt(1e3),
                    c += 1
                }
                if (void 0 === o)
                    throw new Error("Waiting for transaction ".concat(t, " failed"));
                if (a)
                    throw new Wn("Waiting for transaction ".concat(t, " timed out after ").concat(i, " seconds"),o);
                if (!s)
                    return o;
                if (!(null == o ? void 0 : o.success))
                    throw new Yn("Transaction ".concat(t, " failed with an error: ").concat(o.vm_status),o);
                return o
            }
            async waitForTransaction(t, e) {
                await this.waitForTransactionWithResult(t, e)
            }
            async getLedgerInfo() {
                const {data: t} = await mt({
                    url: this.nodeUrl,
                    originMethod: "getLedgerInfo",
                    overrides: {
                        ...this.config
                    }
                });
                return t
            }
            async getChainId() {
                return (await this.getLedgerInfo()).chain_id
            }
            async getTableItem(t, e, n) {
                var r;
                return (await At({
                    url: this.nodeUrl,
                    body: e,
                    endpoint: "tables/".concat(t, "/item"),
                    originMethod: "getTableItem",
                    params: {
                        ledger_version: null == (r = null == n ? void 0 : n.ledgerVersion) ? void 0 : r.toString()
                    },
                    overrides: {
                        ...this.config
                    }
                })).data
            }
            async generateRawTransaction(t, e, n) {
                const [{sequence_number: r},i,{gas_estimate: s}] = await Promise.all([(null == n ? void 0 : n.providedSequenceNumber) ? Promise.resolve({
                    sequence_number: n.providedSequenceNumber
                }) : this.getAccount(t), this.getChainId(), (null == n ? void 0 : n.gasUnitPrice) ? Promise.resolve({
                    gas_estimate: n.gasUnitPrice
                }) : this.estimateGasPrice()])
                  , {maxGasAmount: o, gasUnitPrice: a, expireTimestamp: c} = {
                    maxGasAmount: BigInt(ht),
                    gasUnitPrice: BigInt(s),
                    expireTimestamp: BigInt(Math.floor(Date.now() / 1e3) + 20),
                    ...n
                };
                return new Tt.RawTransaction(Tt.AccountAddress.fromHex(t),BigInt(r),e,o,a,c,new Tt.ChainId(i))
            }
            async generateSignSubmitTransaction(t, e, n) {
                const r = await this.generateRawTransaction(t.address(), e, n)
                  , i = Kn.generateBCSTransaction(t, r);
                return (await this.submitSignedBCSTransaction(i)).hash
            }
            async signAndSubmitTransaction(t, e) {
                const n = Kn.generateBCSTransaction(t, e);
                return (await this.submitSignedBCSTransaction(n)).hash
            }
            async publishPackage(t, e, n, r) {
                const i = new Ct;
                Nt(n, i);
                const s = new Tt.TransactionPayloadEntryFunction(Tt.EntryFunction.natural("0x1::code", "publish_package_txn", [], [Wt(e), i.getBytes()]));
                return this.generateSignSubmitTransaction(t, s, r)
            }
            async createResourceAccountAndPublishPackage(t, e, n, r, i) {
                const s = new Ct;
                Nt(r, s);
                const o = new Tt.TransactionPayloadEntryFunction(Tt.EntryFunction.natural("0x1::resource_account", "create_resource_account_and_publish_package", [], [Wt(e), Wt(n), s.getBytes()]));
                return this.generateSignSubmitTransaction(t, o, i)
            }
            async generateSignSubmitWaitForTransaction(t, e, n) {
                const r = await this.generateSignSubmitTransaction(t, e, n);
                return this.waitForTransactionWithResult(r, n)
            }
            async estimateGasPrice() {
                const {data: t} = await mt({
                    url: this.nodeUrl,
                    endpoint: "estimate_gas_price",
                    originMethod: "estimateGasPrice",
                    overrides: {
                        ...this.config
                    }
                });
                return t
            }
            async estimateMaxGasAmount(t) {
                const e = "0x1::coin::CoinStore<".concat(dt, ">")
                  , [{gas_estimate: n},r] = await Promise.all([this.estimateGasPrice(), this.getAccountResources(t)])
                  , i = r.find((t=>t.type === e));
                return BigInt(i.data.coin.value) / BigInt(n)
            }
            async rotateAuthKeyEd25519(t, e, n) {
                const {sequence_number: r, authentication_key: i} = await this.getAccount(t.address())
                  , s = new An(e)
                  , o = new Tt.RotationProofChallenge(Tt.AccountAddress.CORE_CODE_ADDRESS,"account","RotationProofChallenge",BigInt(r),Tt.AccountAddress.fromHex(t.address()),new Tt.AccountAddress(new Bt(i).toUint8Array()),s.pubKey().toUint8Array())
                  , a = Bt.fromUint8Array(Pt(o))
                  , c = t.signHexString(a)
                  , u = s.signHexString(a)
                  , l = new Tt.TransactionPayloadEntryFunction(Tt.EntryFunction.natural("0x1::account", "rotate_authentication_key", [], [Ft(0), Wt(t.pubKey().toUint8Array()), Ft(0), Wt(s.pubKey().toUint8Array()), Wt(c.toUint8Array()), Wt(u.toUint8Array())]))
                  , h = await this.generateRawTransaction(t.address(), l, n)
                  , d = Kn.generateBCSTransaction(t, h);
                return this.submitSignedBCSTransaction(d)
            }
            async lookupOriginalAddress(t) {
                const e = await this.getAccountResource("0x1", "0x1::account::OriginatingAddress")
                  , {address_map: {handle: n}} = e.data
                  , r = await this.getTableItem(n, {
                    key_type: "address",
                    value_type: "address",
                    key: Bt.ensure(t).hex()
                });
                return new Bt(r)
            }
            async getBlockByHeight(t, e) {
                const {data: n} = await mt({
                    url: this.nodeUrl,
                    endpoint: "blocks/by_height/".concat(t),
                    originMethod: "getBlockByHeight",
                    params: {
                        with_transactions: e
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return n
            }
            async getBlockByVersion(t, e) {
                const {data: n} = await mt({
                    url: this.nodeUrl,
                    endpoint: "blocks/by_version/".concat(t),
                    originMethod: "getBlockByVersion",
                    params: {
                        with_transactions: e
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return n
            }
            async view(t, e) {
                const {data: n} = await At({
                    url: this.nodeUrl,
                    body: t,
                    endpoint: "view",
                    originMethod: "getTableItem",
                    params: {
                        ledger_version: e
                    },
                    overrides: {
                        ...this.config
                    }
                });
                return n
            }
            clearCache(t) {
                !function(t) {
                    const e = new Set;
                    for (const n of t) {
                        const t = yt.get(n);
                        if (t)
                            for (const n of t)
                                e.has(n) || (n.clear(),
                                e.add(n))
                    }
                    e.size
                }(t)
            }
        }
          , Vn = Kn;
        st([Xn], Vn.prototype, "getAccount", 1),
        st([Xn], Vn.prototype, "getAccountTransactions", 1),
        st([Xn, pt(6e5)], Vn.prototype, "getAccountModules", 1),
        st([Xn], Vn.prototype, "getAccountModule", 1),
        st([Xn], Vn.prototype, "getAccountResources", 1),
        st([Xn], Vn.prototype, "getAccountResource", 1),
        st([Xn], Vn.prototype, "getEventsByCreationNumber", 1),
        st([Xn], Vn.prototype, "getEventsByEventHandle", 1),
        st([Xn], Vn.prototype, "submitSignedBCSTransaction", 1),
        st([Xn], Vn.prototype, "submitBCSSimulation", 1),
        st([Xn], Vn.prototype, "getTransactions", 1),
        st([Xn], Vn.prototype, "getTransactionByHash", 1),
        st([Xn], Vn.prototype, "getTransactionByVersion", 1),
        st([Xn], Vn.prototype, "getLedgerInfo", 1),
        st([ft()], Vn.prototype, "getChainId", 1),
        st([Xn], Vn.prototype, "getTableItem", 1),
        st([Xn, ft({
            ttlMs: 3e5,
            tags: ["gas_estimates"]
        })], Vn.prototype, "estimateGasPrice", 1),
        st([Xn], Vn.prototype, "estimateMaxGasAmount", 1),
        st([Xn], Vn.prototype, "getBlockByHeight", 1),
        st([Xn], Vn.prototype, "getBlockByVersion", 1),
        st([Xn], Vn.prototype, "view", 1);
        var Wn = class extends Error {
            constructor(t, e) {
                super(t),
                this.lastSubmittedTransaction = e
            }
        }
          , Yn = class extends Error {
            constructor(t, e) {
                super(t),
                this.transaction = e
            }
        }
          , Jn = class extends Error {
            constructor(t, e, n, r) {
                super(e),
                this.status = t,
                this.message = e,
                this.errorCode = n,
                this.vmErrorCode = r
            }
        }
        ;
        function Xn(t, e, n) {
            const r = n.value;
            return n.value = async function() {
                var t, e;
                try {
                    for (var n = arguments.length, i = new Array(n), s = 0; s < n; s++)
                        i[s] = arguments[s];
                    return await r.apply(this, [...i])
                } catch (o) {
                    if (o instanceof wt)
                        throw new Jn(o.status,JSON.stringify({
                            message: o.message,
                            ...o.data
                        }),null == (t = o.data) ? void 0 : t.error_code,null == (e = o.data) ? void 0 : e.vm_error_code);
                    throw o
                }
            }
            ,
            n
        }
        var Zn = class {
            constructor(t, e) {
                this.endpoint = t,
                this.config = e
            }
            static validateAddress(t) {
                if (t.length < 66)
                    throw new Error("".concat(t, " is less than 66 chars long."))
            }
            async queryIndexer(t) {
                const e = await At({
                    url: this.endpoint,
                    body: t,
                    overrides: {
                        WITH_CREDENTIALS: !1,
                        ...this.config
                    }
                });
                if (e.data.errors)
                    throw new Jn(e.data.errors[0].extensions.code,JSON.stringify({
                        message: e.data.errors[0].message,
                        error_code: e.data.errors[0].extensions.code
                    }));
                return e.data.data
            }
            async getIndexerLedgerInfo() {
                const t = {
                    query: "\n    query getIndexerLedgerInfo {\n  ledger_infos {\n    chain_id\n  }\n}\n    "
                };
                return this.queryIndexer(t)
            }
            async getAccountNFTs(t, e) {
                const n = Bt.ensure(t).hex();
                Zn.validateAddress(n);
                const r = {
                    query: Un,
                    variables: {
                        address: n,
                        offset: null == e ? void 0 : e.offset,
                        limit: null == e ? void 0 : e.limit
                    }
                };
                return this.queryIndexer(r)
            }
            async getTokenActivities(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    token_data_id: {
                        _eq: i
                    }
                };
                (null == e ? void 0 : e.tokenStandard) && (s.token_standard = {
                    _eq: null == e ? void 0 : e.tokenStandard
                });
                const o = {
                    query: zn,
                    variables: {
                        where_condition: s,
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(o)
            }
            async getTokenActivitiesCount(t) {
                const e = {
                    query: "\n    query getTokenActivitiesCount($token_id: String) {\n  token_activities_v2_aggregate(where: {token_data_id: {_eq: $token_id}}) {\n    aggregate {\n      count\n    }\n  }\n}\n    ",
                    variables: {
                        token_id: t
                    }
                };
                return this.queryIndexer(e)
            }
            async getAccountTokensCount(t, e) {
                var n, r;
                const i = {
                    owner_address: {
                        _eq: t
                    },
                    amount: {
                        _gt: "0"
                    }
                };
                (null == e ? void 0 : e.tokenStandard) && (i.token_standard = {
                    _eq: null == e ? void 0 : e.tokenStandard
                });
                const s = Bt.ensure(t).hex();
                Zn.validateAddress(s);
                const o = {
                    query: "\n    query getAccountTokensCount($where_condition: current_token_ownerships_v2_bool_exp, $offset: Int, $limit: Int) {\n  current_token_ownerships_v2_aggregate(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n  ) {\n    aggregate {\n      count\n    }\n  }\n}\n    ",
                    variables: {
                        where_condition: i,
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit
                    }
                };
                return this.queryIndexer(o)
            }
            async getTokenData(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    token_data_id: {
                        _eq: i
                    }
                };
                (null == e ? void 0 : e.tokenStandard) && (s.token_standard = {
                    _eq: null == e ? void 0 : e.tokenStandard
                });
                const o = {
                    query: "\n    query getTokenData($where_condition: current_token_datas_v2_bool_exp, $offset: Int, $limit: Int, $order_by: [current_token_datas_v2_order_by!]) {\n  current_token_datas_v2(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    collection_id\n    description\n    is_fungible_v2\n    largest_property_version_v1\n    last_transaction_timestamp\n    last_transaction_version\n    maximum\n    supply\n    token_data_id\n    token_name\n    token_properties\n    token_standard\n    token_uri\n    current_collection {\n      collection_id\n      collection_name\n      creator_address\n      current_supply\n      description\n      last_transaction_timestamp\n      last_transaction_version\n      max_supply\n      mutable_description\n      mutable_uri\n      table_handle_v1\n      token_standard\n      total_minted_v2\n      uri\n    }\n  }\n}\n    ",
                    variables: {
                        where_condition: s,
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(o)
            }
            async getTokenOwnersData(t, e, n) {
                var r, i;
                const s = Bt.ensure(t).hex();
                Zn.validateAddress(s);
                const o = {
                    token_data_id: {
                        _eq: s
                    },
                    amount: {
                        _gt: "0"
                    }
                };
                e && (o.property_version_v1 = {
                    _eq: e
                }),
                (null == n ? void 0 : n.tokenStandard) && (o.token_standard = {
                    _eq: null == n ? void 0 : n.tokenStandard
                });
                const a = {
                    query: Ln,
                    variables: {
                        where_condition: o,
                        offset: null == (r = null == n ? void 0 : n.options) ? void 0 : r.offset,
                        limit: null == (i = null == n ? void 0 : n.options) ? void 0 : i.limit,
                        order_by: null == n ? void 0 : n.orderBy
                    }
                };
                return this.queryIndexer(a)
            }
            async getTokenCurrentOwnerData(t, e, n) {
                var r, i;
                const s = Bt.ensure(t).hex();
                Zn.validateAddress(s);
                const o = {
                    token_data_id: {
                        _eq: s
                    },
                    amount: {
                        _gt: "0"
                    }
                };
                e && (o.property_version_v1 = {
                    _eq: e
                }),
                (null == n ? void 0 : n.tokenStandard) && (o.token_standard = {
                    _eq: null == n ? void 0 : n.tokenStandard
                });
                const a = {
                    query: kn,
                    variables: {
                        where_condition: o,
                        offset: null == (r = null == n ? void 0 : n.options) ? void 0 : r.offset,
                        limit: null == (i = null == n ? void 0 : n.options) ? void 0 : i.limit,
                        order_by: null == n ? void 0 : n.orderBy
                    }
                };
                return this.queryIndexer(a)
            }
            async getOwnedTokens(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    owner_address: {
                        _eq: i
                    },
                    amount: {
                        _gt: 0
                    }
                };
                (null == e ? void 0 : e.tokenStandard) && (s.token_standard = {
                    _eq: null == e ? void 0 : e.tokenStandard
                });
                const o = {
                    query: Tn,
                    variables: {
                        where_condition: s,
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(o)
            }
            async getOwnedTokensByTokenData(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    token_data_id: {
                        _eq: i
                    },
                    amount: {
                        _gt: 0
                    }
                };
                (null == e ? void 0 : e.tokenStandard) && (s.token_standard = {
                    _eq: null == e ? void 0 : e.tokenStandard
                });
                const o = {
                    query: Sn,
                    variables: {
                        where_condition: s,
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(o)
            }
            async getTokenOwnedFromCollectionAddress(t, e, n) {
                var r, i;
                const s = Bt.ensure(t).hex();
                Zn.validateAddress(s);
                const o = Bt.ensure(e).hex();
                Zn.validateAddress(o);
                const a = {
                    owner_address: {
                        _eq: s
                    },
                    current_token_data: {
                        collection_id: {
                            _eq: o
                        }
                    },
                    amount: {
                        _gt: 0
                    }
                };
                (null == n ? void 0 : n.tokenStandard) && (a.token_standard = {
                    _eq: null == n ? void 0 : n.tokenStandard
                });
                const c = {
                    query: In,
                    variables: {
                        where_condition: a,
                        offset: null == (r = null == n ? void 0 : n.options) ? void 0 : r.offset,
                        limit: null == (i = null == n ? void 0 : n.options) ? void 0 : i.limit,
                        order_by: null == n ? void 0 : n.orderBy
                    }
                };
                return this.queryIndexer(c)
            }
            async getTokenOwnedFromCollectionNameAndCreatorAddress(t, e, n, r) {
                const i = await this.getCollectionAddress(n, e, r);
                return await this.getTokenOwnedFromCollectionAddress(t, i, r)
            }
            async getCollectionData(t, e, n) {
                var r, i;
                const s = Bt.ensure(t).hex();
                Zn.validateAddress(s);
                const o = {
                    collection_name: {
                        _eq: e
                    },
                    creator_address: {
                        _eq: s
                    }
                };
                (null == n ? void 0 : n.tokenStandard) && (o.token_standard = {
                    _eq: null == n ? void 0 : n.tokenStandard
                });
                const a = {
                    query: "\n    query getCollectionData($where_condition: current_collections_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collections_v2_order_by!]) {\n  current_collections_v2(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    collection_id\n    collection_name\n    creator_address\n    current_supply\n    description\n    last_transaction_timestamp\n    last_transaction_version\n    max_supply\n    mutable_description\n    mutable_uri\n    table_handle_v1\n    token_standard\n    total_minted_v2\n    uri\n  }\n}\n    ",
                    variables: {
                        where_condition: o,
                        offset: null == (r = null == n ? void 0 : n.options) ? void 0 : r.offset,
                        limit: null == (i = null == n ? void 0 : n.options) ? void 0 : i.limit,
                        order_by: null == n ? void 0 : n.orderBy
                    }
                };
                return this.queryIndexer(a)
            }
            async getCollectionAddress(t, e, n) {
                return (await this.getCollectionData(t, e, n)).current_collections_v2[0].collection_id
            }
            async getCollectionsWithOwnedTokens(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    owner_address: {
                        _eq: i
                    }
                };
                (null == e ? void 0 : e.tokenStandard) && (s.current_collection = {
                    token_standard: {
                        _eq: null == e ? void 0 : e.tokenStandard
                    }
                });
                const o = {
                    query: "\n    query getCollectionsWithOwnedTokens($where_condition: current_collection_ownership_v2_view_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collection_ownership_v2_view_order_by!]) {\n  current_collection_ownership_v2_view(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    current_collection {\n      collection_id\n      collection_name\n      creator_address\n      current_supply\n      description\n      last_transaction_timestamp\n      last_transaction_version\n      mutable_description\n      max_supply\n      mutable_uri\n      table_handle_v1\n      token_standard\n      total_minted_v2\n      uri\n    }\n    collection_id\n    collection_name\n    collection_uri\n    creator_address\n    distinct_tokens\n    last_transaction_version\n    owner_address\n    single_token_uri\n  }\n}\n    ",
                    variables: {
                        where_condition: s,
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(o)
            }
            async getAccountTransactionsCount(t) {
                const e = Bt.ensure(t).hex();
                Zn.validateAddress(e);
                const n = {
                    query: "\n    query getAccountTransactionsCount($address: String) {\n  account_transactions_aggregate(where: {account_address: {_eq: $address}}) {\n    aggregate {\n      count\n    }\n  }\n}\n    ",
                    variables: {
                        address: e
                    }
                };
                return this.queryIndexer(n)
            }
            async getAccountTransactionsData(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    query: Bn,
                    variables: {
                        where_condition: {
                            account_address: {
                                _eq: i
                            }
                        },
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(s)
            }
            async getTopUserTransactions(t) {
                const e = {
                    query: "\n    query getTopUserTransactions($limit: Int) {\n  user_transactions(limit: $limit, order_by: {version: desc}) {\n    version\n  }\n}\n    ",
                    variables: {
                        limit: t
                    }
                };
                return this.queryIndexer(e)
            }
            async getUserTransactions(t) {
                var e, n;
                const r = {
                    query: "\n    query getUserTransactions($where_condition: user_transactions_bool_exp!, $offset: Int, $limit: Int, $order_by: [user_transactions_order_by!]) {\n  user_transactions(\n    order_by: $order_by\n    where: $where_condition\n    limit: $limit\n    offset: $offset\n  ) {\n    version\n  }\n}\n    ",
                    variables: {
                        where_condition: {
                            version: {
                                _lte: null == t ? void 0 : t.startVersion
                            }
                        },
                        offset: null == (e = null == t ? void 0 : t.options) ? void 0 : e.offset,
                        limit: null == (n = null == t ? void 0 : t.options) ? void 0 : n.limit,
                        order_by: null == t ? void 0 : t.orderBy
                    }
                };
                return this.queryIndexer(r)
            }
            async getDelegatedStakingActivities(t, e) {
                const n = Bt.ensure(t).hex()
                  , r = Bt.ensure(e).hex();
                Zn.validateAddress(n),
                Zn.validateAddress(r);
                const i = {
                    query: "\n    query getDelegatedStakingActivities($delegatorAddress: String, $poolAddress: String) {\n  delegated_staking_activities(\n    where: {delegator_address: {_eq: $delegatorAddress}, pool_address: {_eq: $poolAddress}}\n  ) {\n    amount\n    delegator_address\n    event_index\n    event_type\n    pool_address\n    transaction_version\n  }\n}\n    ",
                    variables: {
                        delegatorAddress: n,
                        poolAddress: r
                    }
                };
                return this.queryIndexer(i)
            }
            async getNumberOfDelegators(t) {
                const e = Bt.ensure(t).hex();
                Zn.validateAddress(e);
                const n = {
                    query: '\n    query getNumberOfDelegators($poolAddress: String) {\n  num_active_delegator_per_pool(\n    where: {pool_address: {_eq: $poolAddress}, num_active_delegator: {_gt: "0"}}\n    distinct_on: pool_address\n  ) {\n    num_active_delegator\n    pool_address\n  }\n}\n    ',
                    variables: {
                        poolAddress: e
                    }
                };
                return this.queryIndexer(n)
            }
            async getAccountCoinsData(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    query: "\n    query getAccountCoinsData($where_condition: current_fungible_asset_balances_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_fungible_asset_balances_order_by!]) {\n  current_fungible_asset_balances(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    amount\n    asset_type\n    is_frozen\n    is_primary\n    last_transaction_timestamp\n    last_transaction_version\n    owner_address\n    storage_id\n    token_standard\n    metadata {\n      token_standard\n      symbol\n      supply_aggregator_table_key_v1\n      supply_aggregator_table_handle_v1\n      project_uri\n      name\n      last_transaction_version\n      last_transaction_timestamp\n      icon_uri\n      decimals\n      creator_address\n      asset_type\n    }\n  }\n}\n    ",
                    variables: {
                        where_condition: {
                            owner_address: {
                                _eq: i
                            }
                        },
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(s)
            }
            async getAccountCoinsDataCount(t) {
                const e = Bt.ensure(t).hex();
                Zn.validateAddress(e);
                const n = {
                    query: "\n    query getAccountCoinsDataCount($address: String) {\n  current_fungible_asset_balances_aggregate(\n    where: {owner_address: {_eq: $address}}\n  ) {\n    aggregate {\n      count\n    }\n  }\n}\n    ",
                    variables: {
                        address: e
                    }
                };
                return this.queryIndexer(n)
            }
            async getAccountOwnedObjects(t, e) {
                var n, r;
                const i = Bt.ensure(t).hex();
                Zn.validateAddress(i);
                const s = {
                    query: "\n    query getCurrentObjects($where_condition: current_objects_bool_exp, $offset: Int, $limit: Int, $order_by: [current_objects_order_by!]) {\n  current_objects(\n    where: $where_condition\n    offset: $offset\n    limit: $limit\n    order_by: $order_by\n  ) {\n    allow_ungated_transfer\n    state_key_hash\n    owner_address\n    object_address\n    last_transaction_version\n    last_guid_creation_num\n    is_deleted\n  }\n}\n    ",
                    variables: {
                        where_condition: {
                            owner_address: {
                                _eq: i
                            }
                        },
                        offset: null == (n = null == e ? void 0 : e.options) ? void 0 : n.offset,
                        limit: null == (r = null == e ? void 0 : e.options) ? void 0 : r.limit,
                        order_by: null == e ? void 0 : e.orderBy
                    }
                };
                return this.queryIndexer(s)
            }
        }
          , Qn = class {
            constructor(t, e) {
                let n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2]
                  , r = null
                  , i = null;
                if ("object" === typeof t && function(t) {
                    return void 0 !== t.fullnodeUrl && "string" === typeof t.fullnodeUrl
                }(t) ? (r = t.fullnodeUrl,
                i = t.indexerUrl,
                this.network = "CUSTOM") : (r = Ut[t],
                i = xt[t],
                this.network = t),
                "CUSTOM" === this.network && !r)
                    throw new Error("fullnode url is not provided");
                i && (this.indexerClient = new Zn(i,e)),
                this.aptosClient = new Vn(r,e,n)
            }
        }
        ;
        function tr(t, e, n) {
            Object.getOwnPropertyNames(e.prototype).forEach((r=>{
                const i = Object.getOwnPropertyDescriptor(e.prototype, r);
                i && (i.value = function() {
                    return this[n][r](...arguments)
                }
                ,
                Object.defineProperty(t.prototype, r, i))
            }
            )),
            Object.getOwnPropertyNames(e).forEach((r=>{
                const i = Object.getOwnPropertyDescriptor(e, r);
                i && (i.value = function() {
                    return this[n][r](...arguments)
                }
                ,
                t.hasOwnProperty.call(t, r) || Object.defineProperty(t, r, i))
            }
            ))
        }
        tr(Qn, Vn, "aptosClient"),
        tr(Qn, Zn, "indexerClient");
        var er = class {
            constructor(t, e) {
                this.type = t,
                this.value = e
            }
        }
          , nr = class {
            constructor() {
                this.data = {}
            }
            setProperty(t, e) {
                this.data[t] = e
            }
        }
        ;
        function rr(t) {
            let e;
            return e = "string" === t || "String" === t ? new Ue(Te) : new Oe(t).parseTypeTag(),
            e
        }
        function ir(t) {
            const e = t.map.data
              , n = new nr;
            return e.forEach((t=>{
                const {key: e} = t
                  , r = t.value.value
                  , i = t.value.type
                  , s = function(t, e) {
                    const n = new Rt(new Bt(e).toUint8Array());
                    let r = "";
                    r = t instanceof ge ? n.deserializeU8().toString() : t instanceof _e ? n.deserializeU64().toString() : t instanceof ve ? n.deserializeU128().toString() : t instanceof ye ? n.deserializeBool() ? "true" : "false" : t instanceof Ae ? Bt.fromUint8Array(n.deserializeFixedBytes(32)).hex() : t instanceof Ue && t.isStringTypeTag() ? n.deserializeStr() : e;
                    return r
                }(rr(i), r)
                  , o = new er(i,s);
                n.setProperty(e, o)
            }
            )),
            n
        }
        it({}, {
            PropertyMap: ()=>nr,
            PropertyValue: ()=>er,
            Token: ()=>or,
            TokenData: ()=>sr
        });
        var sr = class {
            constructor(t, e, n, r, i, s, o, a) {
                this.collection = t,
                this.description = e,
                this.name = n,
                this.maximum = r,
                this.supply = i,
                this.uri = s,
                this.default_properties = ir(o),
                this.mutability_config = a
            }
        }
          , or = class {
            constructor(t, e, n) {
                this.id = t,
                this.amount = e,
                this.token_properties = ir(n)
            }
        }
        ;
        Error;
        it({}, {
            AptosErrorCode: ()=>ar,
            MoveFunctionVisibility: ()=>cr,
            RoleType: ()=>ur
        });
        var ar = (t=>(t.ACCOUNT_NOT_FOUND = "account_not_found",
        t.RESOURCE_NOT_FOUND = "resource_not_found",
        t.MODULE_NOT_FOUND = "module_not_found",
        t.STRUCT_FIELD_NOT_FOUND = "struct_field_not_found",
        t.VERSION_NOT_FOUND = "version_not_found",
        t.TRANSACTION_NOT_FOUND = "transaction_not_found",
        t.TABLE_ITEM_NOT_FOUND = "table_item_not_found",
        t.BLOCK_NOT_FOUND = "block_not_found",
        t.STATE_VALUE_NOT_FOUND = "state_value_not_found",
        t.VERSION_PRUNED = "version_pruned",
        t.BLOCK_PRUNED = "block_pruned",
        t.INVALID_INPUT = "invalid_input",
        t.INVALID_TRANSACTION_UPDATE = "invalid_transaction_update",
        t.SEQUENCE_NUMBER_TOO_OLD = "sequence_number_too_old",
        t.VM_ERROR = "vm_error",
        t.HEALTH_CHECK_FAILED = "health_check_failed",
        t.MEMPOOL_IS_FULL = "mempool_is_full",
        t.INTERNAL_ERROR = "internal_error",
        t.WEB_FRAMEWORK_ERROR = "web_framework_error",
        t.BCS_NOT_SUPPORTED = "bcs_not_supported",
        t.API_DISABLED = "api_disabled",
        t))(ar || {})
          , cr = (t=>(t.PRIVATE = "private",
        t.PUBLIC = "public",
        t.FRIEND = "friend",
        t))(cr || {})
          , ur = (t=>(t.VALIDATOR = "validator",
        t.FULL_NODE = "full_node",
        t))(ur || {});
        const lr = {
            randomUUID: "undefined" !== typeof crypto && crypto.randomUUID && crypto.randomUUID.bind(crypto)
        };
        let hr;
        const dr = new Uint8Array(16);
        function fr() {
            if (!hr && (hr = "undefined" !== typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto),
            !hr))
                throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
            return hr(dr)
        }
        const pr = [];
        for (let n = 0; n < 256; ++n)
            pr.push((n + 256).toString(16).slice(1));
        function yr(t) {
            let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            return (pr[t[e + 0]] + pr[t[e + 1]] + pr[t[e + 2]] + pr[t[e + 3]] + "-" + pr[t[e + 4]] + pr[t[e + 5]] + "-" + pr[t[e + 6]] + pr[t[e + 7]] + "-" + pr[t[e + 8]] + pr[t[e + 9]] + "-" + pr[t[e + 10]] + pr[t[e + 11]] + pr[t[e + 12]] + pr[t[e + 13]] + pr[t[e + 14]] + pr[t[e + 15]]).toLowerCase()
        }
        const gr = function(t, e, n) {
            if (lr.randomUUID && !e && !t)
                return lr.randomUUID();
            const r = (t = t || {}).random || (t.rng || fr)();
            if (r[6] = 15 & r[6] | 64,
            r[8] = 63 & r[8] | 128,
            e) {
                n = n || 0;
                for (let t = 0; t < 16; ++t)
                    e[n + t] = r[t];
                return e
            }
            return yr(r)
        };
        function wr(t) {
            const e = t.arguments.map((t=>{
                return (e = t)instanceof Uint8Array ? {
                    stringValue: Bt.fromUint8Array(e).hex(),
                    type: "Uint8Array"
                } : e;
                var e
            }
            ));
            return {
                ...t,
                arguments: e
            }
        }
        function br(t) {
            if (function(t) {
                return t instanceof Tt.TransactionPayload || void 0 !== (null === t || void 0 === t ? void 0 : t.serialize)
            }(t)) {
                const e = St.bcsToBytes(t);
                return Bt.fromUint8Array(e).hex()
            }
            if ("multisig_payload" === t.type) {
                const e = void 0 !== t.transaction_payload ? wr(t.transaction_payload) : void 0;
                return {
                    ...t,
                    transaction_payload: e
                }
            }
            return wr(t)
        }
        class _r extends Error {
            constructor(t) {
                super(t),
                "function" === typeof Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error(t).stack
            }
        }
        class vr extends _r {
            constructor(t, e, n) {
                super(n),
                this.code = void 0,
                this.name = e,
                this.code = t
            }
        }
        Object.freeze({
            INTERNAL_ERROR: new vr(-30001,"Internal Error","Internal Error"),
            NO_ACCOUNTS: new vr(4e3,"No Accounts","No accounts found"),
            TIME_OUT: new vr(4002,"Time Out","The prompt timed out without a response. This could be because the user did not respond or because a new request was opened."),
            UNAUTHORIZED: new vr(4100,"Unauthorized","The requested method and/or account has not been authorized by the user."),
            UNSUPPORTED: new vr(4200,"Unsupported","The provider does not support the requested method."),
            USER_REJECTION: new vr(4001,"Rejected","The user rejected the request")
        });
        const mr = window.ReactNativeWebView
          , Ar = mr ? {
            postMessage: t=>{
                mr.postMessage(JSON.stringify(t))
            }
        } : void 0;
        let Er;
        !function(t) {
            t.Devnet = "Devnet",
            t.Localhost = "Localhost",
            t.Mainnet = "Mainnet",
            t.Testnet = "Testnet"
        }(Er || (Er = {}));
        Er.Localhost,
        Er.Localhost,
        Object.freeze({
            [Er.Mainnet]: {
                buyEnabled: !0,
                chainId: "1",
                faucetUrl: void 0,
                indexerUrl: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
                name: Er.Mainnet,
                nodeUrl: "https://fullnode.mainnet.aptoslabs.com"
            },
            [Er.Testnet]: {
                chainId: "2",
                faucetUrl: "https://faucet.testnet.aptoslabs.com",
                indexerUrl: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
                name: Er.Testnet,
                nodeUrl: "https://fullnode.testnet.aptoslabs.com"
            },
            [Er.Devnet]: {
                chainId: "65",
                faucetUrl: "https://faucet.devnet.aptoslabs.com",
                indexerUrl: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",
                name: Er.Devnet,
                nodeUrl: "https://fullnode.devnet.aptoslabs.com"
            }
        }),
        Er.Mainnet,
        "".concat("0x1::aptos_account", "::").concat("transfer_coins");
        const xr = "".concat("0x1::coin", "::").concat("CoinStore")
          , Ur = ("".concat(xr, "<").concat("0x1::aptos_coin::AptosCoin", ">"),
        "0x3::token")
          , Br = ("".concat(Ur, "::TokenStore"),
        "".concat(Ur, "::DepositEvent"),
        "".concat(Ur, "::WithdrawEvent"),
        "0x1::stake");
        "".concat(Br, "::StakePool"),
        "".concat(Br, "::ValidatorSet");
        let Tr;
        !function(t) {
            t.A = "mnemonic-a",
            t.B = "mnemonic-b",
            t.C = "mnemonic-c",
            t.D = "mnemonic-d",
            t.E = "mnemonic-e",
            t.F = "mnemonic-f",
            t.G = "mnemonic-g",
            t.H = "mnemonic-h",
            t.I = "mnemonic-i",
            t.J = "mnemonic-j",
            t.K = "mnemonic-k",
            t.L = "mnemonic-l"
        }(Tr || (Tr = {}));
        Tr.A,
        Tr.B,
        Tr.C,
        Tr.D,
        Tr.E,
        Tr.F,
        Tr.G,
        Tr.H,
        Tr.I,
        Tr.J,
        Tr.K,
        Tr.L;
        let Sr, zr;
        !function(t) {
            t.CancelOffer = "0x3::token_transfers::TokenCancelOfferEvent",
            t.Claim = "0x3::token_transfers::TokenClaimEvent",
            t.Create = "0x3::token::CreateTokenDataEvent",
            t.Deposit = "0x3::token::DepositEvent",
            t.Mint = "0x3::token::MintTokenEvent",
            t.MintV2 = "0x4::collection::MintEvent",
            t.Mutate = "0x3::token::MutateTokenPropertyMapEvent",
            t.Mutation = "0x4::token::MutationEvent",
            t.Offer = "0x3::token_transfers::TokenOfferEvent",
            t.Transfer = "0x1::object::TransferEvent",
            t.Withdraw = "0x3::token::WithdrawEvent"
        }(Sr || (Sr = {}));
        !function(t) {
            t.Approved = "approved",
            t.Dismissed = "dismissed",
            t.Rejected = "rejected",
            t.Timeout = "timeout"
        }(zr || (zr = {}));
        n(82140).Buffer;
        window.aptos = new class {
            constructor(t) {
                var e, n;
                this.iframe = void 0,
                this.targetWindow = void 0,
                this.eventListener = void 0,
                this.eventCallbacks = {},
                void 0 === Ar ? (void 0 !== t && (this.iframe = document.createElement("iframe"),
                this.iframe.setAttribute("src", "".concat(t, "/iframe.html")),
                this.iframe.setAttribute("style", "display: none"),
                document.body.appendChild(this.iframe)),
                this.targetWindow = null !== (e = null === (n = this.iframe) || void 0 === n ? void 0 : n.contentWindow) && void 0 !== e ? e : window) : this.targetWindow = Ar
            }
            async sendRequest(t) {
                for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
                    n[r - 1] = arguments[r];
                const i = gr();
                return new Promise(((e,r)=>{
                    const s = function(t, e, n) {
                        return {
                            args: n,
                            id: t,
                            method: e,
                            type: "request"
                        }
                    }(i, t, n);
                    this.targetWindow.postMessage(s),
                    window.addEventListener("message", (function t(n) {
                        const {data: s} = n;
                        var o, a;
                        if (void 0 !== (o = s) && "response" === o.type && void 0 !== o.id && o.id.length > 0 && s.id === i)
                            if (this.removeEventListener("message", t),
                            void 0 !== s.error)
                                if (void 0 !== (a = s.error).code && void 0 !== a.name && void 0 !== a.message) {
                                    const {code: t, message: e, name: n} = s.error;
                                    r(new vr(t,n,e))
                                } else
                                    r(s.error);
                            else
                                e(s.result)
                    }
                    ))
                }
                ))
            }
            async connect() {
                return this.sendRequest("connect")
            }
            async disconnect() {
                return this.sendRequest("disconnect")
            }
            async isConnected() {
                return this.sendRequest("isConnected")
            }
            async account() {
                return this.sendRequest("getAccount")
            }
            async getAccount() {
                return this.sendRequest("getAccount")
            }
            async network() {
                const {name: t} = await this.sendRequest("getNetwork");
                return t
            }
            async getNetwork() {
                return this.sendRequest("getNetwork")
            }
            async signTransaction(t, e) {
                const n = br(t)
                  , r = await this.sendRequest("signTransaction", n, e ? function(t) {
                    let {maxGasFee: e, ...n} = t;
                    return {
                        maxGasAmount: e,
                        ...n
                    }
                }(e) : void 0);
                return new Bt(r).toUint8Array()
            }
            async signMultiAgentTransaction(t) {
                const e = function(t) {
                    const e = St.bcsToBytes(t);
                    return Bt.fromUint8Array(e).hex()
                }(t);
                return this.sendRequest("signMultiAgentTransaction", e)
            }
            async signAndSubmitTransaction(t, e) {
                const n = br(t);
                return this.sendRequest("signAndSubmitTransaction", n, e)
            }
            async signMessage(t) {
                return this.sendRequest("signMessage", t)
            }
            ensureEventListener() {
                this.eventListener = t=>{
                    var e;
                    const {data: n} = t;
                    if (!function(t) {
                        return void 0 !== t && "string" === typeof t.name
                    }(n))
                        return;
                    const r = null !== (e = this.eventCallbacks[n.name]) && void 0 !== e ? e : [];
                    for (const i of r)
                        i(n.args)
                }
                ,
                window.addEventListener("message", this.eventListener)
            }
            maybeCleanupEventListener() {
                for (const t of Object.values(this.eventCallbacks))
                    if (t.size > 0)
                        return;
                this.eventListener && window.removeEventListener("message", this.eventListener)
            }
            on(t, e) {
                var n;
                void 0 !== e ? (this.ensureEventListener(),
                void 0 === this.eventCallbacks[t] && (this.eventCallbacks[t] = new Set),
                null === (n = this.eventCallbacks[t]) || void 0 === n || n.add(e)) : this.off(t)
            }
            off(t, e) {
                var n, r;
                void 0 !== e ? null === (n = this.eventCallbacks[t]) || void 0 === n || n.delete(e) : null === (r = this.eventCallbacks[t]) || void 0 === r || r.clear();
                this.maybeCleanupEventListener()
            }
            onAccountChange(t) {
                this.on("accountChange", t)
            }
            onNetworkChange(t) {
                this.on("networkChange", t)
            }
            onDisconnect(t) {
                this.on("disconnect", t)
            }
        }
        ,
        window.petra = window.aptos
    }
    )()
}
)();
