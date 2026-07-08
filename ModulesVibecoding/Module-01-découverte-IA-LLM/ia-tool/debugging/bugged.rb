students = [
  { name: "Alice", grade: "15" },
  { name: "Bastien", grade: "12" },
  { name: "Camille", grade: nil },
  { name: "Dina", grade: "17" }
]

total = 0
graded_students = 0

students.each do |student|
  next if student[:grade].nil?

  grade = student[:grade].strip.to_i
  total += grade
  graded_students += 1
end

average = total / graded_students

puts "Class average: #{average}/20"
