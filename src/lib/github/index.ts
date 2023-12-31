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

export const getRepos = async () => {
  const octokit = await getOctokit();
  const username = (await getLocalStorage('user')).login;
  const repos = await octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      per_page: 100,
    },
    (response) => response.data.filter((r) => r.owner.login === username)
  );
  repos.sort((a, b) => (a.name > b.name ? 1 : -1));
  return repos;
};

export const getRepoInfo = async (repository: string) => {
  const octokit = await getOctokit();
  const username = (await getLocalStorage('user')).login;

  const repo = await octokit.rest.repos.get({
    owner: username,
    repo: repository,
  });

  const repoOwner = repo.data.owner.login;
  const repoName = repo.data.name;
  const rootPath = repo.data.default_branch;

  return { repoOwner, repoName, rootPath };
};

export const upload = async (
  repo: string,
  relativePath: string,
  content: string,
  commitMsg: string
) => {
  const octokit = await getOctokit();

  var { repoOwner, repoName, rootPath } = await getRepoInfo(repo);

  if (rootPath.endsWith('/'))
    rootPath = rootPath.substring(0, rootPath.length - 1);

  const filePath = `${rootPath}/${relativePath}`;
  let sha;

  try {
    const fileResponse = await octokit.rest.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path: filePath,
    });

    if (Array.isArray(fileResponse.data)) {
      return;
    } else {
      sha = fileResponse.data.sha;
    }
  } catch (e) {
    console.log(e);
  }
  console.log(filePath, '<<<<<<<<<<<<<');
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner: repoOwner,
    repo: repoName,
    path: filePath,
    message: commitMsg,
    content: btoa(content),
    sha: sha,
  });

  return response.data.content.html_url;
};
