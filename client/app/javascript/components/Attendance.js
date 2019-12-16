import React from 'react'
import axios from 'axios';
import Webcam from "react-webcam";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: '',
      webcamRef: React.createRef(),
      imageSrc: null,
      openCam: false,
      openModal: false,
      studentCode: null,
      videoConstraints: {
        width: 800,
        height: 600,
        facingMode: "user"
      }
    };
  }

  capture = () => {
    this.setState({
      imageSrc: this.state.webcamRef.current.getScreenshot()
    }, () => {
      this.setState({ imagePreviewUrl: this.state.imageSrc })
    });
  }

  handleSubmit = () => {
    var form = new FormData();
    form.append('image', this.state.imageSrc);
    axios.post('http://localhost:5000/attendances', form)
      .then(function (response) {
        this.openModal(response);
      });
  }

  openCam = () => {
    this.setState({ openCam: !this.state.openCam })
  }

  openModal = studentCode => {
    const token = document.getElementsByName('csrf-token')[0].content;
    axios.get(`http://localhost:3000/users/${studentCode}`, {headers: {'X-CSRF-Token': token}
    }).then(function (response) {
        console.log(response);
        // TO DO setState studentCode
        this.setState({ openModal: true })
    });
  }

  handleClose = () => {
    this.setState({ openModal: false })
  }

  handleAttendance = () => {
    const token = document.getElementsByName('csrf-token')[0].content;
    axios.post("http://localhost:3000/lessons",
      {lessons: {student_code: this.state.studentCode, lesson_id: this.props.lesson.id}},
      {headers: {'X-CSRF-Token': token}
    }).then(function (response) {
        console.log(response);
    });
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let webcam, tool = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} />
    }

    if(this.state.openCam) {
      webcam = <Webcam
                audio={false}
                height={240}
                ref={this.state.webcamRef}
                screenshotFormat="image/jpeg"
                width={240}
                videoConstraints={this.state.videoConstraints}
              />
      tool = <div className="row">
                <button className="btn btn-primary" onClick={this.capture}>Capture photo</button>
                <button className="btn btn-success" onClick={this.handleSubmit}>Send Images</button>
              </div>
    }

    return (
      <div className="previewComponent">
        <div className="row">
          <button onClick={this.openCam} className="btn btn-primary">Attendance</button>
        </div>
        <div className="row">
          <div className="col-3">
            {webcam}
          </div>
          <div className="col-3">
            {$imagePreview}
          </div>
        </div>

        {tool}

        <Modal show={this.state.openModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleAttendance}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
    )
  }
}

export default Attendance;
