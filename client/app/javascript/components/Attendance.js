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
      file: null,
      imageAttendance: false,
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
    this.setState({
      openCam: !this.state.openCam,
      imageAttendance: false
    })
  }

  imageAttendance = () => {
    this.setState ({
      openCam: false,
      imageAttendance: !this.state.imageAttendance
    })
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

  handleImageChange = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  handleUpload = e => {
    e.preventDefault();
    var form = new FormData();
    const file = this.state.file
    form.append("image", file);
    axios.post('http://localhost:5000/attendances', form,
      { headers: { "Content-type": "multipart/form-data", 'Access-Control-Allow-Origin': "*" } })
    .then((response) => {
      this.setState({
        studentCode: [...new Set(response.data)].filter(e => e !== 'Unknown'),
        openModal: true
      })
    });
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let webcam, tool, form = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} className="pre-img" />
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
    } else if (this.state.imageAttendance) {
      form = <form onSubmit={(e) => this.handleUpload(e)}>
              <input className="fileInput"
                type="file"
                multiple
                onChange={(e) => this.handleImageChange(e)} />
              <button className="submitButton btn btn-danger"
                type="submit"
                onClick={e => this.handleUpload(e)}>Upload Image</button>
            </form>
    }

    let listItems = null
    if (this.state.studentCode) {
      listItems = this.state.studentCode.map((number) =>
        <li>{number}</li>
      );
    }

    return (
      <div className="previewComponent">
        <div className="row">
          <button onClick={this.openCam} className="btn btn-primary">Camera Attendance</button>
          <button onClick={this.imageAttendance} className="btn btn-primary">Image Attendance</button>
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
        {form}

        <Modal show={this.state.openModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Submit Attendance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {listItems}
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
