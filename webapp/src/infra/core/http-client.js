export class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(url, queryParams) {
    const params = new URLSearchParams(queryParams);
    const response = await fetch(
      `${this.baseURL}${url}${queryParams ? `?${params.toString()}` : ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const data = await response.json();
    return data;
  }

  async post(url, body) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }

  async patch(url, body, queryParams) {
    const params = new URLSearchParams(queryParams);
    const response = await fetch(
      `${this.baseURL}${url}${queryParams ? `?${params.toString()}` : ''}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }

  async put(url, body, queryParams) {
    const params = new URLSearchParams(queryParams);
    const response = await fetch(
      `${this.baseURL}${url}${queryParams ? `?${params.toString()}` : ''}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // body: body ? JSON.stringify(body) : null,
    });
    const data = await response.json();
    return data;
  }

  async delete(url) {
    const response = await fetch(`${this.baseURL}${url}`, { method: 'DELETE' });
    const data = await response.json();
    return data;
  }
}
