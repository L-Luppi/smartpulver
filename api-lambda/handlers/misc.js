const { getAll, getById } = require('../utils/database');
const { success, notFound, serverError } = require('../utils/response');

async function getMiscContent() {
    try {
        console.log('Fetching from misc_content table');
        const misc = await getAll('misc_content', '', [], 'created_at DESC');
        return success(misc);
    } catch (error) {
        console.error('getMisc error:', error);
        return serverError(error);
    }
}

async function getMiscContentById(event) {
    try {
        const id = event.pathParameters.id;
        console.log('Fetching misc by ID:', id);

        const misc = await getById('misc_content', id, '', 'id');
        if (!misc) {
            return notFound('Content');
        }

        return success(misc);
    } catch (error) {
        console.error('getMiscById error:', error);
        return serverError(error);
    }
}

module.exports = {
    getMiscContent,
    getMiscContentById
};