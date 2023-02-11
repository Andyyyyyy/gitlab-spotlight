import { useQuery } from 'react-query';
import LinkHeader from 'http-link-header';
import { useLocalStorage } from './useLocalStorage';

const projects = (token: string) => {
  const [projects, setProjects] = useLocalStorage<string>(
    'gitlabProjects',
    '{}'
  );
  // cache lifetime
  const [timestamp, setTimestamp] = useLocalStorage<string>(
    'gitlabTimestamp',
    '0'
  );

  useQuery(
    'projects',
    async () => {
      const projects = [];
      let hasMorePages = true;
      let projectsFetchUrl = `${
        import.meta.env.VITE_GITLAB_URL
      }projects?pagination=keyset&per_page=100&order_by=id`; //todo config
      while (hasMorePages) {
        const response = await fetch(projectsFetchUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.headers.has('Link')) {
          const linkheader = LinkHeader.parse(
            response.headers.get('Link') as string
          );
          if (linkheader.has('rel', 'next')) {
            const reference = linkheader.rel('next');
            projectsFetchUrl = reference[0].uri;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
        projects.push(response.json());
      }
      return Promise.all(projects);
    },
    {
      select: (data) => data.flat(),
      onSuccess: (data) => {
        setProjects(JSON.stringify(data));
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setTimestamp(tomorrow.getTime().toString());
      },
      enabled:
        Object.keys(JSON.parse(projects)).length == 0 ||
        parseInt(timestamp) < new Date().getTime(),
    }
  );
  return JSON.parse(projects) as { [key: string]: any };
};

export default projects;
