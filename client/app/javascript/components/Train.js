import React from 'react'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class Train extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      userID: "",
      openModal: false,
      notifications: null
    };
  }

  train = () => {
    axios.get('http://localhost:5000/train')
    .then((res)=> {
      this.setState({
        notifications: res.data,
        openModal: true
      })
    })
  }

  handleUpload = e => {
    e.preventDefault();
    var form = new FormData();
    const files = [...this.state.file]
    files.map((img) => {
      form.append("image", img);
    })
    form.append("userID", this.state.userID)
    axios.post('http://localhost:5000/upload-images', form,
      { headers: { "Content-type": "multipart/form-data", 'Access-Control-Allow-Origin': "*" } })
    .then((res)=> {
      this.setState({
        notifications: res.data,
        openModal: true
      })
    });
  }

  handleImageChange = e => {
    e.preventDefault();
    this.setState({
      file: e.target.files
    })
  }

  handleChange = event => {
    this.setState({ userID: event.target.value });
  }

  handleClose = () => {
    this.setState({ openModal: false })
  }

  render() {
    return(
      <div>
        <form onSubmit={(e) => this.handleUpload(e)}>
          <div className="form-group">
            <label>Student ID:</label>
            <input type="text"
              className="form-controll"
              value={this.state.userID}
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <input className="fileInput"
              type="file"
              multiple
              onChange={(e) => this.handleImageChange(e)} />
          </div>
          <button className="submitButton"
            type="submit"
            className="btn btn-primary"
            onClick={(e) => this.handleUpload(e)}>Upload Image</button>
        </form>
        <button onClick={this.train} className="btn btn-danger">Train model</button>

        <Modal show={this.state.openModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Notifications</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.notifications}
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default Train;
