const { getAll, getById } = require('../utils/database');
const { success, notFound, serverError } = require('../utils/response');

async function getManufacturers() {
    try {
        console.log('Fetching from manufacturer table');
        const manufacturers = await getAll('manufacturer', '', [], 'name');
        return success(manufacturers);
    } catch (error) {
        console.error('getManufacturers error:', error);
        return serverError(error);
    }
}

async function getManufacturerById(event) {
    try {
        const id = event.pathParameters.id;
        console.log('Fetching manufacturer by ID:', id);

        const manufacturer = await getById('manufacturer', id, '', 'id');
        if (!manufacturer) {
            return notFound('Manufacturer');
        }

        return success(manufacturer);
    } catch (error) {
        console.error('getManufacturerById error:', error);
        return serverError(error);
    }
}

module.exports = {
    getManufacturers,
    getManufacturerById
};