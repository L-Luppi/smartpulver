const { getAll, getById } = require('../utils/database');
const { success, notFound, serverError } = require('../utils/response');

async function getDrones() {
    try {
        console.log('Fetching from drone_model table');
        const drones = await getAll('drone_model', '', [], 'model');
        return success(drones);
    } catch (error) {
        console.error('getDrones error:', error);
        return serverError(error);
    }
}

async function getDroneById(event) {
    try {
        const id = event.pathParameters.id;
        console.log('Fetching drone by ID:', id);

        const drone = await getById('drone_model', id, '', 'id');
        if (!drone) {
            return notFound('Drone');
        }

        return success(drone);
    } catch (error) {
        console.error('getDroneById error:', error);
        return serverError(error);
    }
}

module.exports = {
    getDrones,
    getDroneById
};