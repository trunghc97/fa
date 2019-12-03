class User < ApplicationRecord
  devise :database_authenticatable, :rememberable, :validatable
  has_many :course_classes
end
