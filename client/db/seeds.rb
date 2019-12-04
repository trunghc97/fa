User.create name: "admin", email: "admin@gmail.com", password: "123456"

Subject.create name: "FA1", detail: "FA1"
Subject.create name: "FA2", detail: "FA2"

CourseClass.create name: "TH2", user_id: 1, subject_id: 1
CourseClass.create name: "TH1", user_id: 1, subject_id: 2

Classroom.create room: "201C5"
Classroom.create room: "202C5"
Classroom.create room: "301C5"
Classroom.create room: "302C5"
Classroom.create room: "401C5"

Lesson.create! name: "Tiet 1", time_start: Time.now, time_end: 3.hour.from_now, classroom_id: 1, course_class_id: 1
Lesson.create! name: "Tiet 2", time_start: 1.days.from_now, time_end: 2.days.from_now, classroom_id: 1, course_class_id: 1
Lesson.create! name: "Tiet 3", time_start: 2.days.from_now, time_end: 3.days.from_now, classroom_id: 1, course_class_id: 1
Lesson.create! name: "Tiet 4", time_start: 4.days.from_now, time_end: 5.days.from_now, classroom_id: 1, course_class_id: 1

Student.create! code: 1551060791, name: "TrungHC", email: "huynhchitrung97@gmail.com"
Student.create! code: 1551061019, name: "HieuNN"
Student.create! code: 1551060594, name: "ThienNK"
Student.create! code: 1551060656, name: "ThienPV"
Student.create! code: 1551060704, name: "TungNC"

ClassStudent.create course_class_id: 1, student_code: 1551060791
ClassStudent.create course_class_id: 1, student_code: 1551061019
ClassStudent.create course_class_id: 1, student_code: 1551060594
ClassStudent.create course_class_id: 1, student_code: 1551060656
ClassStudent.create course_class_id: 1, student_code: 1551060704
