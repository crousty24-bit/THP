# frozen_string_literal: true

STUDENTS = [
  { name: 'Alice', grade: '15' },
  { name: 'Bastien', grade: '12' },
  { name: 'Camille', grade: nil },
  { name: 'Dina', grade: '17' }
].freeze

def numeric_grade(student)
  grade = student[:grade]

  return nil if grade.nil?

  grade.strip.to_i
end

def available_grades(students)
  students.filter_map { |student| numeric_grade(student) }
end

def average_grade(grades)
  return 0 if grades.empty?

  grades.sum.to_f / grades.length
end

average = average_grade(available_grades(STUDENTS))

puts format('Class average: %.2f/20', average)
