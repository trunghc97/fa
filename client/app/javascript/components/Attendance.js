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
      studentInformation: null,
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
      .then((res) => {
        const token = document.getElementsByName('csrf-token')[0].content;
        axios.get(`http://localhost:3000/students/${res.data}`, {headers: {'X-CSRF-Token': token}
        }).then((response) => {
            this.setState({
              openModal: true,
              studentInformation: response.data.student.name,
              studentCode: response.data.student.code
            })
        });
      });
  }

  openCam = () => {
    this.setState({ openCam: !this.state.openCam })
  }

  handleClose = () => {
    this.setState({ openModal: false })
  }

  handleAttendance = () => {
    const token = document.getElementsByName('csrf-token')[0].content;
    axios.post(`http://localhost:3000/lessons/${this.props.lesson.id}/attendances`,
      {lessons: {student_code: this.state.studentCode, lesson_id: this.props.lesson.id}},
      {headers: {'X-CSRF-Token': token}
    }).then(function (response) {
        window.location.reload();
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
            <Modal.Title>Submit Attendance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.studentCode + " - " + this.state.studentInformation}
          </Modal.Body>
          <Modal.Footer>
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
