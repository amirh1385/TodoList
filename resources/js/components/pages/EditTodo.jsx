import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditTodo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [todoID, setTodoID] = useState();
    const onFormSubmit = (e) => {
        e.preventDefault();
        const todoData = {
            title: title,
            description: description,
            category_id: category,
        };

        axios.patch(`/todos/${todoID}`, todoData)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Todo Updated',
                    text: 'Your todo has been updated successfully!',
                });
                navigate('/');
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error updating todo',
                    text: error.response ? error.response.data.message : error.message,
                });
            });
    };

    useEffect(() => {
        const todo_id = location.state?.todo_id;
        if (!todo_id) {
            navigate("/");
            return;
        }
        setTodoID(todo_id);
        axios.get(`/todos/${todo_id}`)
            .then(response => {
                setTitle(response.data.title);
                setDescription(response.data.description);
                setCategory(response.data.category_id);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching todo',
                    text: error.response ? error.response.data.message : error.message,
                });
                navigate("/");
            });

        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching categories',
                    text: error.response ? error.response.data.message : error.message,
                });
            });
    }, [location.state?.todo_id, navigate]);

    return (
        <div className="container mt-5">
            <h2>Edit Todo Page</h2>
            <form onSubmit={onFormSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control mb-3" />
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control mb-3"></textarea>
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control mb-3">
                    <option value="">Select category</option>
                    {
                        categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))
                    }
                </select>
                <button type="submit" className="btn btn-primary mt-2">Update Todo</button>
            </form>
        </div>
    );
}

export default EditTodo;