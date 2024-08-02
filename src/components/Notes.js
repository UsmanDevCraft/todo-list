import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { FaRegPenToSquare } from "react-icons/fa6";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            const response = await fetch("https://backend-todolist-tan.vercel.app/api/tasks/fetchall", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error('An error occurred:', error.message);
            alert('An error occurred: ' + error.message);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const getTextFormTitle = (e) => {
        setNewTitle(e.target.value);
    };

    const getTextFormDescription = (e) => {
        setNewDescription(e.target.value);
    };

    // Add a note
    const addANote = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://backend-todolist-tan.vercel.app/api/tasks/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    "title": newTitle,
                    "description": newDescription,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setNotes([...notes, json]);
            setNewTitle("");
            setNewDescription("");
        } catch (error) {
            console.error('An error occurred:', error.message);
            alert('An error occurred: ' + error.message);
        }
    };

    // Delete a note
    const deleteNote = async (id) => {
        try {
            const response = await fetch(`https://backend-todolist-tan.vercel.app/api/tasks/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // eslint-disable-next-line
            const json = await response.json();
            setNotes(notes.filter(note => note._id !== id));
        } catch (error) {
            console.error('An error occurred:', error.message);
            alert('An error occurred: ' + error.message);
        }
    };

    // Update a note
    const updateNote = async (id) => {
        try {
            const response = await fetch(`https://backend-todolist-tan.vercel.app/api/tasks/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    "title": newTitle,
                    "description": newDescription,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedNote = await response.json();
            setNotes(notes.map(note => note._id === id ? updatedNote : note));
            setEditingNote(null); // Close the modal
            setNewTitle(""); // Clear the form fields
            setNewDescription("");
        } catch (error) {
            console.error('An error occurred:', error.message);
            alert('An error occurred: ' + error.message);
        }
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setNewTitle(note.title);
        setNewDescription(note.description);
    };

    return (
        <>
            <div className='d-flex flex-wrap justify-content-center align-items-center gap-2'>
                {notes && notes.map((note, index) => (
                    <div key={index}>
                        <div className="card" style={{ width: "18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title">{note.title}</h5>
                                <p className="card-text">{note.description}</p>
                                <button className='btn btn-danger mx-2' onClick={() => { deleteNote(note._id) }}>Delete<MdDelete className='fs-6 m-1' style={{ cursor: "pointer" }} /></button>
                                <button className='btn btn-info' onClick={() => { openEditModal(note) }}>Update<FaRegPenToSquare className='fs-6 m-1' style={{ cursor: "pointer" }} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <br />

            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Add a new Task.
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={addANote}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={getTextFormTitle} value={newTitle} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="description" name='description' onChange={getTextFormDescription} value={newDescription} />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {editingNote && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Note</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingNote(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    updateNote(editingNote._id);
                                }}>
                                    <div className="mb-3">
                                        <label htmlFor="editTitle" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="editTitle" name="editTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editDescription" className="form-label">Description</label>
                                        <input type="text" className="form-control" id="editDescription" name="editDescription" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Notes;
