export default plural => plural.endsWith('ies') ? plural.replace(/ies$/, 'y') : plural.substring(0, plural.length - 1);