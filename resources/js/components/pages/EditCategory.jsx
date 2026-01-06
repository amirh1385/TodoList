import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditCategory = () => {
    const [categoryID, setCategoryId] = useState();
    const [categoryName, setCategoryName] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const onFormSubmit = (e) => {
        e.preventDefault();
        const categoryData = {
            name: categoryName,
        };

        axios.patch(`/categories/${categoryID}`, categoryData)
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Category Updated',
                    text: 'Your category has been updated successfully!',
                });
                navigate('/cats');
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error updating category',
                    text: error.response ? error.response.data.message : error.message,
                });
            });
    };

    useEffect(() => {
        const catId = location.state?.category_id;
        if (!catId || catId === null || catId === undefined) {
            navigate("/cats");
            return;
        }

        setCategoryId(location.state?.category_id);
        axios.get(`/categories/${catId}`)
            .then(response => {
                setCategoryName(response.data.name);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching category',
                    text: error.response ? error.response.data.message : error.message,
                });
                navigate("/cats");
            });
    }, [location.state?.categroy_id, navigate]);

    return (
        <div className="container mt-5">
            <h2>Edit Category Page</h2>
            <form onSubmit={onFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                    <input type="text" className="form-control" id="categoryName" placeholder="Enter category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Apply Changes</button>
            </form>
        </div>
    );
}

export default EditCategory;