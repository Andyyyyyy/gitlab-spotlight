import { useQuery } from 'react-query';
import LinkHeader from 'http-link-header';
import headers from './headers';

const projects = () =>
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
          headers,
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
    }
  );

export default projects;
