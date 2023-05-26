import React, { Component } from 'react';
import {auth} from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './signup.css';
import { Outlet, Link } from 'react-router-dom';
import { Navigate } from 'react-router';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name:'',
            password: '',
            confirmPassword: '',
            signedUp: false
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this);
    }

    handleChangeEmail(event) {
        this.setState({
            email: event.target.value
        })
    }

    handleChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    handleChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    handleChangeConfirmPassword(event) {
        this.setState({
            confirmPassword: event.target.value
        })
    }

    registerUser = () => {
        if(this.state.email === '' || this.state.password === '') {
            alert('Enter all the details to sign up!')
        }else if(this.state.password !== this.state.confirmPassword){
            alert('Passwords do not match!')
        }else {
            createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then((res) => {
                console.log(res)
                console.log('User registered successfully!')
                this.setState({signedUp: true})
            })
        }
    }

    render() {
        if (this.state.signedUp === true) {
            return( <Navigate to='/' /> )
        }else {
            return (
                <div className='SignUpForm'>
                    <br/><br/>
                    <div className='form-body'>
                        <div className='email'>
                            <input 
                            className="form-input" 
                            type="text" 
                            value={this.state.email} 
                            onChange={this.handleChangeEmail} 
                            id="email" 
                            placeholder='Email'
                            />
                        </div>
                        <br/>
                        <div className='password'>
                            <input 
                            className="form-input" 
                            type="password" 
                            value={this.state.password} 
                            onChange={this.handleChangePassword} 
                            id="password" 
                            placeholder='Password'/>
                        </div>
                        <br/>
                        <div className='password'>
                            <input 
                            className="form-input" 
                            type="password" 
                            value={this.state.confirmPassword} 
                            onChange={this.handleChangeConfirmPassword} 
                            id="confirmPassword" 
                            placeholder='Confirm Password'/>
                        </div>
                        <br/>
                        <div className="footer">
                            <button 
                            onClick={()=>this.registerUser()} 
                            type="submit" 
                            className="button"
                            > Register </button>
                        </div>
                        <div>
                            <Link to='/'>  
                            Already have an account? Login here
                            </Link>
                        </div>
                    </div>
                    <Outlet/>
                </div>
            )
        }
    }

};

export default SignUp;