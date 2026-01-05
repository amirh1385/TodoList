import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const onFormSubmit = (event) => {
        event.preventDefault();
        axios.post('/send-otp', {
            phone: phone
        }).then(response => {
            navigate('/verify', { state: { phone } });
        }).catch(error => {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error sending the OTP. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    return (
        <div className="container mt-5">
            <h1 className="center">Login Page</h1>
            <form onSubmit={onFormSubmit}>
                <div>
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <input id="phone" name="phone" required className="form-control" value={phone} onChange={(event) => { setPhone(event.target.value) }} />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Login</button>
            </form>
        </div>
    );
}

export default Login;