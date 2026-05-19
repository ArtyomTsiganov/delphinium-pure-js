export const api = {
    async get(endpoint, params = {}) {
        const url = new URL(`${window.location.origin}${endpoint}`); // http://127.0.0.1:8000
        Object.keys(params).forEach(key => {
            if (Array.isArray(params[key]))
                params[key].forEach(el => url.searchParams.append(key, el));
            else
                url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        return response.json();
    }
};


export function parseHTML(htmlString) {
    const parsingTemplate = document.createElement('template');
    parsingTemplate.innerHTML = htmlString.trim();
    return parsingTemplate.content.firstChild;
}