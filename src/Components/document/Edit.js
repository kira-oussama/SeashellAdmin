import React, { Component } from 'react'
import Axios from 'axios'
import anime from 'animejs/lib/anime.es'
import loading from './../../images/loading.gif'
import uploaded from './../../images/encodeduploaded'
import upload from './../../images/encodeduploaded'
import { Redirect } from 'react-router-dom'

class Edit extends Component {

    constructor(props){
        super(props);
        this.state={
            id:'',
            titre:'',
            auteur:'',
            doctype:'',
            editeur:'',
            prix:'',
            encadreur:'',
            niveau:'',
            theme:'',
            errors:[],
            is_loading:false,
            redirect : false
        }

        this.titreChangeHandler = this.titreChangeHandler.bind(this)
        this.auteurChangeHandler = this.auteurChangeHandler.bind(this)
        this.doctypeChangeHandler = this.doctypeChangeHandler.bind(this)
        this.editeurChangeHandler = this.editeurChangeHandler.bind(this)
        this.prixChangeHandler = this.prixChangeHandler.bind(this)
        this.encadreurChangeHandler = this.encadreurChangeHandler.bind(this)
        this.niveauChangeHandler = this.niveauChangeHandler.bind(this)
        this.themeChangeHandler = this.themeChangeHandler.bind(this)
        this.formbackfromfailed = this.formbackfromfailed.bind(this)
        // this.deletewrongfields = this.deletewrongfields.bind(this)
        this.imageChangeHandler = this.imageChangeHandler.bind(this)
        this.uploadHandler = this.uploadHandler.bind(this)
        this.defaultHandler = this.defaultHandler.bind(this)
        this.submitChangeHandler = this.submitChangeHandler.bind(this)
    }

