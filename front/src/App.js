import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const NoteForm = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterByImportance, setFilterByImportance] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (filterByImportance) {
      const filtered = notes.filter((note) => note.importance);
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, filterByImportance]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Erro ao buscar as anotações:', error);
      setErrorMessage(
        'Ocorreu um erro ao buscar as anotações. Por favor, tente novamente.'
      );
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleImportanceChange = (event) => {
    setImportance(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (title && content) {
        const note = { title, content, importance };
        if (editMode && editNoteId) {
          await axios.put(`http://localhost:3001/notes/${editNoteId}`, note);
          setSuccessMessage('A anotação foi atualizada com sucesso!');
        } else {
          await axios.post('http://localhost:3001/notes', note);
          setSuccessMessage('A anotação foi criada com sucesso!');
        }
        setTitle('');
        setContent('');
        setImportance(false);
        setErrorMessage('');
        setEditMode(false);
        setEditNoteId(null);
        fetchNotes();
      } else {
        setErrorMessage('Por favor, preencha todos os campos.');
      }
    } catch (error) {
      console.error('Erro ao salvar a anotação:', error);
      setErrorMessage(
        'Ocorreu um erro ao salvar a anotação. Por favor, tente novamente.'
      );
      setSuccessMessage('');
    }
  };

  const handleEditNote = (note) => {
    setEditMode(true);
    setEditNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setImportance(note.importance);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:3001/notes/${noteId}`);
      setSuccessMessage('A anotação foi excluída com sucesso!');
      fetchNotes();
    } catch (error) {
      console.error('Erro ao excluir a anotação:', error);
      setErrorMessage(
        'Ocorreu um erro ao excluir a anotação. Por favor, tente novamente.'
      );
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditNoteId(null);
    setTitle('');
    setContent('');
    setImportance(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFilterByImportance = () => {
    setFilterByImportance(!filterByImportance);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Conteúdo:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="importance">
            <input
              type="checkbox"
              id="importance"
              checked={importance}
              onChange={handleImportanceChange}
            />
            Importante
          </label>
        </div>
        <div className="form-buttons">
          {editMode ? (
            <>
              <button className="btn-update" type="submit">
                Atualizar
              </button>
              <button className="btn-cancel" onClick={handleCancelEdit}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="btn-save" type="submit">
              Salvar
            </button>
          )}
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="note-list">
        <h2>Anotações</h2>
        <button
          className={`filter-button ${
            filterByImportance ? 'active' : ''
          }`}
          onClick={handleFilterByImportance}
        >
          {filterByImportance ? 'Mostrar todas' : 'Filtrar por importância'}
        </button>
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p className={`importance ${note.importance ? 'important' : ''}`}>
              Importante: {note.importance ? 'Sim' : 'Não'}
            </p>
            <button
              className="btn-edit"
              onClick={() => handleEditNote(note)}
            >
              Editar
            </button>
            <button
              className="btn-delete"
              onClick={() => handleDeleteNote(note.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteForm;