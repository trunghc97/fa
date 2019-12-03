class ClassStudent < ApplicationRecord
  belongs_to :course_class
  belongs_to :student
end
