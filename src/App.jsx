import React, { Component } from "react";
import Initiative from "./components/Initiative";
import "./styles/index.scss";
import ReactModal from 'react-modal';
import ModalManager from './components/reusable/Modals/ModalManager';

class App extends Component {
  render() {
    return (
      <main className="main">
        <Initiative />
        <ModalManager/>
      </main>
    );
  }
}

ReactModal.setAppElement('#root');

export default App;
