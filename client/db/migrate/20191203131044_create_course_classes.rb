class CreateCourseClasses < ActiveRecord::Migration[6.0]
  def change
    create_table :course_classes do |t|
      t.string :name
      t.references :user
      t.references :subject

      t.timestamps
    end
  end
end
