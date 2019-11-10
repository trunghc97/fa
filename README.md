FA by TrungHC

### Code Requirements
- Opencv(`pip3 install opencv-python`)
- Tkinter(Available in python)
- PIL (`pip3 install Pillow`)
- Pandas(`pip3 install pandas`)

### Step to run??
- Create a `TrainingImage` folder in a project.
- Open a `fa_run.py` and change the all paths with your system path
- Run `fa_run.py`.

### Project Structure

- After run you need to give your face data to system so enter your ID and name in box than click on `Take Images` button.
- It will collect 200 images of your faces, it save a images in `TrainingImage` folder
- After that we need to train a model(for train a model click on `Train Image` button.
- It will take 5-10 minutes for training(for 10 person data).
- After training click on `Automatic Attendance` ,it can fill attendace by your face using our trained model (model will save in `TrainingImageLabel` )
- it will create `.csv` file of attendance according to time & subject.
- You can store data in database (install wampserver),change the DB name according to your in `AMS_Run.py`.
- `Manually Fill Attendace` Button in UI is for fill a manually attendance (without facce recognition),it's also create a `.csv` and store in a database.
