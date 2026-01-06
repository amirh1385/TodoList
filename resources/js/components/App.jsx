import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import React from 'react';
import Login from './pages/Login';
import Verify from './pages/Verify';
import TodoList from './pages/TodoList';
import CategoryList from './pages/CategoryList';
import CreateTodo from './pages/CreateTodo';
import axios from 'axios';

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const root = createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/" element={<TodoList />} />
                <Route path="/cats" element={<CategoryList />} />
                <Route path="/create-todo" element={<CreateTodo />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);