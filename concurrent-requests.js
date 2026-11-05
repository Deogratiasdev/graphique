const fetch = require('node-fetch').default;

const url = 'https://frosty-moon-1fd7.sewedohounsonlon19.workers.dev';

async function sendRequest(requestId) {
    const startTime = Date.now();
    try {
        const response = await fetch(url);
        const duration = Date.now() - startTime;
        console.log(`Requête ${requestId}: ${response.status} - ${duration}ms`);
        return { id: requestId, status: response.status, duration };
    } catch (error) {
        const duration = Date.now() - startTime;
        console.log(`Requête ${requestId}: Erreur - ${duration}ms - ${error.message}`);
        return { id: requestId, error: error.message, duration };
    }
}

async function main() {
    console.log('Envoi de 10000 requêtes simultanées...');
    const startTime = Date.now();
    
    const requests = [];
    for (let i = 1; i <= 10000; i++) {
        requests.push(sendRequest(i));
    }
    
    const results = await Promise.all(requests);
    const totalDuration = Date.now() - startTime;
    
    console.log('\n--- Résultats ---');
    console.log(`Durée totale: ${totalDuration}ms`);
    console.log('Réponses:', results);
}

main().catch(console.error);
