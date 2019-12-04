class LessonsController < ApplicationController
  def index
    @lessons = []
    current_user.course_classes.each do |record|
      @lessons << record.lessons
    end
    @lessons.flatten!
  end
end
