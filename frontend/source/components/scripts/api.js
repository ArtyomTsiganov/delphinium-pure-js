export const api = {
    async get(endpoint, params = {}) {
        const url = new URL(`http://127.0.0.1:8000${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        return response.json();
    }
};


export function parseHTML(htmlString) {
    const parsingTemplate = document.createElement('template');
    parsingTemplate.innerHTML = htmlString.trim();
    return parsingTemplate.content.cloneNode(true);
}