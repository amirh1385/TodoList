import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

const Verify = () => {
    const [code, setCode] = useState('');
    const onFormSubmit = (event) => {
        event.preventDefault();
        axios.post('/verify-otp', {
            phone: phone,
            code: code
        }).then(response => {
            localStorage.setItem('auth_status', 'true');
            Swal.fire({
                title: 'Verified!',
                text: 'Your OTP has been verified successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            navigate('/');
        }).catch(error => {
            Swal.fire({
                title: 'Error!',
                text: 'Invalid OTP. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }
    const navigate = useNavigate();
    const [phone, setPhone] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const phoneFromState = location.state?.phone;

        if (!phoneFromState) {
            navigate('/login');
            return;
        }

        setPhone(phoneFromState);
    }, [location.state?.phone, navigate]);

    return (
        <div className="container mt-5">
            <h1 className="center">Verify OTP</h1>
            <form onSubmit={onFormSubmit}>
                <div>
                    <label htmlFor="otp" className="form-label">Code:</label>
                    <input id="otp" name="otp" required className="form-control" value={code} onChange={(event) => { setCode(event.target.value) }} />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Verify</button>
            </form>
        </div>
    );
}

export default Verify;