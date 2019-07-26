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
TODO

### Moderate Quiz
TODO

### Quiz Export/Import
#### Question Format
Questions are defined using YAML. [Find out more about how to format the questions](docs/yaml/format.md)

#### Usage
TODO

## Development

| Command            | Task                                                  |
| ------------------ | ---------------------------------------------------   |
| `yarn dev`         | Run development server.                               |
| `yarn build`       | Build production ready code into `dist/`.           |
| `yarn lint`        | Fix style of code in `src/`.                          |
| `yarn lint:check`  | Don't overwrite! Just list files with linting errors. |
| `yarn test`        | Run the unit tests via Mocha.                         |
