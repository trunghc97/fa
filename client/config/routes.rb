Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: "users/sessions"
  }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :course_classes
  resources :lessons do
    resources :attendances, shallow: true
  end
  resources :users, only: :show
  root to: "lessons#index"
end
