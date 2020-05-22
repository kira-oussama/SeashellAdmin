import React, { Component } from 'react'
import './../../css/personalshow.css'
import Axios from 'axios'
import Exemplaires from './Exemplaires'

class Show extends Component {

    constructor(props){
        super(props)
        this.state ={
            id:'',
            photo:'',
            titre :'',
            auteur:'',
            doctype:'',
            editeur:'',
            prix:'',
            encadreur:'',
            niveau:'',
            theme:'',
            errors:[],
            is_loading:false,
        }
        this.setDefaultState()

        this.setDefaultState = this.setDefaultState.bind(this)
    }

    setDefaultState(){
        var id = window.location.href
        id = id.replace('http://localhost:3000/document/show/','')
        
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;

        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(`http://localhost:8000/api/admin/document/show/${id}`,headers)
        .then(response=>{
            this.setState({id,titre:response.data.titre,auteur:response.data.auteur,photo:response.data.photo});
            if(response.data.livre){
                this.setState({
                    doctype : 'livre',
                    editeur : response.data.livre.editeur,
                    prix : response.data.livre.prix
                })
            }else{
                this.setState({
                    doctype: 'memoire',
                    encadreur: response.data.memoire.encadreur,
                    theme: response.data.memoire.theme,
                    niveau: response.data.memoire.niveau
                })
            }
            this.setState({is_loading:false})
        })
        .then(error=>{
            console.log(error)
        })
    }

    render() {
        var {id,photo,titre,auteur,doctype,editeur,prix,encadreur,niveau,theme} = this.state
        if(doctype === 'livre'){
            return(
                <div className='profilecontainer'>

                    <img className='usershowimg' src={photo} alt="document"/>
                    <h1 className='userinfo username'>{titre}</h1>
                    <h5 className='userinfo'>{auteur}</h5>
                    <h1 className='userinfo'>{doctype}</h1>
                    <h1 className='userinfo'>Editeur : {editeur}</h1>
                    <h1 className='userinfo'>Prix : {prix}</h1>
                    <div className="clear"></div>

                    <Exemplaires document_id={id}/>
                </div>
            );
        }else if(doctype === 'memoire'){
            return(
                <div className='profilecontainer'>

                    <img className='usershowimg' src={photo} alt="document"/>
                    <h1 className='userinfo username'>{titre}</h1>
                    <h5 className='userinfo'>{auteur}</h5>
                    <h1 className='userinfo'>{doctype}</h1>
                    <h1 className='userinfo'>Encadreur : {encadreur}</h1>
                    <h1 className='userinfo'>Niveau : {niveau}</h1>
                    <h1 className='userinfo'>Theme : {theme}</h1>
                    <Exemplaires document_id={id} />
                </div>
            )
        }

        return(
        <div></div>
        )
       
    }
}

export default Show
