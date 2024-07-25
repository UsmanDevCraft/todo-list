import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { FaRegPenToSquare } from "react-icons/fa6";

const Notes = () => {

    const [ notes, setNotes ] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    //< -------------------------- Using Fetch to Get All Notes -------------------------- >
    const fetchNotes = async () => {
        const response = await fetch("https://backend-todolist-tau.vercel.app/api/tasks/fetchall", {
            method: "GET",
            headers: {
                "Content-Type":"application/json"
            },
        });
        const data = await response.json();
        setNotes(data);
    };

    useEffect(()=>{
        fetchNotes()
    }, []);


    const getTextFormTitle = (e) => {
        setNewTitle(e.target.value);
    };
    
    const getTextFormDescription = (e) => {
        setNewDescription(e.target.value);

    };


    // < -------------------------- Using Fetch to Add a Note -------------------------- >
    const addANote = async (e) => {
        e.preventDefault();
        const response = await fetch("https://backend-todolist-tau.vercel.app/api/tasks/create", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                "title": newTitle,
                "description": newDescription,
            })
        });
        // eslint-disable-next-line
        const json = await response.json();
        setNotes([...notes, json]);
        setNewTitle("")
    };


    // < -------------------------- Using Fetch to Delete a Note -------------------------- >
    const deleteNote = async (id) => {
        const response = await fetch(`https://backend-todolist-tau.vercel.app/api/tasks/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        // eslint-disable-next-line
        const json = await response.json();
        setNotes(notes.filter(note => note._id !== id));
    };


    // < -------------------------- Using Fetch to Update a Note -------------------------- >
    const updateNote = async (id) => {
        const response = await fetch(`https://backend-todolist-tau.vercel.app/api/tasks/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": newTitle,
                "description": newDescription,
            })
        });
        // eslint-disable-next-line
        const json = await response.json();
    };

        
  return (
    <>


    <div className='d-flex flex-wrap justify-content-center align-items-center gap-2'>
      {notes && notes.map((note, index) => {
        return (
            <div key={index}>
                <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <p className="card-text">{note.description}</p>
                        <MdDelete className='fs-5 m-2' style={{cursor: "pointer"}} onClick={()=>{deleteNote(note._id)}} />
                        <FaRegPenToSquare className='fs-6 m-1' style={{cursor: "pointer"}} onClick={()=>{updateNote(note._id)}}/>
                    </div>
                </div>
            </div>
        )
      })}
    </div>

      <br/>

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
                    <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={getTextFormTitle}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' onChange={getTextFormDescription}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default Notes
