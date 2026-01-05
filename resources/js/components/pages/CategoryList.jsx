import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const DeleteCategory = () => {
        var categoryId = event.target.getAttribute('data-id');
        axios.delete(`/categories/${categoryId}`)
            .then(response => {
                setCategories(categories.filter(category => category.id != categoryId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'The category has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error.error,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    }

    useEffect(() => {
        axios.get('/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error fetching categories. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    }, []);

    return (
        <div className="container mt-5 border p-5">
            <h1 className="center">Category List</h1>
            <div className="d-flex justify-content-between mt-2">
                <button className="btn btn-primary">Add Category</button>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Todos</button>
            </div>
            <div className="table mt-2">
                <div className="row">
                    <div className="col font-weight-bold p-3">Name</div>
                    <div className="col font-weight-bold p-3">Actions</div>
                </div>
                {categories.map((category) => (
                    <div className="row" key={category.id}>
                        <div className="col">{category.name}</div>
                        <div className="col">
                            <button className="btn btn-sm btn-secondary me-2" data-id={category.id}>Edit</button>
                            <button className="btn btn-sm btn-danger" data-id={category.id} onClick={DeleteCategory}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryList;