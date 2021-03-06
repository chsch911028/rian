import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

// Import Actions
import { userCheckAuth, userSignUp, userLogIn, userLogOut } from '../actions/UserActions';
import { projectGet, projectPost } from '../actions/ProjectActions';

// Import Component
import Header from '../components/Rian/Header';
import Navigation from '../components/Rian/Navigation.js'
import Calendar from './Calendar/Calendar.js';
import TodoContainer from './Todo/TodoContainer.js';
import WhiteBoard from './WhiteBoard/WhiteBoardContainer.js';
import FirebaseChatContainer from './FirebaseChat/FirebaseChatContainer.js';
import firebase from 'firebase';
import firebaseConfig from '../../config/firebaseConfig';
import LogIn from '../components/Rian/LogIn';
import '../styles/Rian.css';


class RianApp extends Component {

	constructor(props){
		super(props);
		this.props.userCheckAuth();
		this.state = {   
			showChat: false    
		}    
		this.clickShowChat = this.clickShowChat.bind(this)   
	}   

  componentWillReceiveProps(nextProps) {
    /*----------  파이어베이스 시작하기, 로그인했을때만!  ----------*/
    if(this.props.User._id !== nextProps.User._id && nextProps.User._id){
      firebase.initializeApp(firebaseConfig);
    }
  }	 
	clickShowChat(){  
		this.setState((prevState, props)=>(
			{
				showChat: !prevState.showChat    
			}
		))
	}

	render() {
		if(this.props.User._id === null && this.props.User.loading === false){
			return (
				<LogIn
					userSignUp={(form)=>this.props.userSignUp.bind(this)(form)}
					userLogIn={(form)=>this.props.userLogIn.bind(this)(form)}
				/>
			)
		}
		if(this.props.User.loading){
			return <div>Loading...</div>
		}
		const { main, side } = this.props
		const ShowMe = this.state.showChat ? { visibility: 'visible' } : { visibility: 'hidden' };

		return (


			<div className="App">
						<div className="Header">
							<Header 
								User={this.props.User}
								Project={this.props.Project}
								projectGet={(userId)=>this.props.projectGet.bind(this)(userId)}
							/>
						</div>
						<div className="Navigation">
							<Navigation clickShowChat={()=>this.clickShowChat()} />
							{side}
							<div className="classShowChat" style={ShowMe}>		
								<FirebaseChatContainer UserId={this.props.User._id} />		
							</div>
						</div>
						<div className="MainContent">
							{main}
						</div>
			</div>
		)
	}

}

function mapState(state) {
	return {
		User: state.User,
		Project: state.Project
	};
}

function mapDispatch(dispatch) {
	return {
		userCheckAuth: ()=> {
			dispatch(userCheckAuth())
		},
		userSignUp: (form)=> {
			dispatch(userSignUp(form))
		},
		userLogIn: (form)=>{
			dispatch(userLogIn(form))
		},
		userLogOut: ()=>{
			dispatch(userLogOut())
		},
		projectGet: (userId)=>{
			dispatch(projectGet(userId))
		}
	};
}

RianApp = DragDropContext(HTML5Backend)(RianApp)
export default connect(mapState, mapDispatch)(RianApp);




