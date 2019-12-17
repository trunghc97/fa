from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from flask import Flask
from flask import render_template, request, json
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
import tensorflow.compat.v1 as tf
import src.facenet
import pickle
import src.align.detect_face
import src.align_dataset_mtcnn
import src.classifier
import numpy as np
import cv2
import base64
import os
import pdb;

tf.disable_v2_behavior()

MINSIZE = 20
THRESHOLD = [0.6, 0.7, 0.7]
FACTOR = 0.709
IMAGE_SIZE = 182
INPUT_IMAGE_SIZE = 160
CLASSIFIER_PATH = 'Models/facemodel.pkl'
FACENET_MODEL_PATH = 'Models/20180402-114759.pb'

# Load The Custom Classifier
with open(CLASSIFIER_PATH, 'rb') as file:
    model, class_names = pickle.load(file)
print("Custom Classifier, Successfully loaded")

tf.Graph().as_default()

gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=0.6)
sess = tf.Session(config=tf.ConfigProto(gpu_options=gpu_options, log_device_placement=False))

# Load the model
print('Loading feature extraction model')
src.facenet.load_model(FACENET_MODEL_PATH)

# Get input and output tensors
images_placeholder = tf.get_default_graph().get_tensor_by_name("input:0")
embeddings = tf.get_default_graph().get_tensor_by_name("embeddings:0")
phase_train_placeholder = tf.get_default_graph().get_tensor_by_name("phase_train:0")
embedding_size = embeddings.get_shape()[1]
pnet, rnet, onet = src.align.detect_face.create_mtcnn(sess, "src/align")

app = Flask(__name__)
CORS(app)


@app.route('/')
@cross_origin()
def index():
    return "OK!"


@app.route('/attendances', methods=['POST'])
@cross_origin()
def upload_img_file():
    if request.method == 'POST':
        # base 64
        if 'image' in request.files:
            f = request.files['image'].read()
        else:
            f = request.form.get('image').split(',')[1]
            f = base64.b64decode(f)
            # w = int(request.form.get('w'))
            # h = int(request.form.get('h'))
        # decoded_string = base64.b64decode(f)
        frame = np.fromstring(f, dtype=np.uint8)
        # frame = frame.reshape(,,3)
        frame = cv2.imdecode(frame, cv2.IMREAD_ANYCOLOR)  # cv2.IMREAD_COLOR in OpenCV 3.1
        bounding_boxes, _ = src.align.detect_face.detect_face(frame, MINSIZE, pnet, rnet, onet, THRESHOLD, FACTOR)

        faces_found = bounding_boxes.shape[0]
        name = []

        if faces_found > 0:
            det = bounding_boxes[:, 0:4]
            bb = np.zeros((faces_found, 4), dtype=np.int32)
            for i in range(faces_found):
                bb[i][0] = det[i][0]
                bb[i][1] = det[i][1]
                bb[i][2] = det[i][2]
                bb[i][3] = det[i][3]
                # cropped = frame
                cropped = frame[bb[i][1]:bb[i][3], bb[i][0]:bb[i][2], :]
                if cropped.any():
                    scaled = cv2.resize(cropped, (INPUT_IMAGE_SIZE, INPUT_IMAGE_SIZE),
                                        interpolation=cv2.INTER_CUBIC)
                    scaled = src.facenet.prewhiten(scaled)
                    scaled_reshape = scaled.reshape(-1, INPUT_IMAGE_SIZE, INPUT_IMAGE_SIZE, 3)
                    feed_dict = {images_placeholder: scaled_reshape, phase_train_placeholder: False}
                    emb_array = sess.run(embeddings, feed_dict=feed_dict)
                    predictions = model.predict_proba(emb_array)
                    best_class_indices = np.argmax(predictions, axis=1)
                    best_class_probabilities = predictions[
                        np.arange(len(best_class_indices)), best_class_indices]
                    best_name = class_names[best_class_indices[0]]
                    print("Name: {}, Probability: {}".format(best_name, best_class_probabilities))

                    if best_class_probabilities > 0.4:
                        # name = class_names[best_class_indices[0]]
                        name.append(class_names[best_class_indices[0]])
                    else:
                        # name = "Unknown"
                        name.append("Unknown")

        return json_response(name)


@app.route('/train', methods=['GET'])
@cross_origin()
def train_model():
    result = src.align_dataset_mtcnn.main()
    src.classifier.main()
    return json_response(result)


@app.route('/upload-images', methods=['POST'])
@cross_origin()
def upload_images():
    if request.method == "POST":
        files = request.files.getlist("image")
        userID = request.form.get('userID')
        folder = "Dataset/FaceData/raw/" + userID
        if not os.path.exists(folder):
            os.mkdir(folder)
        for file in files:
            file.save(os.path.join(folder, file.filename))
    return json_response("Upload success %d images" %(len(files)))


def json_response(payload, status=200):
    return json.dumps(payload), status, {'content-type': 'application/json'}


if __name__ == '__main__':
    app.run(debug=True)
