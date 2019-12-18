class AttendancesController < ApplicationController
  def create
    @lesson = Lesson.find_by id: params[:lesson_id]
    if params[:lessons][:student_code]
      params[:lessons][:student_code].each do |code|
        @lesson.attendances.create student_code: code
      end
    else
      @lesson.attendances.create student_code: params[:lessons][:student_id]
    end
    redirect_to @lesson
  end

  def destroy
    @attendance = Attendance.find_by id: params[:id]
    @attendance.destroy
    redirect_to @lesson
  end
end
