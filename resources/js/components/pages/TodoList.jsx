import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();
    const DeleteTodo = () => {
        var todoId = event.target.getAttribute('data-id');
        axios.delete(`/todos/${todoId}`)
            .then(response => {
                setTodos(todos.filter(todo => todo.id != todoId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'The todo has been deleted successfully.',
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
    const ToggleTodoStatus = () => {
        var todoId = event.target.getAttribute('data-id');
        axios.patch(`/todos/${todoId}`, {
            is_completed: event.target.checked
        })
            .then(response => {
                const updatedTodos = todos.map(todo => {
                    if (todo.id == todoId) {
                        todo.completed = !todo.completed;
                    }
                    return todo;
                });
                setTodos(updatedTodos);
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
        axios.get('/todos')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error fetching the todo list. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    }, []);

    return (
        <div className="container mt-5 border p-5">
            <h1 className="center">Todo List</h1>
            <div className="d-flex justify-content-between mt-2">
                <Link className="btn btn-primary" to="/create-todo">Add Todo</Link>
                <button className="btn btn-primary" onClick={() => navigate('/cats')}>Categories</button>
            </div>
            <div className="table mt-2">
                <div className="row">
                    <div className="col font-weight-bold p-3">Title</div>
                    <div className="col font-weight-bold p-3">Description</div>
                    <div className="col font-weight-bold p-3">Category</div>
                    <div className="col font-weight-bold p-3">Actions</div>
                    <div className="col font-weight-bold p-3">Status</div>
                </div>
                {todos.map((todo) => (
                    <div className="row" key={todo.id}>
                        <div className="col">{todo.title}</div>
                        <div className="col">{todo.description}</div>
                        <div className="col">{todo.category ? todo.category.name : ""}</div>
                        <div className="col">
                            <button className="btn btn-sm btn-secondary me-2" data-id={todo.id}>Edit</button>
                            <button className="btn btn-sm btn-danger" data-id={todo.id} onClick={DeleteTodo}>Delete</button>
                        </div>
                        <div className="col d-flex align-items-center">
                            <input type="checkbox" checked={todo.completed} data-id={todo.id} readOnly />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TodoList;