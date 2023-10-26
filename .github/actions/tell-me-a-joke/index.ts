import * as core from "@actions/core";
import * as github from "@actions/github";
import { WorkflowDispatchEvent } from "@octokit/webhooks-definitions/schema";

export async function run() {
    core.debug("Starting tell-me-a-joke action");
    try {
        const event = github.context.payload as WorkflowDispatchEvent;
        const token = core.getInput("token");
        const octokit = github.getOctokit(token);

        const favNumRegex = /(?:### )?Favorite Number(?:\\n|\\s)*([^#]+)/;
        // We need to grab all of the issues that are opened that have the tag 'Icebreaker' on them

        core.info(JSON.stringify(event));
        // const openedIssues = await octokit.rest.issues.

        // const data = await octokit.rest.issues.update({
        //     owner: event.repository.owner.login,
        //     repo: event.repository.name,
        //     issue_number: event.issue.number,
        //     body: event.issue.body.replace(favNumRegex, `### Favorite Number\n\n${filteredFavNum - 1}\n\n`),
        // });
        // core.info("Favorite number had to be updated due to being 69");
        // core.info(JSON.stringify(data));
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
