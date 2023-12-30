import config from './config';

const login = () => {
  chrome.tabs.create({
    url: `https://github.com/login/oauth/authorize?client_id=${config.clientId}`,
  });
};

const loginBtn = document.getElementById('btn');
const greeting = document.getElementById('greeting');

chrome.storage.local.get(['token', 'user'], (result) => {
  if (result.token) {
    loginBtn.classList.toggle('hidden', true);
    greeting.classList.toggle('hidden', false);
    greeting.innerHTML = `Hello, ${result.user.login}`;
  }
});

loginBtn.addEventListener('click', login);
