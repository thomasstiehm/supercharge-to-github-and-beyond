import * as core from "@actions/core";
import * as github from "@actions/github";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { IssueCommentEvent, IssuesEvent, WorkflowDispatchEvent } from "@octokit/webhooks-definitions/schema";

enum JokeType {
    "Zero" = "Please tell me a dad joke",
    "OneHundred" = "Please tell me a philisophical joke",
    "HundredPlus" = "Please tell me a progamming joke",
    "TooSpicy" = "Please tell me a joke about what happens when you break the rules",
    "Error" = "Please tell me a joke about what happens when someone cannot follow instructions",
    "ClosingTime" = "Please give me an inspirational saying that can motivate me to get through the day!",
}

export async function run() {
    core.debug("Starting tell-me-a-joke action");
    try {
        const octokit = github.getOctokit(core.getInput("token"));
        const openai = new OpenAIClient("https://coverosai.openai.azure.com/", new AzureKeyCredential(core.getInput("openai-apikey")));

        core.debug(JSON.stringify(github.context));
        // Need to determine if the event is a workflow_dispatch event or a issues event
        if (github.context.eventName === "workflow_dispatch") {
            const favNumRegex = /(?:### )?Favorite Number(?:\\n|\\s)*([^#]+)/;
            const wfEvent = github.context.payload as WorkflowDispatchEvent;
            // We need to grab all of the issues that are opened that have the tag 'Icebreaker' on them
            const openedIssues = await octokit.rest.issues.listForRepo({
                owner: wfEvent.repository.owner.login,
                repo: wfEvent.repository.name,
                labels: "Icebreaker",
            });
            // Loop through the issues returned and create a new issue that is assigned to each user asking them if they want to hear a joke
            for (const issue of openedIssues.data) {
                let msg = `We like to try and keep things spicy and interesting here at Coveros.`;
                const labels = ["Jokes"];
                // `I heard you like jokes, so I made this issue to ask you if you want to hear one. If you do, just reply with 'Yes' and I'll tell you one. If you don't, just close this issue and I'll leave you alone...`
                const matches = issue.body?.match(favNumRegex);
                const isValid = /^\d+$/.test(matches![1]?.trim());
                if (isValid) {
                    const favNum = parseInt(matches![1]?.trim());
                    const wereTheyBad = favNum === 69 || favNum === 420 || favNum === 69420 || favNum === 42069;
                    if (wereTheyBad) {
                        // The number is within the range of unacceptable numbers, so we need to tell them an inappropriate joke
                        msg += ` However, you were a little too spicy for us and managed to get around the checks we had in place to prevent you from being shameful. So unfortunately no jokes for you...`;
                        // Update the labels list to include a new label that says Too Spicy
                        labels.push("Too Spicy");
                    } else {
                        // The number is within the range of acceptable numbers, so we can go ahead and tell them a joke based on the number that they picked
                        msg += ` So if you'd be interested in hearing a joke about your favorite number [${favNum}], just reply with 'Yes' and I'll tell you one. If you don't, just close this issue and you won't hear anything more from me.`;
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
                    assignees: [issue.user?.login || "coveros-phil"],
                    body: msg,
                });

                core.debug(JSON.stringify(newIssue));
            }
        } else if (github.context.eventName === "issue_comment") {
            const icEvent = github.context.payload as IssueCommentEvent;
            let msg = "";

            if (icEvent.issue.labels.find((l) => l.name === "Icebreaker")) {
                return;
            }

            if (icEvent.issue.labels.find((l) => l.name === "Too Spicy")) {
                // If they are Too Spicy don't tell them a joke and instead do something else
                msg = "I can see that you would still like to hear a joke, but unfortuntately I'm not allowed to tell jokes to those who have been marked 'Too Spicy'. \n\n \n\n \n\n However, and you didn't hear this from me, if you remove one of the tags from your issue you should be able to hear a joke...";
            } else {
                // We want to check the content of the comment is 'Yes' or something very close to it, if so tell them a joke. If not respond back that it wasn't a valid response
                if (icEvent.comment.body?.toLowerCase().includes("yes")) {
                    let jokeToTell: JokeType;
                    if (icEvent.issue.labels.find((l) => l.name === "-_-")) {
                        jokeToTell = JokeType.Error;
                    } else {
                        const favNumRegex = /favorite number \[(\d+)\],/;
                        const matches = icEvent.issue.body?.match(favNumRegex);
                        if (matches && matches.length > 0) {
                            const isValid = /^\d+$/.test(matches![1]?.trim());
                            if (isValid) {
                                const favNum = parseInt(matches![1]?.trim());
                                core.info(`Favorite number is: ${favNum}`);
                                const wereTheyBad = favNum === 69 || favNum === 420 || favNum === 69420 || favNum === 42069;
                                if (wereTheyBad) {
                                    // The number is within the range of unacceptable numbers, so we need to tell them an inappropriate joke
                                    jokeToTell = JokeType.TooSpicy;
                                } else {
                                    // The number is within the range of acceptable numbers, so we can go ahead and tell them a joke based on the number that they picked
                                    if (favNum == 0) {
                                        jokeToTell = JokeType.Zero;
                                    } else if (favNum > 0 && favNum < 101) {
                                        jokeToTell = JokeType.OneHundred;
                                    } else {
                                        jokeToTell = JokeType.HundredPlus;
                                    }
                                }
                            } else {
                                core.debug("Invalid favorite number");
                                jokeToTell = JokeType.Error;
                            }
                        } else {
                            // Either something broke or they messed with it so that they could have a spicy number and still get a joke, so just give them a spicy joke anyways
                            jokeToTell = JokeType.TooSpicy;
                        }
                    }

                    // Now that we have determined what Joke to tell, add the comment telling the joke
                    const chatCompletions = await openai.getChatCompletions(
                        "CovGPT",
                        [
                            { role: "system", content: "You are an AI assistant that helps people find information" },
                            { role: "user", content: jokeToTell },
                        ],
                        { temperature: 1.0 }
                    );
                    // If you ever want to see some really crazy responses from ChatGPT, set the tempurature to something like 1.5 or 2.0. That causes the randomness to get a little out of control some times
                    core.debug(chatCompletions.choices[0].message?.content!);
                    msg = chatCompletions.choices[0].message?.content!;
                    msg += "\n\n Jokes provided by ChatGPT-3.5.\n\n We would also like to issue a blanket apology in the event the joke you recieved was a dud. ChatGPT has not yet mastered the art of comedy.";
                } else {
                    msg = "Dreadfully sorry, but your response doesn't appear to be yes, which means that we won't tell you a joke. \n\nIf you'd like to try again please respond with a 'Yes'";
                }
            }

            const issueComment = await octokit.rest.issues.createComment({
                owner: icEvent.repository.owner.login,
                repo: icEvent.repository.name,
                issue_number: icEvent.issue.number,
                body: msg,
            });
            core.debug(JSON.stringify(issueComment));
        } else if (github.context.eventName === "issues") {
            const iEvent = github.context.payload as IssuesEvent;

            if (iEvent.action === "closed") {
                // They closed the issue, and we can't just not show off that you can trigger things to happen based on that too
                const chatCompletions = await openai.getChatCompletions(
                    "CovGPT",
                    [
                        { role: "system", content: "You are an AI assistant that helps people find information" },
                        { role: "user", content: JokeType.ClosingTime },
                    ],
                    { temperature: 1.0 }
                );
                core.debug(chatCompletions.choices[0].message?.content!);
                const msg = `I see that you have closed the issue. While I hope you were able to hear a joke before you did this just know that you're not leaving empty handed. \n\n That's because our good ol' friend ChatGPT is here with some inspirational words to help get you through the conference! \n\n ${chatCompletions.choices[0].message?.content!}`;
                const issueComment = await octokit.rest.issues.createComment({
                    owner: iEvent.repository.owner.login,
                    repo: iEvent.repository.name,
                    issue_number: iEvent.issue.number,
                    body: msg,
                });
                core.debug(JSON.stringify(issueComment));
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
