const defaultDB = {
    farmers: [],
    plots: [],
    validations: [],
    daily: [],
    transports: [],
    qgis: [],
};

export function getDB() {
    return JSON.parse(localStorage.getItem('EUDR_DB') || JSON.stringify(defaultDB));
}

export function saveDB(db) {
    localStorage.setItem('EUDR_DB', JSON.stringify(db));
}
