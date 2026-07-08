# Ruby Debugging Report

## Goal

Debug, fix, refactor, and lint a small Ruby script.

## Step 1 - Generate a Buggy Script

Prompt used with the AI:

```text
Create a short Ruby script that calculates the average grade for a class.
Add one subtle bug that will crash at runtime.
```

The generated script stores student grades in an array of hashes, then loops
over each grade to calculate the class average.

The intentional bug is not fixed yet in this first version.

## Step 2 - Run the Script and Read the Error

Command:

```bash
ruby debugging/bugged.rb
```

Observed error:

```text
debugging/bugged.rb:11:in 'block in <main>': undefined method 'strip' for nil (NoMethodError)

  grade = student[:grade].strip.to_i
                         ^^^^^^
	from debugging/bugged.rb:10:in 'Array#each'
	from debugging/bugged.rb:10:in '<main>'
```

Facts:

- File: `debugging/bugged.rb`
- Failing line: `11`
- Error type: `NoMethodError`
- Exact problem: Ruby tried to call `strip` on `nil`.

## Step 3 - AI Explanation

I asked the AI to explain the error from the stack trace.

What I understood:

- `strip` is a string method.
- One student has `grade: nil`.
- When the loop reaches this student, `student[:grade]` returns `nil`.
- `nil.strip` is invalid, so Ruby raises `NoMethodError`.

Useful debugging technique:

```ruby
puts student.inspect
```

This would show which hash is being processed before the crash. In this case,
the stack trace and the data were enough to identify the broken value.
