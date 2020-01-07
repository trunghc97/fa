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
    @students = @lesson.course_class.students.map {|a| [a.code, a.name]}
    attendances = @lesson.attendances.map {|a| [a.student_code, a.created_at.strftime("%H:%M")]}
    @students.each_with_index do |student, index|
      attendances.each do |attendance|
        if student[0] == attendance[0]
          @students[index] << attendance[1]
        end
      end
    end
  end
end
