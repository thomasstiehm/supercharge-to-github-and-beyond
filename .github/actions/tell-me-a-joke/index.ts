import * as core from "@actions/core";
import * as github from "@actions/github";
import { IssueCommentEvent, IssuesEvent, WorkflowDispatchEvent } from "@octokit/webhooks-definitions/schema";

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
        const favNumRegex = /(?:### )?Favorite Number(?:\\n|\\s)*([^#]+)/;

        core.debug(JSON.stringify(github.context));
        // Need to determine if the event is a workflow_dispatch event or a issues event
        if (github.context.eventName === "workflow_dispatch") {
            const wfEvent = github.context.payload as WorkflowDispatchEvent;
            // We need to grab all of the issues that are opened that have the tag 'Icebreaker' on them
            const openedIssues = await octokit.rest.issues.listForRepo({
                owner: wfEvent.repository.owner.login,
                repo: wfEvent.repository.name,
                labels: "Icebreaker",
            });
            // Loop through the issues returned and create a new issue that is assigned to each user asking them if they want to hear a joke
            for (const issue of openedIssues.data) {
                let msg = `We like to try and keep things spicy and unusual here at Coveros.`;
                const labels = ["Jokes"];
                // `I heard you like jokes, so I made this issue to ask you if you want to hear one. If you do, just reply with 'Yes' and I'll tell you one. If you don't, just close this issue and I'll leave you alone...`
                const matches = issue.body?.match(favNumRegex);
                const isValid = /^\d+$/.test(matches![1]?.trim());
                if (isValid) {
                    const favNum = parseInt(matches![1]?.trim());
                    const wereTheyBad = favNum === 69 || favNum === 420 || favNum === 69420 || favNum === 42069;
                    if (wereTheyBad) {
                        // The number is within the range of unacceptable numbers, so we need to tell them an inappropriate joke
                        msg += ` However, you were a little too spicy for us and managed to get around the checks we had in place to prevent you from being naughty. So unfortunately no jokes for you...`;
                        // Update the labels list to include a new label that says Too Spicy
                        labels.push("Too Spicy");
                    } else {
                        // The number is within the range of acceptable numbers, so we can go ahead and tell them a joke based on the number that they picked
                        msg += ` So if you'd be interested in hearing a joke about your favorite number ${favNum}, just reply with 'Yes' and I'll tell you one. If you don't, just close this issue and you won't hear anything more from me.`;
                    }
                } else {
                    // They ended up with a -_- for the number for whatever reason so we can interact with them in yet another different way
                    msg += ` That's not to say that we don't also follow the rules when filling out forms. Next time be sure to follow the prompts on the form when filling in the fields :smile:. \n\nAnyways, if you'd still like to hear a joke just comment on this issue with 'Yes' and I'll tell you a joke. If you'd rather not hear one though just go ahead and close the issue. `;
                    labels.push("-_-");
                }

                const newIssue = await octokit.rest.issues.create({
                    owner: wfEvent.repository.owner.login,
                    repo: wfEvent.repository.name,
                    title: `${issue.user?.name || issue.user?.login}: Do you want to hear a joke?`,
                    labels: labels,
                    assignees: [issue.user?.login || ""],
                    body: msg,
                });

                core.info(JSON.stringify(newIssue));
            }
        } else if (github.context.eventName === "issue_comment") {
            const icEvent = github.context.payload as IssueCommentEvent;
            // // Loop through the issues returned and create a new issue that is assigned to each user asking them if they want to hear a joke
            // If they are Too Spicy don't tell them a joke and instead do something else
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
            //     } else {
            //         core.info('Invalid favorite number');
            //         jokeToTell = JokeType.Error;
            //     }

            //     // const data = await octokit.rest.issues.create({
            //     //     owner: event.repository.owner.login,
            //     //     repo: event.repository.name,
            //     //     title: 'Do you want to hear a joke?',
            //     //     assignees: [issue.user.login],
            //     //     body: 'I heard you like jokes, so I made this issue to ask you if you want to hear one. If you do, just reply with 'Yes' and I'll tell you one. If you don't, just close this issue and I'll leave you alone.',
            //     // });

            //     // core.info(`Created issue for user ${issue.user.login}`);
            // }
        } else if (github.context.eventName === "issues") {
            const iEvent = github.context.payload as IssuesEvent;

            // They attempted to close the issue, so we need to tell them a joke because they can't escape this
            // Also reopen the issue because we're not done with them yet

            // And even further if they were a little Too Spicy or -_- we can mess with them even more
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
