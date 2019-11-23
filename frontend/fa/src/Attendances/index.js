import React from 'react'
import axios from 'axios';
import Webcam from "react-webcam";

class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [], imagePreviewUrl: '',
      webcamRef: React.createRef(),
      imageSrc: null,
      openCam: false,
      userID: null,
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

  train = () => {
    axios.get('http://localhost:5000/train')
    .then((res)=> {
      console.log(res)
    })
  }

  handleSubmit = () => {
    var form = new FormData();
    form.append('image', this.state.imageSrc);
    axios.post('http://localhost:5000/attendances', form)
      .then(function (response) {
        console.log(response);
      });
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
    .then(function (response) {
      console.log(response);
    });
  }

  handleImageChange = e => {
    e.preventDefault();
    // console.log(e.target.files)

    // let reader = new FileReader();
    // let file = e.target.files[0];
    this.setState({
      file: e.target.files
    })

    // reader.onloadend = () => {
    //   this.setState({
    //     file: file,
    //     imagePreviewUrl: reader.result
    //   }, () => console.log(file));
    // }

    // reader.readAsDataURL(file)
  }

  handleChange = event => {
    this.setState({ userID: event.target.value });
  }

  openCam = () => {
    this.setState({ openCam: !this.state.openCam })
  }
  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    let webcam = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} />
    } else {
      $imagePreview = <div className="previewText">Please select an Image for Preview</div>
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
    }

    return (
      <div className="previewComponent">
        <button onClick={this.openCam}>Attendance</button>
        <div className="row">
          <div className="col-6">
            {webcam}
          </div>
          <div className="col-6">
            {$imagePreview}
          </div>
        </div>
        <div className="row">
          <button onClick={this.capture}>Capture photo</button>
          <button onClick={this.handleSubmit}>Send Images</button>
        </div>
        <form onSubmit={(e) => this.handleUpload(e)}>
          <input type="text"
            value={this.state.userID}
            onChange={this.handleChange} />
          <input className="fileInput"
            type="file"
            multiple
            onChange={(e) => this.handleImageChange(e)} />
          <button className="submitButton"
            type="submit"
            onClick={(e) => this.handleUpload(e)}>Upload Image</button>
        </form>
        <button onClick={this.train}>Train model</button>
    </div>
    )
  }
}

export default Attendance;
