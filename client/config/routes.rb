Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: "users/sessions"
  }
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :course_classes do
    get "export_excel"
  end
  resources :lessons do
    resources :attendances, shallow: true
  end
  resources :students, only: :show
  get "train", to: "trains#index"
  root to: "lessons#index"
end
