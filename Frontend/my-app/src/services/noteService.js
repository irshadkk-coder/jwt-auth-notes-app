

import API from "./api.js";


export const getNotes = (search, page) =>
  API.get("/notes", {
    params: {
      search,
      page,
    },
  });

export const createNote = (data) =>
  API.post("/notes/create", data);

export const deleteNote = (id) =>
  API.delete(`/notes/delete/${id}`);


export const updateNote = (id, data) =>
  API.put(`/notes/edit/${id}`, data);
