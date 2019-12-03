class Users::SessionsController < Devise::SessionsController
  before_action :configure_sign_in_params, only: [:create]
  skip_before_action :verify_authenticity_token

  def new
    super
  end

  def create
    @user = User.find_by email: params[:session][:email]
    if @user.valid_password?(params[:session][:password])
      sign_in @user
      redirect_to root_path
    else
      render :new
    end

  end

  def destroy
    sign_out current_user
  end

  protected

  def configure_sign_in_params
    devise_parameter_sanitizer.permit :sign_in, keys: [:attribute]
  end
end
