export const copy = <T = any>(property: T): T => JSON.parse(JSON.stringify(property));
