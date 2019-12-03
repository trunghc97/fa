class CreateLessons < ActiveRecord::Migration[6.0]
  def change
    create_table :lessons do |t|
      t.string :name
      t.datetime :time_start
      t.datetime :time_end
      t.references :classroom
      t.references :course_class

      t.timestamps
    end
  end
end
