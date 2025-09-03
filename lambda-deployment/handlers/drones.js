// Drones handler module - Fixed imports
const { getAll, getById } = require('../utils/database');
const { success, error, notFound, serverError } = require('../utils/response');

/**
 * Get all public drones
 */
async function getDrones(event, context) {
    try {
        console.log('Fetching public drones');

        const drones = await getAll('drones', 'is_public = 1', [], 'model');

        console.log(`Found ${drones.length} public drones`);

        return success(drones);

    } catch (err) {
        console.error('Error fetching drones:', err);
        return serverError(err);
    }
}

/**
 * Get drone by ID (public endpoint)
 */
async function getDroneById(event, context) {
    try {
        const droneId = event.pathParameters?.id;

        if (!droneId) {
            return error('Drone ID is required', 400);
        }

        const drone = await getById('drones', droneId, 'is_public = 1');

        if (!drone) {
            return notFound('Drone');
        }

        return success(drone);

    } catch (err) {
        console.error('Error fetching drone:', err);
        return serverError(err);
    }
}

module.exports = {
    getDrones,
    getDroneById
};
