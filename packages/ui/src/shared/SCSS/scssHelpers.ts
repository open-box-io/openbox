export const cssCombine = (...attrubutes: (string | undefined)[]): string =>
    attrubutes.filter((a) => a).join(`, `);
