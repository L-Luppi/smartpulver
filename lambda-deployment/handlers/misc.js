// Misc content handler module - Fixed imports
const { getAll, getById } = require('../utils/database');
const { success, error, notFound, serverError, paginatedSuccess } = require('../utils/response');

/**
 * Get all published misc content (blog posts, news, etc.)
 */
async function getMiscContent(event, context) {
    try {
        console.log('Fetching published misc content');

        // Get query parameters for pagination
        const limit = parseInt(event.queryStringParameters?.limit || '50');
        const offset = parseInt(event.queryStringParameters?.offset || '0');

        const content = await getAll(
            'misc_content',
            'is_published = 1',
            [],
            'created_at DESC'
        );

        // Apply pagination
        const paginatedContent = content.slice(offset, offset + limit);

        console.log(`Found ${content.length} total items, returning ${paginatedContent.length}`);

        return paginatedSuccess(paginatedContent, content.length, limit, offset);

    } catch (err) {
        console.error('Error fetching misc content:', err);
        return serverError(err);
    }
}

/**
 * Get specific misc content by ID
 */
async function getMiscContentById(event, context) {
    try {
        const contentId = event.pathParameters?.id;

        if (!contentId) {
            return error('Content ID is required', 400);
        }

        const content = await getById('misc_content', contentId, 'is_published = 1');

        if (!content) {
            return notFound('Content');
        }

        return success(content);

    } catch (err) {
        console.error('Error fetching misc content:', err);
        return serverError(err);
    }
}

module.exports = {
    getMiscContent,
    getMiscContentById
};