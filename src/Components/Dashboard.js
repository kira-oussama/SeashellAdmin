import React , {Component} from 'react'
import { Redirect} from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

class Dashboard extends Component{

    constructor(props){
        super(props);
        this.state = {
            redirect:false,
            info : JSON.parse( localStorage.getItem('userData') )
        }
    }

    componentDidMount(){
        var user = localStorage.getItem('userData')
        if(!user){
            this.setState({redirect:true})
        }
    }


    render(){

        if(this.state.redirect){
            return <Redirect to={'/login'} />
        }

        if(this.state.info){
            return (
            <div>
                <Navbar />
                <Sidebar />
            </div>
            );

        }

        return <div></div>

    }
}

export default Dashboard