Formatting Questions
=====================================

Questions follow the basic format
```yaml
- id: 999
  points: 10
  type: text
  text: What is the meaning of life?
```

Multiple Choice
----------------------
This is the default question type, specifying the type is optional for multiple choice (`type: Multiple Choice`), but required for all other question types.
Prefix the correct answer with a tilde(`~`).
Example:
```yaml
- type: Multiple Choice
  points: 1
  text: '<p> Multiple Choice Text </p>'
  answers:
    - ~ Correct One
    - Wrong 1
    - Wrong 2
```


Multiple Answers
------------------------------
Prefix correct answers with a tilde(`~`)

```yaml
- type: Multiple Answers
  text: <p> Two or more? <i>(select all that apply)</i></p>
  answers:
    - Wrong 1
    - ~ Right 1
    - Wrong 2
    - ~Right 2
    - Wrong 3
```
