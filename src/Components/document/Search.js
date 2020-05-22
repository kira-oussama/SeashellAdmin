import React, { Component } from 'react'
import './../../css/personalsearch.css'
import Axios from 'axios'
import loading from './../../images/loading.gif'
import Document from './Document'

class Search extends Component {

    constructor(props){
        super(props);
        this.state={
            titre:'',
            auteur:'',
            documents:[],
            is_loading:false,
            next:'',
            prev:'',
            last:''
        }
        this.titreChangeHandler = this.titreChangeHandler.bind(this)
        this.auteurChangeHandler = this.auteurChangeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
    }

    titreChangeHandler = event=>{
        this.setState({titre:event.target.value})
    }

    auteurChangeHandler = event=>{
        this.setState({auteur:event.target.value})
    }

    deleteUser(id){
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
            const documents = this.state.documents.filter(doc => doc.id !== id);
            this.setState({ documents});
            
            Axios.delete(`http://localhost:8000/api/admin/document/delete/${id}`,headers)
            .then(response =>{
                // console.log(response)
            })
            .catch(error =>{
                console.log(error)
            })
            
            document.querySelector(".disable").style.display = 'none';
            document.querySelector(".confirm-box").style.display = 'none';

        })

        
    }

    submitHandler = event =>{
        event.preventDefault();
        
        var {titre,auteur} = this.state;
        
        if(titre==='' && auteur ===''){
            
        }else{
            this.setState({is_loading:true})
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

            Axios.get(`http://localhost:8000/api/admin/document/search?titre=${titre}&auteur=${auteur}`,headers)
            .then((response) =>{
                that.setState({documents:response.data.data})
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
    }
    render() {
        return (
            <div>
                <div className="form-container">
                    <div className="disable"></div>
                    <div className="confirm-box">
                        <h3>Êtes-vous sûr de vouloir supprimer cet abonné ?</h3>
                        <button className="btn btn-primary" id="non">Non</button>
                        <button className="btn btn-danger" id="oui">Oui</button>
                    </div>

                    <div className="row">
                        <div className="form-group col-3">
                          <input type="text" className="form-control" onChange={this.titreChangeHandler} value={this.state.titre} id="titre" placeholder="Entrer un titre..." />
                        </div>

                        <div className="form-group col-3">
                          <input type="text" className="form-control" onChange={this.auteurChangeHandler} value={this.state.auteur} id="auteur" placeholder="Entrer un auteur..." />
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
                            this.state.documents.map((doc)=>{
                                return(
                                    <Document key={doc.id} 
                                        titre ={doc.titre} 
                                        auteur={doc.auteur} 
                                        photo={doc.photo}
                                        id={doc.id}
                                        onDelete={this.deleteUser}
                                    />
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default Search
