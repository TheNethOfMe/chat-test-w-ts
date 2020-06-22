import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChatContext } from './ChatContext';
import { ChatMessage, ChatState } from './types';

class App extends React.Component {
  static contextType = ChatContext;

  state: ChatState = {
    messages: [
      {
        message: 'Welcom! Type a message and press Send to continue the chat.',
        author: 'Bot'
      }
    ],
    input: ''
  }

  componentDidMount() {
    // connect to socket from our context
    this.context.init();

    // retrieve observable
    const observable = this.context.onMessage();

    // subscribe to observable
    observable.subscribe((m: ChatMessage) => {
      // add incoming message to state
      let messages = this.state.messages;
      messages.push(m);

      this.setState({ messages: messages });
    });
  }

  componentWillUnmount() {
    this.context.disconnect();
  }

  render() {
    const updateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({ input: e.target.value });
    }

    const handleMessage = (): void => {
      // author name is hardcoded for simplicity
      const author: string = 'Bill';

      // call send() if input state is provided
      if (this.state.input !== '') {
        this.context.send({
          message: this.state.input,
          author: author
        });

        // reset input state
        this.setState({ input: '' });
      }
    }

    let msgIndex = 0;

    return(
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-chatbox">
          {this.state.messages.map((msg: ChatMessage) => {
            msgIndex++;
            return (
              <div key={msgIndex}>
                <p>{msg.author}</p>
                <p>{msg.message}</p>
              </div>
            )
          })}
        </div>
        <input 
          className="App-Textarea" 
          placeholder="Type your message here..." 
          onChange={updateInput} 
          value={this.state.input} 
        />
        <button onClick={() => { handleMessage() }}>Send Message</button>
      </div>
    )
  }

}

export default App;
