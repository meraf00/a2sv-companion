import { pushLastSubmissionToSheets } from '../leetcode.content';

const onMutation = (mutationObserver: MutationObserver) => {
  mutationObserver.disconnect();
  injectContent();
  observe(mutationObserver);
};

const observe = (mutationObserver: MutationObserver) => {
  mutationObserver.observe(document, {
    subtree: true,
    childList: true,
  });
};

const injectContent = () => {
  let isOldUi = false;

  document.querySelectorAll('div').forEach((div) => {
    isOldUi ||= div.innerText === 'NEW';
  });

  if (isOldUi) {
    const isButtonCreated = setupPushLastSubmissionButton();
    if (isButtonCreated) setupTimeTakenField();
  }
};

const onPushToSheetButtonClicked = () => {
  const pushLastSubmissionButton = document.getElementById(
    'push-to-sheets-button'
  );
  const timeTakenField = document.getElementById(
    'time-taken-input'
  ) as HTMLInputElement;

  if (timeTakenField.hidden) {
    timeTakenField.hidden = false;
    pushLastSubmissionButton.childNodes[1].textContent = 'Cancel';
    return;
  }

  if (timeTakenField.value === '') {
    timeTakenField.hidden = true;
    pushLastSubmissionButton.childNodes[1].textContent = 'Push last submission';
    return;
  }

  var titleSlug = window.location.href.replace(
    'https://leetcode.com/problems/',
    ''
  );
  titleSlug = titleSlug.split('/')[0];
  pushLastSubmissionToSheets(timeTakenField.value, titleSlug);
};

const setupPushLastSubmissionButton = () => {
  const existingButton = document.getElementById('push-to-sheets-button');

  if (existingButton) {
    const container = existingButton.parentElement;
    container.removeChild(existingButton);
  }

  let submitSpan: HTMLSpanElement = null;
  document.querySelectorAll('span').forEach((it) => {
    if (it.innerText === 'Submit') submitSpan = it;
  });

  if (submitSpan != null) {
    const button = submitSpan.parentElement;

    const container = button.parentElement;
    container.style.alignItems = 'center';

    const newButton = button.cloneNode(true) as HTMLButtonElement;
    newButton.childNodes.forEach((node) => {
      newButton.removeChild(node);
    });
    newButton.setAttribute('id', 'push-to-sheets-button');
    newButton.addEventListener('click', onPushToSheetButtonClicked);
    newButton.style.marginLeft = '10px';
    newButton.style.width = '10rem';

    const loadingDiv = document.createElement('span');
    loadingDiv.setAttribute('id', 'push-to-sheets-loading');
    loadingDiv.setAttribute('class', 'hidden loader');
    loadingDiv.style.margin = '0.5rem';

    // replace the svg with in the new button with the loading div
    newButton.appendChild(loadingDiv);
    newButton.appendChild(document.createTextNode('Push last submission'));
    button.parentElement.appendChild(newButton);
    return true;
  }
};

const setupTimeTakenField = () => {
  const existingTimeTakenField = document.getElementById('time-taken-input');
  if (existingTimeTakenField != null) return;

  const timeTakenField = document.createElement('input') as HTMLInputElement;
  timeTakenField.setAttribute('id', 'time-taken-input');
  timeTakenField.setAttribute('type', 'number');
  timeTakenField.setAttribute('placeholder', 'Time taken (in minutes)');
  timeTakenField.setAttribute('class', 'input__2o8B');
  timeTakenField.setAttribute('hidden', 'true');
  timeTakenField.setAttribute(
    'style',
    'padding: 0.5rem; margin-left: 10px; width: 200px;'
  );

  timeTakenField.addEventListener('input', (event) => {
    const pushToSheetsButton = document.getElementById('push-to-sheets-button');
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value === '')
      pushToSheetsButton.childNodes[1].textContent = 'Cancel';
    else pushToSheetsButton.childNodes[1].textContent = 'Upload';
  });

  // Add the time taken field before the push to sheets button
  const pushToSheetsButton = document.getElementById('push-to-sheets-button');
  pushToSheetsButton.parentElement.insertBefore(
    timeTakenField,
    pushToSheetsButton
  );
};

export default {
  onMutation,
  observe,
  injectContent,
  setupPushLastSubmissionButton,
  setupTimeTakenField,
  onPushToSheetButtonClicked,
};
