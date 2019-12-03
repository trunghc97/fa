class CourseClass < ApplicationRecord
  belongs_to :user
  belongs_to :subject

  has_many :class_students
  has_many :students, through: :class_students
  has_many :lessons
end
