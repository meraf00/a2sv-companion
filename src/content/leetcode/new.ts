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
  const doesButtonExist = setupPushToSheetsButton();
  if (doesButtonExist) return;
  setupTimeTakenField();
};

const setupPushToSheetsButton = () => {
  const existingButton = document.getElementById('push-to-sheets-button');
  // Don't add button if it already exists
  // TODO Find a way to avoid naive mutation observer
  if (existingButton != null) return true;

  console.log('Setting up push to sheets button');

  document.querySelectorAll('button').forEach((button) => {
    if (button.innerText === 'Solution') {
      const buttonsContainer = button.parentElement.parentElement;
      buttonsContainer.classList.add('min-h-[40px]');
      // Create push to sheets button
      const pushToSheetsButton = createPushToSheetsButton(
        buttonsContainer,
        button
      );
      // Set up event listener
      pushToSheetsButton.onclick = () => {
        onPushToSheetButtonClicked(pushToSheetsButton);
      };
    }
  });
  return false;
};

const createPushToSheetsButton = (
  buttonsContainer: HTMLElement,
  button: HTMLElement
) => {
  const pushToSheetsButton = document.createElement('button');
  buttonsContainer.appendChild(pushToSheetsButton);
  pushToSheetsButton.id = 'push-to-sheets-button';
  const loading = document.createElement('span');
  loading.id = 'push-to-sheets-loading';
  loading.classList.add('loader');
  loading.classList.add('hidden');
  pushToSheetsButton.appendChild(loading);
  pushToSheetsButton.appendChild(document.createTextNode('Push to Sheets'));

  // Copy classes from the original button
  button.classList.forEach((val, idx, arr) => {
    if (val.includes('cursor-not-allowed') || val.includes('opacity-')) return;
    pushToSheetsButton.classList.add(val.replace('green', 'blue'));
  });
  return pushToSheetsButton;
};

const onPushToSheetButtonClicked = (solutionButton: HTMLElement) => {
  const timeTakenInput = document.getElementById(
    'time-taken-input'
  ) as HTMLInputElement;
  if (timeTakenInput == null) {
    console.error(
      'Time taken input is not found when push to sheets button is clicked'
    );
    return;
  }

  // Toggle time taken input if it's hidden or empty
  if (timeTakenInput.hidden || timeTakenInput.value.length === 0) {
    solutionButton.childNodes[1].textContent = timeTakenInput.hidden
      ? timeTakenInput.value.length === 0
        ? 'Cancel'
        : 'Upload'
      : 'Push to Sheets';
    timeTakenInput.hidden = !timeTakenInput.hidden;
  } else {
    const time = parseInt(timeTakenInput.value);
    if (isNaN(time)) {
      alert('Invalid time taken');
      return;
    }

    const parts = window.location.href.split('/');
    const submissionId = parseInt(parts[parts.length - 2]);
    // pushToSheets(time, submissionId);
  }
};

const setupTimeTakenField = () => {
  console.log('Setting up time taken field');

  const solutionButton = document.getElementById('push-to-sheets-button');

  {
    const existingInput = document.getElementById('time-taken-input');
    if (existingInput != null)
      existingInput.parentElement.removeChild(existingInput);
  }

  const timeTakenInput = createTimeTakenField();
  if (timeTakenInput == null) return;

  // Set up event listener
  timeTakenInput.oninput = () => {
    const solutionButton = document.getElementById('push-to-sheets-button');
    if (solutionButton == null) return;
    if (timeTakenInput.value === '') {
      solutionButton.childNodes[1].textContent = 'Cancel';
      return;
    } else {
      solutionButton.childNodes[1].textContent = 'Upload';
    }
  };

  if (solutionButton)
    solutionButton.parentElement.insertBefore(timeTakenInput, solutionButton);
};

const createTimeTakenField = () => {
  const timeTakenInput = document.createElement('input');
  timeTakenInput.id = 'time-taken-input';

  // Add custom classes
  timeTakenInput.classList.add('min-h-[10px]');
  timeTakenInput.classList.add('py-1');
  timeTakenInput.classList.add('px-2');
  timeTakenInput.hidden = true;
  timeTakenInput.type = 'number';
  timeTakenInput.setAttribute('placeholder', 'Time taken (in minutes)');
  return timeTakenInput;
};

export default {
  injectContent,
  observe,
  onMutation,
  setupPushToSheetsButton,
  setupTimeTakenField,
  createTimeTakenField,
  createPushToSheetsButton,
  onPushToSheetButtonClicked,
};
