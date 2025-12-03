// src/services/userService.js
const API_URL = 'http://localhost:3001/api/users';

export const userService = {
  async getAll() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const result = await response.json();
    return result.data;
  },

  async create(userData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const result = await response.json();
    return result.data;
  },

  async update(id, userData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const result = await response.json();
    return result.data;
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return true;
  }
};