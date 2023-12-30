import { getLocalStorage } from '../../utils/readStorage';
import { Octokit } from 'octokit';

export const getOctokit = async () => {
  const token = await getLocalStorage('token');
  return new Octokit({
    auth: token,
  });
};

export const getUser = async () => {
  const octokit = await getOctokit();

  const user = (await octokit.rest.users.getAuthenticated()).data;

  return user;
};

export const getUserLocal = async () => {
  const user = await getLocalStorage('user');
};

export const getRepos = async () => {
  const octokit = await getOctokit();

  await octokit.request('GET /users/{username}/repos', {
    username: 'USERNAME',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
};
