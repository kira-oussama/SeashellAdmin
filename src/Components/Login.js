import React , {Component} from 'react';
import Axios from 'axios';
import { Redirect } from "react-router-dom";
import './../css/personallogin.css'
import loginload from './../images/loginload.gif'
import loginbook from './../images/loginbook.svg'
import mainimg from './../images/mainimg.svg'

class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            redirect : false,
            is_loading : false,
            error:''
        }

        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    }


    componentDidMount(){
        var acessToken = localStorage.getItem('userData');
        if(acessToken){
            this.setState({redirect:true})
        }
    }
    
    emailChangeHandler(event){
        this.setState({email:event.target.value});
    }

    passwordChangeHandler(event){
        this.setState({password:event.target.value});
    }

    loginUser(event){
        event.preventDefault();
        this.setState({is_loading:true})
        document.querySelector('.loginBtn').setAttribute('disabled','')

        const that = this;
        Axios.post('http://localhost:8000/api/admin/login',{
            email: this.state.email,
            password: this.state.password
        })
        .then(function(response){
            if(response.data.acessToken){
                localStorage.setItem('userData' , JSON.stringify(response.data));
                that.setState({is_loading:false,redirect:true})
            }else{
                that.setState({is_loading:false,error:response.data.error})
                document.querySelector('.loginBtn').removeAttribute('disabled')
            }
        })
        .catch(function(errors){
            console.log(errors)
        })

    }


    render(){

        if(this.state.redirect){
            return <Redirect to={'/'} />
        }

        return (
        <div className='container'>
            <img src={mainimg} alt="" className='mainimg' />
            <div className="formContent">
                <img src={loginbook} alt="" height='100px' className='loginbook' />
                <h1>ADMIN LOGIN</h1>
                <form>
                    <div className="form-group row">
                      <input type="email" className="form-control" onChange={this.emailChangeHandler} value={this.state.email} placeholder="Entrez Votre Email..." />
                    </div>

                    <div className="form-group row">
                      <input type="password" className="form-control" onChange={this.passwordChangeHandler} value={this.state.password} placeholder="Entrez Votre Mot De Passe..." />
                    </div>

                    <div className="row">
                        <button className="btn btn-primary btn-lg col-12 loginBtn" onClick={this.loginUser.bind(this)}>
                            Login
                            <img src={this.state.is_loading ? loginload : ''} alt="" className='loginload'/>
                        </button>
                    </div>

                </form>
            </div>

            <div className="alert alert-red alert-dismissible fade hide" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    <span className="sr-only">Close</span>
                </button>
                <h1>{this.state.error}</h1>
            </div>

        </div>
        )

    }

}

export default Login;