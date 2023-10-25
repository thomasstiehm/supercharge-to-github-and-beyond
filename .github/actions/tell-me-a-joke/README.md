# tell-me-a-joke

<!-- about this action -->

| Input   | Description                                                                                                 | Required |
| ------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| `token` | Token used to access the GitHub API. Use the `GITHUB_TOKEN` by default unless other permissions are needed. | yes      |

## What checks does this action conduct?

-   The user opened an issue at the start of the class

## Summary

This action will go through all of the users who created an issue at the start of the class and will create a new issue for them asking if they want to hear a joke. It will also handle the responses to the prompt and will tell the user a joke if they respond with "yes".
