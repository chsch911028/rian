import React, { Component } from 'react';
import UsersList from './UsersList';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ChangeNameForm from './ChangeNameForm';
import * as actions from '../../actions/chatActions';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';
import { Modal, DropdownButton, MenuItem, Button, Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';
import io from 'socket.io-client';
import { SocketProvider } from 'socket.io-react';
const socket = io('/chat');
      socket.on('connectMsg', (data) => {
//           console.log('connected!!!', data)

        });

      


export default class Chat extends Component {
  // static propTypes = {
  //   addTodo: PropTypes.func.isRequired
  // };

  constructor(props) {
    super(props);
    this.state = {
      privateChannelModal: false,
      targetedUser: '',
      hiddenFlag: true
    }
    this.newUser = this.newUser.bind(this);
    this.updateMessage = this.getMessages.bind(this);
    this.updateUser = this.joinUsers.bind(this);
    // var room = 'testroom';
    socket.emit('init', 'good!')

    
  }

  newUser(user){
      this.props.newUser(user)
  }

  getMessages(msg){
      this.props.getMessage(msg)
  }

  joinUsers(user){
      this.props.userJoin(user)
  }

  componentWillUnmount() {
    socket.off('init', this.newUser)
    socket.off('send:message', this.updateMessage);
    socket.off('user:join', this.updateUser)
  }

  componentDidMount() {
    
    if(!!this.props.User._id){
        // get chat logs from DB
        let Id = {id: this.props.User._id}
        this.props.chatRequest(Id)
    }
    socket.on('init', this.newUser); 
    socket.on('send:message', this.updateMessage);   
    socket.on('user:join', this.updateUser);
    socket.on('user:left', user => this.props.userLeft(user));
  }  
  

  handleMessageSubmit(message){
    socket.emit('send:message', message);
    this.props.chatPost(message)
  }

  handleKeyPress(val){
      if(val === '@'){
        this.setState({
            hiddenFlag: false
        })
      } else {
        this.setState({
            hiddenFlag: true
        })
      }
  }
  
  render() {
    return (
      <Grid>
        
        <Row className='show-grid'>
          <Col md={12}  >
            <SocketProvider socket={socket}>
            <UsersList
              users={this.props.users}
              updateMessage={this.updateMessage}
              hiddenFlag={this.state.hiddenFlag}
            />
            </SocketProvider>
          
            <SocketProvider socket={socket}>
            <MessageList
              User={this.props.User}
              users={this.props.users}
              Chatlog={this.props.Chatlog}
              ChatHistory={this.props.ChatHistory}
            />
            </SocketProvider>
            <SocketProvider socket={socket}>
            <MessageForm
              chatPost={this.props.chatPost}
              onMessageSubmit={this.handleMessageSubmit.bind(this)}  
              users={this.props.users}
              handleKey={this.handleKeyPress.bind(this)}
            />  
            </SocketProvider>
          </Col>  
        </Row>  
      </Grid>
    );
  }
}


