class CreateTableAttendances < ActiveRecord::Migration[6.0]
  def change
    create_table :attendances do |t|
      t.references :lesson
      t.bigint :student_code, index: true, foreign_key: true

      t.timestamps
    end
  end
end
