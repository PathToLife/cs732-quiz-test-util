# cs732-quiz-test-util
Tests 732 backend server on external script

## WARNING
Please double check failed tests for false positives!

This program tries to adapt to the differences in mongoose schema between 
students by doing a initial test where it stores a single todo from the server and adapts to differences in naming.

An example is the below line where it attempts to get the `key name` for the boolean variable that marks a todo as complete.
https://github.com/PathToLife/cs732-quiz-test-util/blob/b2da4979ba531f0a95322799399d744fe2c753c3/test/main.test.ts#L79

# To run

`npm install`

`npm run test`

For a better looking test ui, it may be worth starting test in webstorm

<img width="1047" alt="image" src="https://user-images.githubusercontent.com/12622625/175197608-9ff7e5f4-e9b0-4e92-86ee-1c18c17b29e1.png">
