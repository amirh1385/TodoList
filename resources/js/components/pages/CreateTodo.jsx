import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CreateTodo = () => {
    const [categories, setCategories] = useState([]);
    const [todoTitle, setTodoTitle] = useState("");
    const [todoDescription, setTodoDescription] = useState("");
    const [todoCategory, setTodoCategory] = useState("");
    const navigate = useNavigate();
    const onFormSubmit = (e) => {
        e.preventDefault();
        const todoData = {
            title: todoTitle,
            description: todoDescription,
            category_id: todoCategory,
        };

        axios.post('/todos', todoData)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Todo Created',
                    text: 'Your todo has been created successfully!',
                });
                navigate('/');
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error creating todo',
                    text: error.response ? error.response.data.message : error.message,
                });
            });
    };

    useEffect(() => {
        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching categories',
                    text: error.response ? error.response.data.message : error.message,
                });
            });
    }, []);

    return (
        <div className="container mt-5">
            <h2>Create a New Todo</h2>
            <form onSubmit={onFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="todoTitle" className="form-label">Title</label>
                    <input type="text" className="form-control" id="todoTitle" placeholder="Enter todo title" value={todoTitle} onChange={e => setTodoTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="todoDescription" className="form-label">Description</label>
                    <textarea className="form-control" id="todoDescription" rows="3" placeholder="Enter todo description" value={todoDescription} onChange={e => setTodoDescription(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="todoCategory" className="form-label">Category</label>
                    <select className="form-select" id="todoCategory" value={todoCategory} onChange={e => setTodoCategory(e.target.value)}  >
                        <option value="">Select category</option>
                        {
                            categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Create Todo</button>
            </form>

        </div>
    );
}

export default CreateTodo;