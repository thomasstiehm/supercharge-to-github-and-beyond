import * as core from "@actions/core";
import * as github from "@actions/github";
import { IssueCommentEvent, WorkflowDispatchEvent } from "@octokit/webhooks-definitions/schema";

enum JokeType {
    "Zero" = "Infinity Joke",
    "One-Hundred" = "Joke 2",
    "HundredPlus" = "Alternate Infinity Joke",
    "Inappropriate" = "Inappropriate Joke",
    "Error" = "Error Joke",
}

export async function run() {
    core.debug("Starting tell-me-a-joke action");
    try {
        const token = core.getInput("token");
        const octokit = github.getOctokit(token);
        core.info(JSON.stringify(github.context));
        // Need to determine if the event is a workflow_dispatch event or a issues event
        // if (github.context.eventName === "workflow_dispatch") {
        //     const wfEvent = github.context.payload as WorkflowDispatchEvent;
        // } else if (github.context.eventName === "issue_comment") {
        //     const icEvent = github.context.payload as IssueCommentEvent;
        //     core.info(JSON.stringify(icEvent));
        // }

        // // We need to grab all of the issues that are opened that have the tag 'Icebreaker' on them
        // const openedIssues = await octokit.rest.issues.listForRepo({
        //     owner: event.repository.owner.login,
        //     repo: event.repository.name,
        //     labels: "Icebreaker",
        // });

        // const favNumRegex = /(?:### )?Favorite Number(?:\\n|\\s)*([^#]+)/;
        // // Loop through the issues returned and create a new issue that is assigned to each user asking them if they want to hear a joke
        // for (const issue of openedIssues.data) {
        //     const matches = issue.body?.match(favNumRegex);
        //     const isValid = /^\d+$/.test(matches![1]?.trim());
        //     let jokeToTell: JokeType;
        //     if (isValid) {
        //         const favNum = parseInt(matches![1]?.trim());
        //         core.info(`Favorite number is: ${favNum}`);
        //         const wereTheyBad = favNum === 69 || favNum === 420 || favNum === 69420 || favNum === 42069;
        //         if (wereTheyBad) {
        //             // The number is within the range of unacceptable numbers, so we need to tell them an inappropriate joke
        //             jokeToTell = JokeType.Inappropriate;
        //         } else {
        //             // The number is within the range of acceptable numbers, so we can go ahead and tell them a joke based on the number that they picked
        //         }
        //         core.info(favNum.toString());
        //     } else {
        //         core.info("Invalid favorite number");
        //         jokeToTell = JokeType.Error;
        //     }

        //     // const data = await octokit.rest.issues.create({
        //     //     owner: event.repository.owner.login,
        //     //     repo: event.repository.name,
        //     //     title: "Do you want to hear a joke?",
        //     //     assignees: [issue.user.login],
        //     //     body: "I heard you like jokes, so I made this issue to ask you if you want to hear one. If you do, just reply with 'Yes' and I'll tell you one. If you don't, just close this issue and I'll leave you alone.",
        //     // });

        //     // core.info(`Created issue for user ${issue.user.login}`);
        // }

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
