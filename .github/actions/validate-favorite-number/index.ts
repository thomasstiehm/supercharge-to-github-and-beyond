import * as core from "@actions/core";
import * as github from "@actions/github";
import { IssuesEvent } from "@octokit/webhooks-definitions/schema";

export async function run() {
    core.debug("Starting validate-favorite-number action");

    const eventJson = JSON.parse(core.getInput("event_ctx")) as IssuesEvent;
    core.info("Event parsed value: ");
    core.info(JSON.stringify(eventJson.issue));

    core.info("GitHub Content: ");
    core.info(JSON.stringify(github.context.payload));
}

run();
