class StudentsController < ApplicationController
  def show
    @student = Student.find_by code: params[:id]
    render json: { student: @student }
  end
end
