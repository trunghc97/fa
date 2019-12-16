class AttendancesController < ApplicationController
  def create
    @lesson = Lesson.find_by id: params[:lesson_id]
    @lesson.attendances.create! student_code: params[:student_code]
    redirect_to @lesson
  end

  def destroy
    @attendance = Attendance.find_by id: params[:id]
    @attendance.destroy
    redirect_to @lesson
  end
end
