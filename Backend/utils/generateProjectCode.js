export const generateProjectCode = (clientName) => {
    const first = clientName[0].toUpperCase();
    const last = clientName[clientName.length - 1].toUpperCase();

    const random = Math.floor(1000 + Math.random() * 9000);

    return `PRJ-${first}${last}-${random}`;
};