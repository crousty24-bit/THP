students = [
  { name: "Alice", grade: "15" },
  { name: "Bastien", grade: "12" },
  { name: "Camille", grade: nil },
  { name: "Dina", grade: "17" }
]

total = 0

students.each do |student|
  grade = student[:grade].strip.to_i
  total += grade
end

average = total / students.length

puts "Class average: #{average}/20"
