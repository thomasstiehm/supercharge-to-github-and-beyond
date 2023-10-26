import * as core from "@actions/core";
import * as github from "@actions/github";
import { IssuesEvent } from "@octokit/webhooks-definitions/schema";

export async function run() {
    core.debug("Starting enforce-favorite-number action");
    try {
        const event = github.context.payload as IssuesEvent;
        const token = core.getInput("token");
        const octokit = github.getOctokit(token);
        const issueBody = event.issue.body.replace(/\r\n/g, "");

        // If the issue does not have the Icebreaker tag then we need to just ignore them
        if (event.issue.labels?.some((label) => label.name != "Icebreaker")) {
            core.info("Issue that triggered the workflow does not have the Icebreaker tag. Skipping....");
            return;
        }

        const favNumRegex = /(?:### )?Favorite Number(?:\\n|\\s)*([^#]+)/;
        const matches = issueBody.match(favNumRegex);
        const isValid = /^\d+$/.test(matches![1]?.trim());
        if (isValid) {
            const favNum = parseInt(matches![1]?.trim());
            core.info(`Favorite number is: ${favNum}`);
            const wereTheyBad = favNum === 69 || favNum === 420 || favNum === 69420 || favNum === 42069;
            if (wereTheyBad) {
                // We need to update the favorite number to be one less than whatever it is in the actual issue.
                const data = await octokit.rest.issues.update({
                    owner: event.repository.owner.login,
                    repo: event.repository.name,
                    issue_number: event.issue.number,
                    body: event.issue.body.replace(favNumRegex, `### Favorite Number\n\n${favNum - 1}\n\n`),
                });
                core.info("Favorite number had to be updated due to being 69");
                core.info(JSON.stringify(data));
            }
        } else {
            // They supplied something that has non-numbers in it so we are gonna just give them a different favorite number
            // First check to see if the input had any numbers in it, if so then just remove all the non-digits and use that
            const hasNumbers = /\d/.test(matches![1]?.trim());
            if (hasNumbers) {
                let filteredFavNum = parseInt(matches![1]?.trim().replace(/\D/g, ""));
                core.info(`Filtered favorite number is: ${filteredFavNum}`);
                const wereTheyBad = filteredFavNum === 69 || filteredFavNum === 420 || filteredFavNum === 69420 || filteredFavNum === 42069;
                if (wereTheyBad) {
                    // We need to update the favorite number to be one less than whatever it is in the actual issue.
                    filteredFavNum--;
                    core.info("Favorite number had to be updated due to being 69");
                }
                const data = await octokit.rest.issues.update({
                    owner: event.repository.owner.login,
                    repo: event.repository.name,
                    issue_number: event.issue.number,
                    body: event.issue.body.replace(favNumRegex, `### Favorite Number\n\n${filteredFavNum}\n\n`),
                });
                core.info(JSON.stringify(data));
            } else {
                // Since there are no numbers in it at all we're gonna give them a apathetic face as a favorite number
                const data = await octokit.rest.issues.update({
                    owner: event.repository.owner.login,
                    repo: event.repository.name,
                    issue_number: event.issue.number,
                    body: event.issue.body.replace(favNumRegex, `### Favorite Number\n\n-_-\n\n`),
                });
                core.info("Favorite number had to be updated due them not actually giving a number");
                core.info(JSON.stringify(data));
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
