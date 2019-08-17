ChromeExtension for CanvasLMS
==============================

Installing
--------------------
Available free at the [Chrome WebStore](https://chrome.google.com/webstore/detail/canvas-utility-belt/eihecihickbkcionkdabocomlbopidpk)

Usage
----------
When creating lists of students, you will need to use their **canvas id** which is different from their student id (**sis_id**). So the first step is downloading a CSV containing all the students in the current course. You can open this file in *Excel* or manipulate it with *SPSS*, *r*, *pandas*, etc.

Steps:
1. Right-click > **Download Student List**
2. Wait a few seconds (large class-sizes take slightly longer to download)
3. Open the generated file. Copy students of interest.


### Quiz Overrides
This feature lets you specify when a specific group of students can access a quiz. Instead of selecting students individually (error-prone), just do it in bulk.

Steps:
1. Right-click > *Quiz Overrides*
2. Paste the list of students' sis_id.
3. Submit.

### Moderate Quiz
Some students need special accomodations in the form of extra time or extra attempts. This list of students typically will not change throughout the semester and will need to be applied for every quiz. Just make that list of student canvas_id once and save a to a local folder.

Steps:
1. Right-click > *Moderate Quiz*
2. Paste the list of students' sis_id.
3. Modify the accomodations required. Be it time or attempts.
4. Submit.

### Quiz Export/Import
#### Question Format
Questions are defined using YAML. [Find out more about how to format the questions](docs/yaml/format.md)

#### Usage
TODO

## Development

| Command            | Task                                                                          |
| ------------------ | ---------------------------------------------------                           |
| `yarn build`       | Bundle the code into `dist/`. This folder can be directly loaded into Chrome. |
| `yarn lint`        | Fix source-code styling errors.                                               |
| `yarn test`        | Run the unit tests via Mocha.                                                 |
