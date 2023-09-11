import * as core from '@actions/core';
import * as github from '@actions/github';



export async function run() {
    core.debug('Starting validate-favorite-number action');

    const eventJson = core.getInput('event_ctx')
    core.info('Event JSON value: ');
    core.info(eventJson);
    const event = JSON.parse(eventJson);
    core.info('Event parsed value: ');
    core.info(JSON.stringify(event.issue));
}


run();