export const cssCombine = (
    ...attrubutes: (string | false | undefined)[]
): string => attrubutes.filter((a) => a).join(` `);
