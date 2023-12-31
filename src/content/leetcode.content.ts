import oldUi from './leetcode/old';
import newUi from './leetcode/new';
import { LeetcodeContentScript } from '../scripts';
import { LeetcodeEvent } from '../events';

function changePushToSheetsToLoadingState() {
  const pushToSheetsButton = document.getElementById('push-to-sheets-button');
  pushToSheetsButton.childNodes[1].textContent = 'Uploading';
  document.getElementById('push-to-sheets-loading').classList.remove('hidden');
  document.getElementById('time-taken-input').hidden = true;
}

function onResponse(response: any) {
  const pushToSheetsButton = document.getElementById('push-to-sheets-button');
  if (response && response.error) {
    alert(response.error);
    pushToSheetsButton
      .querySelector('#push-to-sheets-loading')
      .classList.add('hidden');
    pushToSheetsButton.childNodes[1].textContent = 'Retry';
  } else if (response && response.status && response.status === 'success') {
    pushToSheetsButton
      .querySelector('#push-to-sheets-loading')
      .classList.add('hidden');
    const timeTakenInputField = document.getElementById(
      'time-taken-input'
    ) as HTMLInputElement;
    timeTakenInputField.value = '';
    pushToSheetsButton.childNodes[1].textContent = 'Success';
  }
}

export async function pushToSheets(time: string, submissionId: string) {
  changePushToSheetsToLoadingState();
  console.log('Sending push to sheets message');
  chrome.runtime.sendMessage(
    {
      from: LeetcodeContentScript,
      type: LeetcodeEvent.PUSH_TO_SHEETS,
      payload: { submissionId: submissionId, timeTaken: time },
    },
    onResponse
  );
}

export function pushLastSubmissionToSheets(time: string, titleSlug: string) {
  changePushToSheetsToLoadingState();
  console.log('Sending push last submission to sheets message');
  chrome.runtime.sendMessage(
    {
      from: LeetcodeContentScript,
      type: LeetcodeEvent.PUSH_LAST_SUBMISSION_TO_SHEETS,
      payload: { timeTaken: time, titleSlug: titleSlug },
    },
    onResponse
  );
}

const oldMutationObserver: MutationObserver = new MutationObserver(() =>
  oldUi.onMutation(oldMutationObserver)
);
oldUi.observe(oldMutationObserver);

const newMutationObserver: MutationObserver = new MutationObserver(() =>
  newUi.onMutation(newMutationObserver)
);
newUi.observe(newMutationObserver);
