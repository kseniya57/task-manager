import git from "./git";

export default async (relativePath, message) => {
  const gitRepository = git(relativePath);
  await gitRepository('add .');
  await gitRepository(`commit -m "${message}"`);
  await gitRepository('push');
}