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

Example:
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

Fill-in-blank
------------------------------
List possible correct answers. Since all answers are "correct", tildes are ignored.

Example:
```yaml
- type: Fill-in-blank
  text: What is one of the first two numbers?
  answers:
    - 1
    - One
    - ~ 2
    - ~    Two
```

Multiple Blanks
------------------------------
Give each blank a unique name like `color1` and `color2`. Specify the acceptable answers for each blank under answers section.

Example:
```yaml
- type: Multiple Blanks
  text: <p>Roses are [color1], violets are [color2]</p>
  answers:
    color1:
      - red
      - pink
      - white
    color2:
      - blue
      - multi colored
      - violet
```


Multiple Dropdowns
------------------------------
This question type is like having several **Multiple Choice** questions, inside a single question. Give each drop down a unique name (eg, d1, dropdown2). Mark the correct option with a tilde (`~`).

Example:

```yaml
- type: Multiple Dropdowns
  text: Roses = [d1], Violets = [dropdown2]
  answers:
    d1:
      - ~ red
      - green
      - blue
    dropdown2:
      - ~blue
      - ugly
      - 42
      - wrong
```
