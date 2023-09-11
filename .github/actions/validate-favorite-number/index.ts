import * as core from "@actions/core";
import * as github from "@actions/github";
import { IssuesEvent } from "@octokit/webhooks-definitions/schema";

export async function run() {
    core.debug("Starting validate-favorite-number action");

    const event = github.context.payload as IssuesEvent;
    core.info("GitHub Content: ");
    core.info(JSON.stringify(event));
}

run();
