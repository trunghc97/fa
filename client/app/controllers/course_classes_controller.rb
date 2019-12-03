class CourseClassesController < ApplicationController
  def index
    @classes = CourseClass.all
  end
end