    componentDidMount(){
        var id = window.location.href
        id = id.replace('http://localhost:3000/document/edit/','')
        this.setState({id})
        
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
            this.setState({titre:response.data.titre,auteur:response.data.auteur,photo:response.data.photo});
            if(response.data.livre){
                this.setState({
                    doctype : 'livre',
                    editeur : response.data.livre.editeur,
                    prix : response.data.livre.prix
                })
            }else{
                document.querySelector('.memoire').style.display = 'block';
                document.querySelector('.livre').style.display = 'none';
                document.querySelector('.editeur').removeAttribute('required');
                document.querySelector('.prix').removeAttribute('required');

                document.querySelector('.encadreur').setAttribute('required','');
                document.querySelector('.niveau').setAttribute('required','');
                document.querySelector('.theme').setAttribute('required','');
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

    titreChangeHandler = event=>{
        this.setState({titre:event.target.value})
    }

    auteurChangeHandler = event=>{
        this.setState({auteur:event.target.value})
    }

    doctypeChangeHandler = event=>{
        var doctype = event.target.value;
        this.setState({doctype})
        if(doctype === 'livre'){
            document.querySelector('.livre').style.display = 'block';
            document.querySelector('.memoire').style.display ='none';
            document.querySelector('.encadreur').removeAttribute('required');
            document.querySelector('.niveau').removeAttribute('required');
            document.querySelector('.theme').removeAttribute('required');

            document.querySelector('.editeur').setAttribute('required','');
            document.querySelector('.prix').setAttribute('required','');
        }else if(doctype === 'memoire'){
            document.querySelector('.memoire').style.display = 'block';
            document.querySelector('.livre').style.display = 'none';
            document.querySelector('.editeur').removeAttribute('required');
            document.querySelector('.prix').removeAttribute('required');

            document.querySelector('.encadreur').setAttribute('required','');
            document.querySelector('.niveau').setAttribute('required','');
            document.querySelector('.theme').setAttribute('required','');
        }

    }

    editeurChangeHandler = event=>{
        this.setState({editeur:event.target.value})
    }

    prixChangeHandler = event=>{
        this.setState({prix:event.target.value})
    }

    encadreurChangeHandler = event=>{
        this.setState({encadreur:event.target.value})
    }

    niveauChangeHandler = event=>{
        this.setState({niveau:event.target.value})
    }

    themeChangeHandler = event=>{
        this.setState({theme:event.target.value})
    }


    formbackfromfailed = event =>{
        document.querySelector('.userform').style.marginLeft = '25%';
        anime({
            targets : '.alert-danger',
            translateX : 1000
        })
        
        for(var i=0 ; i< this.state.errors.length ; i++){
            this.deletewrongfields(this.state.errors[i])
        }
    }

    deletewrongfields(error){
        
        var regex_titre = /Le titre/;
        var regex_auteur = /Le auteur/;
        var regex_editeur = /Le editeur/;
        var regex_prix = /Le prix/;
        var regex_encadreur = /Le encadreur/;
        var regex_theme = /Le theme/;
        

        // Regex conditions
        if(regex_titre.test(error)){
            document.querySelector('#titre').value = ''
            this.setState({titre:""})
        }
    
        if(regex_auteur.test(error)){
            document.querySelector('#auteur').value = ''
            this.setState({auteur:""})
        }
    
        if(regex_editeur.test(error)){
            document.querySelector('#editeur').value = ''
            this.setState({editeur:""})
        }
    
        if(regex_prix.test(error)){
            document.querySelector('#prix').value = ''
            this.setState({prix:""})
        }
    
        if(regex_encadreur.test(error)){
            document.querySelector('#encadreur').value = ''
            this.setState({encadreur:""})
        }
    
        if(regex_theme.test(error)){
            document.querySelector('#theme').value = ''
            this.setState({theme:""})
        }
        //regex end
    }

    imageChangeHandler= event=>{
        if(document.querySelector('#image').value){
            document.querySelector('#imagedesign').style.backgroundImage = `url(${uploaded})`;
        }
    }

    uploadHandler = event =>{
        event.preventDefault();
        var fd = new FormData();
        var file = document.querySelector('#image').files[0];
        fd.append('file',file);
        
        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;
        
        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }
        
        Axios.post(`http://localhost:8000/api/admin/document/storeimg/${this.state.id}`,fd,headers)
        .then(response=>{
    
            this.setState({redirect:true})
    
            document.querySelector('.userform').style.marginLeft = '25%';
            anime({
                targets : '.image-upload',
                translateX : +1000
            })

            document.querySelector('#imagedesign').style.backgroundImage = `url(${upload})`
            
        })
        .catch(err=>{
            console.log(err)
        })



    }

    defaultHandler = event =>{
        event.preventDefault()
        this.setState({redirect:true})
    }



    submitChangeHandler = event=>{
        event.preventDefault();
        this.setState({is_loading:true})

        var token = JSON.parse(localStorage.getItem('userData'))
        token = token.acessToken;

        var postData = {};

        if(this.state.doctype === 'livre'){
            postData = {
                titre: this.state.titre,
                auteur: this.state.auteur,
                doctype: this.state.doctype,
                editeur: this.state.editeur,
                prix:this.state.prix
            }
        }else{
            postData = {
                titre: this.state.titre,
                auteur: this.state.auteur,
                doctype: this.state.doctype,
                encadreur: this.state.encadreur,
                niveau:this.state.niveau,
                theme: this.state.theme
            }
        }


        var headers = {
            headers:{
                'Accept' : 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }


        Axios.put(`http://localhost:8000/api/admin/document/update/${this.state.id}`,postData,headers)
        .then(response=>{
            // document created
            if(!response.data.errors){
                document.querySelector('.userform').style.marginLeft = '110%';
                anime({
                    targets : '.alert-success',
                    translateX : -1000
                })
                //we need to store the id to upload a picture
                this.setState({id:response.data.id,is_loading:false})
            }else if(response.data.errors){//there is an error
                
                document.querySelector('.userform').style.marginLeft = '110%';
                anime({
                    targets : '.alert-danger',
                    translateX : -1000
                })
                this.setState({errors:response.data.errors,is_loading:false})
            }
        })
        .catch(error=>{
            console.log(error)
            this.setState({is_loading:false})
        })

    }

    render() {
        if(this.state.redirect){
            return <Redirect to={'/document/search'} />
        }
        return (
            <div className='userform'>

                <div className="alert alert-success image-upload" >
                    <h1><strong>Succés</strong> le document a était ajouté.</h1>
                    <label htmlFor="image" id='imagedesign'></label>
                    <input type="file" id="image" onChange={this.imageChangeHandler}/>
                    <div className="row">
                    <button className="btn btn-danger col-2 uploadbtn" onClick={this.uploadHandler}>Uploader</button>&nbsp;&nbsp;
                    <button className="btn btn-primary col-2 uploadbtn" onClick={this.defaultHandler}>Précédent</button>
                    </div>
                </div>
        
                {
                <div className="alert alert-danger">
                    <h3>il ya un probleme</h3>
                    <ul>                    
                        {this.state.errors.map((error,index) =>{
                            return <li key={index}>{error}</li>
                        })}
                    </ul>
                    <button type="button" className="btn btn-danger btn-lg correct" onClick={this.formbackfromfailed}>Corrigé</button>
                </div>
                }

                <h1>Modifier Un Document</h1>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="titre">Titre</label>
                                <input type="text" className="form-control" onChange={this.titreChangeHandler} value={this.state.titre} id="titre" maxLength="40" minLength="4" required />  
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="auteur">Auteur</label>
                                <input type="text" className="form-control" onChange={this.auteurChangeHandler} value={this.state.auteur} id="auteur" maxLength="40" minLength="4" required />  
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor='doctype'>type du document</label>
                      <select className="form-control col-6" id='doctype' value={this.state.doctype} onChange={this.doctypeChangeHandler} required='' disabled>
                        <option value='livre'>Livre</option>
                        <option value='memoire'>Memoire</option>
                      </select>
                    </div>

                    <div className="livre">
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="editeur">Editeur</label>
                                    <input type="text" className="form-control editeur" onChange={this.editeurChangeHandler} value={this.state.editeur} id="editeur" maxLength="20" minLength="4" required/>  
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="prix">Prix</label>
                                    <input type="text" className="form-control prix" onChange={this.prixChangeHandler} value={this.state.prix} id="prix" maxLength="20" minLength="4" required/>  
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="memoire">
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="encadreur">Encadreur</label>
                                    <input type="text" className="form-control encadreur" onChange={this.encadreurChangeHandler} value={this.state.encadreur} id="encadreur" maxLength="20" minLength="4" />  
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor='niveau'>Niveau</label>
                            <select className="form-control col-6 niveau" id='niveau' value={this.state.niveau} onChange={this.niveauChangeHandler}>
                              <option value='licence'>Licence</option>
                              <option value='master1'>Master 1</option>
                              <option value='master2'>Master 2</option>
                            </select>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="theme">Theme</label>
                                    <input type="text" className="form-control theme" onChange={this.themeChangeHandler} value={this.state.theme} id="theme" maxLength="40" minLength="4" />  
                                </div>
                            </div>
                        </div>
                    </div>

                    <input className="btn btn-primary" type="button" onClick={this.submitChangeHandler} value="Modifier" />
                    &nbsp;&nbsp;<img src={this.state.is_loading? loading : ''} alt={this.state.is_loading ? 'Loading...': ''}/>
            </div>
        )
    }
}

export default Edit
