import { useQuery } from 'react-query';
import LinkHeader from 'http-link-header';
import headers from '../src/headers';

const groups = () =>
  useQuery(
    'groups',
    async () => {
      const groups = [];
      let hasMorePages = true;
      let groupsFetchUrl =
        `${import.meta.env.VITE_GITLAB_URL}groups?pagination=keyset&per_page=100`; //todo config
      while (hasMorePages) {
        const response = await fetch(groupsFetchUrl, {
          headers,
        });

        if (response.headers.has('Link')) {
          const linkheader = LinkHeader.parse(
            response.headers.get('Link') as string
          );
          if (linkheader.has('rel', 'next')) {
            const reference = linkheader.rel('next');
            groupsFetchUrl = reference[0].uri;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
        groups.push(response.json());
      }
      return Promise.all(groups);
    },
    {
      select: (data) => data.flat(),
    }
  );

export default groups;
