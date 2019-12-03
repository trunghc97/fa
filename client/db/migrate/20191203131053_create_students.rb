class CreateStudents < ActiveRecord::Migration[6.0]
  def change
    create_table :students, id: false do |t|
      t.bigint :code, primary: true
      t.string :name
      t.date :birthday
      t.string :email

      t.timestamps
    end
  end
end
