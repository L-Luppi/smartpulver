const {executeQuery} = require("./database");

async function getLocationByCodigoIBGE(codigo_cidade_ibge) {
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
 * @param {string} cityCode - Field name containing city code (default: 'city_code')
 * @returns {Array} Records enriched with location data
 */
async function getLocationData(registros, cityCode = 'id_cidadesIBGE') {
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

module.exports = {
    getLocationByCodigoIBGE,
    getLocationData
};

