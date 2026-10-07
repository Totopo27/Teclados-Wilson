export function simplifyBigRatio(n, d) {
    let a = n;
    let b = d;
    while (b !== 0n) {
        let t = b;
        b = a % b;
        a = t;
    }
    return [n / a, d / a];
}

export function getBigPrimeLimit(n) {
    let maxPrime = 1;
    if (n < 0n) n = -n;
    if (n === 0n || n === 1n) return 1;
    
    while (n % 2n === 0n) { maxPrime = 2; n /= 2n; }
    for (let i = 3n; i * i <= n; i += 2n) {
        while (n % i === 0n) {
            maxPrime = Number(i);
            n /= i;
        }
    }
    if (n > 2n) maxPrime = Number(n);
    return maxPrime;
}

export function generatePythagorean53() {
    let ratios = [];
    
    for (let i = 0; i < 27; i++) {
        ratios.push({ n: 2n ** BigInt(i), d: 3n ** BigInt(i) });
    }
    for (let i = 1; i < 27; i++) {
        ratios.push({ n: 3n ** BigInt(i), d: 2n ** BigInt(i) });
    }
    
    let normalized = ratios.map(r => {
        let n = r.n;
        let d = r.d;
        let val = Number(n) / Number(d);
        while (val < 1.0) { n *= 2n; val = Number(n) / Number(d); }
        while (val >= 2.0) { d *= 2n; val = Number(n) / Number(d); }
        let [sn, sd] = simplifyBigRatio(n, d);
        return { n: sn, d: sd, val: Number(sn) / Number(sd) };
    });
    
    normalized.sort((a, b) => a.val - b.val);
    
    return normalized.map((r, i) => {
        const limit = Math.max(getBigPrimeLimit(r.n), getBigPrimeLimit(r.d));
        return {
            ...r,
            str: `${r.n}/${r.d}`,
            limit,
            isWolf: limit > 3 || `${r.n}/${r.d}`.length > 15
        };
    });
}

export const PYTHAGOREAN_53 = generatePythagorean53();

export function getIntervalsForPythagoreanDegree(degree) {
    const base = PYTHAGOREAN_53[degree];
    
    return PYTHAGOREAN_53.map((ratio, index) => {
        let n = ratio.n * base.d;
        let d = ratio.d * base.n;
        
        let val = Number(n) / Number(d);
        while (val < 1.0) { n *= 2n; val = Number(n) / Number(d); }
        while (val >= 2.0) { d *= 2n; val = Number(n) / Number(d); }
        
        let [sn, sd] = simplifyBigRatio(n, d);
        const limit = Math.max(getBigPrimeLimit(sn), getBigPrimeLimit(sd));
        const str = `${sn}/${sd}`;
        
        return {
            index,
            original: ratio,
            interval: {
                n: sn, d: sd, val, str, limit,
                isWolf: str.length > 20
            }
        };
    });
}
