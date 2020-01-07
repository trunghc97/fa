class Student < ApplicationRecord
  self.primary_key = "code"

  has_many :class_students
  has_many :course_classes, through: :class_students
  has_many :attendances, foreign_key: :student_code
end
