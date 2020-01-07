class CourseClassesController < ApplicationController
  def index
    @classes = CourseClass.all
  end

  def export_excel
    @course_class = CourseClass.find params[:course_class_id]
    @students = @course_class.students.map {|a| [a.code, a.name]}
    lessons = @course_class.lessons
    @dates = lessons.map { |a| a.time_start.strftime("%d/%m/%y") }
    lessons.each_with_index do |lesson, i|
      attendances = lesson.attendances.map {|a| [a.student_code, a.created_at.strftime("%H:%M")]}
      @students.each_with_index do |student, index|
        flag = false
        attendances.each do |attendance|
          if student[0] == attendance[0]
            @students[index] << attendance[1]
            flag = true
          end
        end
        unless flag
          @students[index] << "-"
        end
      end
    end
  end
end
