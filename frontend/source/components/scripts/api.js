export const api = {
    async get(endpoint, params = {}) {
        const url = new URL(`${window.location.origin}/api${endpoint}`); // http://127.0.0.1:8000
        Object.keys(params).forEach(key => {
            if (Array.isArray(params[key]))
                params[key].forEach(el => url.searchParams.append(key, el));
            else
                url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url);
        if (!response.ok)
            throw new Error('API Error');
        return response.json();
    },
    
    async post(endpoint, dataToBody = {}) {
        const url = new URL(`${window.location.origin}/api${endpoint}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToBody),
        });
        if (!response.ok) {
            if (response.status === 400)
                throw new Error('400');
            throw new Error('API Error');
        }
        return response.json();
    },

    async delete(endpoint, params = {}) {
        const url = new URL(`${window.location.origin}/api${endpoint}`); // http://127.0.0.1:8000
        Object.keys(params).forEach(key => {
            if (Array.isArray(params[key]))
                params[key].forEach(el => url.searchParams.append(key, el));
            else
                url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok)
            throw new Error('API Error');
        return response.json();
    },
};

export function parseHTML(htmlString) {
    const parsingTemplate = document.createElement('template');
    parsingTemplate.innerHTML = htmlString.trim();
    return parsingTemplate.content.firstChild;
}

export function toMoney(value) {
    const number = parseFloat(value) || 0;

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);
}