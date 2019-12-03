class Lesson < ApplicationRecord
  belongs_to :classroom
  belongs_to :course_class
end
