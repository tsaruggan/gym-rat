export function lbToKg(lb) {
    const kg = lb * 0.4536;
    return Math.round(kg * 10) / 10;
}

export function kgToLb(kg) {
    const lb = kg * 2.2046;
    return Math.round(lb * 10) / 10;
}
