class LessonsController < ApplicationController
  def index
    @lessons = []
    current_user.course_classes.each do |record|
      @lessons << record.lessons
    end
    @lessons.flatten!
  end

  def show
    @lesson = Lesson.find params[:id]
    @attendances = @lesson.attendances
  end
end
