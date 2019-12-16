class Lesson < ApplicationRecord
  belongs_to :classroom
  belongs_to :course_class

  has_many :attendances
end
