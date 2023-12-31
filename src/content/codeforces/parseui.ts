const showOnlyMySolutions = (show: boolean) => {
  const mySubmissionsToggle = document.getElementsByName(
    'my'
  )[0] as HTMLInputElement;

  if (mySubmissionsToggle.hasAttribute('checked')) {
    if (!show) {
      mySubmissionsToggle.click();
    }
  } else {
    if (show) {
      mySubmissionsToggle.click();
    }
  }
};

export const getSubmissionCodeAndTimeTaken = async (submissionid: string) => {
  const originalState = document
    .getElementsByName('my')[0]
    .hasAttribute('checked');

  showOnlyMySolutions(true);

  const solutionAnchors = [].slice.call(
    document.getElementsByClassName('view-source')
  ) as HTMLAnchorElement[];

  const lastSubmissionAnchor = solutionAnchors.filter(
    (anchor) => anchor.getAttribute('submissionid') === submissionid
  )[0];

  lastSubmissionAnchor.click();

  return new Promise<{ code: string; timeTaken: string }>((resolve, reject) => {
    setTimeout(() => {
      const copyBtn = document.getElementById('program-source-text-copy');

      const timeTaken = document.createElement('input');
      copyBtn.parentNode.appendChild(timeTaken);

      timeTaken.id = 'time-taken';
      timeTaken.type = 'number';
      timeTaken.placeholder = 'Time taken (min)';
      timeTaken.style.marginBottom = '5px';
      timeTaken.style.marginRight = '10px';

      const pushBtn = copyBtn.cloneNode(true);
      pushBtn.textContent = 'Push to sheet';
      copyBtn.parentNode.appendChild(pushBtn);

      pushBtn.addEventListener('click', async () => {
        if (timeTaken.value == '') return;

        const sourceCode = await navigator.clipboard.readText();
        showOnlyMySolutions(originalState);
        resolve({ code: sourceCode, timeTaken: timeTaken.value });
      });
    }, 1000);
  });
};

export const getUserHandle = () => {
  return [].slice
    .call(
      document
        .getElementsByClassName('lang-chooser')[0]
        .getElementsByTagName('a')
    )
    .filter((x: HTMLAnchorElement) => x.href.includes('profile'))[0].innerText;
};
