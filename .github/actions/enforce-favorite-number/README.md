# enforce-favorite-number

<!-- about this action -->

| Input   | Description                                                                                                 | Required |
| ------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| `token` | Token used to access the GitHub API. Use the `GITHUB_TOKEN` by default unless other permissions are needed. | yes      |

## What checks does this action conduct?

-   Favorite number is a number
-   There are no non-digit characters
-   You didn't get cheeky

## Summary

This action ensures that the only values entered into the Favorite Number field are digits. And that the number is appropriate...
