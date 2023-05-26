import React, {Component} from 'react';
import {auth} from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Outlet, Link } from 'react-router-dom';
import { Navigate } from 'react-router';
import './signup.css';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            LoggedIn: false
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }
    
    handleChangeEmail(event) {
        this.setState({
            email: event.target.value
        })
    }

    handleChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    loginUser = () => {
        if(this.state.email === '' || this.state.password === '') {
            alert('Enter all the details required to SignIn')
        } else {
            signInWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then((res) => {
                console.log(res)
                console.log('User successfully logged in')
                this.setState({ LoggedIn : true })
            } 
            
            )
        }
    }

    render() {
        if (this.state.LoggedIn === true){
            return( <Navigate to='/dashboard'/> )
        }else {
            return(
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
                        <div className="footer">
                            <button 
                            onClick={()=>this.loginUser()} 
                            type="submit" 
                            className="button"
                            > Login </button>
                        </div>
                        <div>
                            <Link to='/register'>  
                            Don't have an account? Register here
                            </Link>
                        </div>
                    </div>
                    <Outlet/>
                </div>
            )
        }
    }
}

export default Login;