import * as core from '@actions/core';
import * as github from '@actions/github';



export async function run() {
    core.debug('Starting validate-favorite-number action');

    const eventJson = core.getInput('event_ctx');
    core.info(eventJson);
    const event = JSON.parse(eventJson);
    core.info(event);
}


run();