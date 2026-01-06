import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post('/categories', { name: name })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Category Created',
                    text: 'Your category has been created successfully!',
                });
                navigate('/cats');
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error creating category',
                    text: error.response ? error.response.data.message : error.message,
                });
            });
    }

    useEffect(() => {
        if (localStorage.getItem('auth_status') === null) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="container mt-5">
            <h2>Create a New Category</h2>
            <form onSubmit={onFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                    <input type="text" className="form-control" id="categoryName" placeholder="Enter category name" value={name} onChange={(e) => { setName(e.target.value) }} />
                </div>
                <button type="submit" className="btn btn-primary">Create Category</button>
            </form>
        </div>
    );
}

export default CreateCategory;