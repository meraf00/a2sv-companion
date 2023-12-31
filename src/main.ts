import './style.css';
import config from './config';
import { getRepos } from './lib/github';
import { getLocalStorage } from './utils/readStorage';
import Leetcode from './lib/leetcode/api';

const login = () => {
  chrome.tabs.create({
    url: `https://github.com/login/oauth/authorize?client_id=${config.clientId}`,
  });
};

const logout = () => {
  chrome.storage.local.clear(() => {});
};

const populateRepo = async (
  selector: HTMLSelectElement,
  selected: string = ''
) => {
  const repos = await getRepos();

  repos.map((repo): void => {
    const option = document.createElement('option');
    option.value = repo.id.toString();
    option.text = repo.name;
    option.selected = repo.name === selected;
    selector.appendChild(option);
  });
};

const repoSelector = document.getElementById('repos');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const uploadBtn = document.getElementById('upload-btn');
const greeting = document.getElementById('greeting');

chrome.storage.local.get(['token', 'user'], async (result) => {
  if (result.token) {
    loginBtn.classList.toggle('hidden', true);
    logoutBtn.classList.toggle('hidden', false);
    uploadBtn.classList.toggle('hidden', false);
    greeting.classList.toggle('hidden', false);
    greeting.innerHTML = `${result.user.login}`;

    const selectedRepo = await getLocalStorage('selectedRepo');
    populateRepo(repoSelector as HTMLSelectElement, selectedRepo);
  }
});

loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
document.getElementById('test').addEventListener('click', async () => {
  console.log(await Leetcode.getTries('two-sum'));
  console.log(
    await Leetcode.getSubmissionDetails(
      await Leetcode.getLastAcceptedSubmissionId('two-sum')
    )
  );
});
