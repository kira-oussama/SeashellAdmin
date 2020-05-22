import React, { Component } from 'react'
import './../../css/personalsearch.css'
import Axios from 'axios'
import loading from './../../images/loading.gif'
import User from './User'


class Search extends Component {

    constructor(props){
        super(props)
        this.state = {
            nom: '',
            prenom: '',
            sexe: '',
            users:[],
            is_loading: false,
            next:'',
            prev:'',
            last:''
        }
        this.nomChangeHandler = this.nomChangeHandler.bind(this)
        this.prenomChangeHandler = this.prenomChangeHandler.bind(this)
        this.sexeChangeHandler = this.sexeChangeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.paginate_result = this.paginate_result.bind(this)
    }


    nomChangeHandler(event){
        this.setState({nom:event.target.value})
    }

    prenomChangeHandler(event){
        this.setState({prenom:event.target.value})
    }

    sexeChangeHandler(event){
        this.setState({sexe:event.target.value})
    }

    submitHandler(event){
        event.preventDefault();
        this.setState({is_loading:true})
        
        var  nom  = this.state.nom
        var  prenom = this.state.prenom
        var  sexe =  this.state.sexe

        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
        // console.log(token)

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        document.querySelector('#prev-page').setAttribute('disabled','')

        const that = this;

        Axios.get(`http://localhost:8000/api/admin/abonne/search?nom=${nom}&prenom=${prenom}&sexe=${sexe}`,headers)
        .then((response) =>{
            that.setState({users:response.data.data})
            this.setState({is_loading:false,next:response.data.next_page_url,prev:response.data.prev_page_url,last:response.data.last_page_url})
            document.querySelector('.pagination-buttons').style.display = 'block'
            if(response.data.last_page_url === response.data.first_page_url){
                document.querySelector('#next-page').setAttribute('disabled','')
            }
        })
        .catch((error) =>{
            console.log(error)
        })

    }

    deleteUser(numcarte){
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
    
        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        document.querySelector(".disable").style.display = 'block';
        document.querySelector(".confirm-box").style.display = 'block';
        
        document.querySelector('#non').addEventListener('click',()=>{
            document.querySelector(".disable").style.display = 'none';
            document.querySelector(".confirm-box").style.display = 'none';
        })

        document.querySelector('#oui').addEventListener('click',()=>{
            const users = this.state.users.filter(user => user.numcarte !== numcarte);
            this.setState({ users});
            
            Axios.delete(`http://localhost:8000/api/admin/abonne/delete/${numcarte}`,headers)
            .then(response =>{
                console.log(response)
            })
            .catch(error =>{
                console.log(error)
            })
            
            document.querySelector(".disable").style.display = 'none';
            document.querySelector(".confirm-box").style.display = 'none';

        })

        
    }


    paginate_result(event , url){
        event.preventDefault();
        this.setState({is_loading:true})
        
        var  nom  = this.state.nom
        var  prenom = this.state.prenom
        var  sexe =  this.state.sexe

        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
        // console.log(token)

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        const that = this;

        if(url === this.state.last){
            document.querySelector('#next-page').setAttribute('disabled','')
            document.querySelector('#prev-page').removeAttribute('disabled')
        }else{
            document.querySelector('#next-page').removeAttribute('disabled')
            document.querySelector('#prev-page').removeAttribute('disabled')
        }

        Axios.get(`${url}&nom=${nom}&prenom=${prenom}&sexe=${sexe}`,headers)
        .then((response) =>{
            that.setState({users:response.data.data})
            this.setState({is_loading:false,next:response.data.next_page_url,prev:response.data.prev_page_url})
            document.querySelector('.pagination-buttons').style.display = 'block'
        })
        .catch((error) =>{
            console.log(error)
        })
    }
    

    render() {
        return (
            <div className="form-container">
                <div className="disable"></div>
                <div className="confirm-box">
                    <h3>Êtes-vous sûr de vouloir supprimer cet abonné?</h3>
                    <button className="btn btn-primary" id="non">Non</button>
                    <button className="btn btn-danger" id="oui">Oui</button>
                </div>
            
                <div className="row">
                    <div className="form-group col-3">
                      <input type="text" className="form-control" onChange={this.nomChangeHandler} value={this.state.nom} id="nom" placeholder="Entrer un nom..." />
                    </div>

                    <div className="form-group col-3">
                      <input type="text" className="form-control" onChange={this.prenomChangeHandler} value={this.state.prenom} id="prenom" placeholder="Entrer un prenom..." />
                    </div>

                    <div className="form-group col-3">
                      <select className="form-control" onChange={this.sexeChangeHandler} value={this.state.sexe} id="sexe">
                        <option disabled defaultValue>sexe</option>
                        <option value=''>Tout</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                      </select>
                    </div>

                    <button type="button" id="searchbtn" className="btn btn-primary btn-md" onClick={this.submitHandler} >Rechercher <i className="fa fa-search" aria-hidden="true"></i></button>
                </div>

                <div className="pagination-buttons row">
                    <button className="btn btn-danger" id='prev-page' onClick={event =>this.paginate_result(event,this.state.prev)} > <i className="fa fa-arrow-left" aria-hidden="true"></i> </button>&nbsp;
                    <button className="btn btn-primary" id='next-page' onClick={event =>this.paginate_result(event,this.state.next)}> <i className="fa fa-arrow-right" aria-hidden="true"></i></button>
                </div>

                <div className="loadingimg">
                    <img src={this.state.is_loading ? loading : ''} alt={this.state.is_loading ? 'loading ...' : ''}/>
                </div>

                <div className="row results">
                    {
                        this.state.users.map((user)=>{
                            return(
                                <User key={user.numcarte} 
                                    numcarte ={user.numcarte} 
                                    nom={user.nom} 
                                    prenom={user.prenom}
                                    email={user.email}
                                    numtel={user.numtel}
                                    sexe={user.sexe}
                                    adresse={user.adresse}
                                    onDelete={this.deleteUser}
                                />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Search
