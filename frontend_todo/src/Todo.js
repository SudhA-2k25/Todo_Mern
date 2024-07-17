import { useEffect, useState } from "react";

export default function Todo() {
    // State hooks to manage input fields and todo list
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1); // Initially, no item is being edited

    // State hooks for editing an item
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000"; // For local dev
    // const apiUrl = "https://todo-backend-bsh6t4lxz-sudha-2k25s-projects.vercel.app/"; // For deployment

    // Function to handle adding a new todo item
    const handleSubmit = () => {
        setError(""); // Clear any previous errors

        // Check if title and description are not empty
        if (title.trim() !== '' && description.trim() !== '') {
            // Send a POST request to add the new todo item
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    // Add the new item to the list and reset input fields
                    res.json().then((newTodo) => {
                        setTodos([...todos, newTodo]);
                        setTitle("");
                        setDescription("");
                        setMessage("Item added successfully");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                    });
                } else {
                    // Show error if the item couldn't be added
                    setError("Unable to create Todo item");
                }
            }).catch(() => {
                setError("Unable to create Todo item");
            });
        }
    };

    // Fetch todo items when the component mounts
    useEffect(() => {
        getItems();
    }, []);

    // Function to get all todo items
    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    // Function to start editing an item
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    // Function to update an item
    const handleUpdate = () => {
        setError(""); // Clear any previous errors

        // Check if the edited title and description are not empty
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    // Update the item in the list and reset edit fields
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editId) {
                            return { ...item, title: editTitle, description: editDescription };
                        }
                        return item;
                    });

                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);

                    setEditId(-1); // Close the edit form

                } else {
                    // Show error if the item couldn't be updated
                    setError("Unable to update Todo item");
                }
            }).catch(() => {
                setError("Unable to update Todo item");
            });
        }
    };

    // Function to cancel editing
    const handleEditCancel = () => {
        setEditId(-1);
    };

    // Function to delete an item
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            })
            .then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            });
        }
    };

    return <>
        <div className="row p-3 bg-success text-light">
            <h1>ToDo Project with MERN stack</h1>
        </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text" />
                <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <div className="col-md-6">
                <ul className="list-group">
                    { 
                    todos.map((item) => (
                        <li key={item._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                            <div className="d-flex flex-column me-2">
                                {editId === -1 || editId !== item._id ? (
                                    <>
                                        <span className="fw-bold">{item.title}</span>
                                        <span>{item.description}</span>
                                    </>
                                ) : (
                                    <div className="form-group d-flex gap-2">
                                        <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text" />
                                        <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                                    </div>
                                )}
                            </div>
                            <div className="d-flex gap-2">
                                {editId === -1 ? (
                                    <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                                ) : (
                                    <>
                                        {editId === item._id && <button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
                                        <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                                    </>
                                )}
                                {editId === -1 && <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </>
}
