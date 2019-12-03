class CreateClassStudents < ActiveRecord::Migration[6.0]
  def change
    create_table :class_students do |t|
      t.references :course_class
      t.references :student

      t.timestamps
    end
  end
end
