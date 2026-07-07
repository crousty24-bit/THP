# Prompt Guide

This folder contains reusable prompts for the Vibecoding IA Tool project.

## Structure of a Good Prompt

A useful prompt should be clear, specific, and easy to reuse. It usually
contains four parts:

- Role: define what the LLM should act as, for example a front-end developer,
  Rails developer, or product assistant.
- Context: explain the project, target users, and constraints needed to produce
  a relevant answer.
- Instruction: state the exact task and any limits, such as "return HTML only"
  or "do not add explanations".
- Format: describe the expected output structure, file type, list format, or
  naming convention.

The more precise the prompt is, the easier it is to evaluate the result.

## Prompting Techniques

Zero-shot prompting means asking the LLM to perform a task directly, without
giving examples. It works well for simple or common tasks when the instruction
is precise.

Few-shot prompting means giving one or more examples before asking for the real
output. It helps the LLM match a specific style, structure, or level of detail.

Chain-of-thought prompting means asking the LLM to reason step by step before
producing an answer. It can help with complex analysis, but for reusable
deliverables it is often better to ask for a short summary of assumptions and
decisions instead of a long internal reasoning trace.
