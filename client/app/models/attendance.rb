class Attendance < ApplicationRecord
  belongs_to :lesson
  belongs_to :student, foreign_key: "student_code", primary_key: "code"

  validates_uniqueness_of :student_code, scope: :lesson_id
end
