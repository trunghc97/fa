class Attendance < ApplicationRecord
  belongs_to :lesson
  belongs_to :student, foreign_key: "student_code", primary_key: "code"
end
