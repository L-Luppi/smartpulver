import {executeQuery} from "./database.js";

export async function getLocationByCodigoIBGE(codigo_cidade_ibge) {
    if (!codigo_cidade_ibge) return null;

    const query = `
        SELECT c.codigo as codigo_ibge,
               c.nome as nome_cidade,
               c.ddd as ddd_cidade,
               c.latitude as latitude,
               c.longitude as longitude,
               uf.sigla as uf_sigla,
               uf.nome as uf_nome,
               uf.regiao as uf_regiao
        FROM ibge_cidades as c
        JOIN ibge_uf as uf on c.uf_id = uf.codigo_uf
        WHERE c.codigo = ?;
    `;

    try {
        const results = await executeQuery(query, [codigo_cidade_ibge]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Enrich multiple records with location data
 * @param {Array} registros - Array of records with city_code field
 * @param {string} cityCode - Field name containing city code (default: 'id_cidade_ibge')
 * @returns {Array} Records enriched with location data
 */
export async function getLocationData(registros, cityCode = 'id_cidade_ibge') {
    if (!registros) return registros;

    const isArray = Array.isArray(registros);
    const dataArray = isArray ? registros : [registros];

    if (dataArray.length === 0) return registros;

    const codigosCidade = [...new Set(dataArray.map(registro => registro[cityCode]).filter(Boolean))];

    if (codigosCidade.length === 0) return registros;

    const placeholders = codigosCidade.map(() => '?').join(',');

    const query = `
        SELECT c.codigo as codigo_ibge,
               c.nome as nome_cidade,
               c.ddd as ddd_cidade,
               c.latitude as latitude,
               c.longitude as longitude,
               uf.sigla as uf_sigla,
               uf.nome as uf_nome,
               uf.regiao as uf_regiao
        FROM ibge_cidades as c
        INNER JOIN ibge_uf as uf on c.uf_id = uf.codigo_uf
        WHERE c.codigo IN (${placeholders})
    `;

    try {
        const locationData = await executeQuery(query, codigosCidade);

        if (locationData && locationData.length > 0) {
            const locationMap = {};
            locationData.forEach(location => {
                locationMap[location.codigo_ibge] = {
                    codigo: location.codigo_ibge,
                    cidade: location.nome_cidade,
                    uf: location.uf_sigla,
                    uf_nome: location.uf_nome,
                    regiao: location.regiao,
                    ddd: location.ddd_cidade,
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude)
                };
            });

            const enrichedData = dataArray.map(registro => ({
                ...registro,
                location: locationMap[registro[cityCode]] || null
            }));

            return isArray ? enrichedData : enrichedData[0];
        } else {
            return registros;
        }
    } catch (error) {
        console.error('erro construindo dados de localização cidade-uf', error);
        return registros;
    }
}

export function extractCityCode(locationData) {
    // Handles null, undefined, empty strings
    if (!locationData) {
        return null;
    }

    // Direct number or a string that can be parsed to a number
    if (typeof locationData === 'number') {
        return locationData;
    }
    if (typeof locationData === 'string' && !isNaN(parseInt(locationData, 10))) {
        return parseInt(locationData, 10);
    }

    // Object with various possible structures. Crucially, check for null.
    if (typeof locationData === 'object' && locationData !== null) {
        return locationData.codigo_ibge ||
            locationData.codigo ||
            locationData.id_cidade_ibge ||
            locationData.cidade?.codigo_ibge ||
            locationData.cidade?.codigo ||
            null;
    }

    // If it's none of the above (e.g., a non-numeric string), return null
    return null;
}
