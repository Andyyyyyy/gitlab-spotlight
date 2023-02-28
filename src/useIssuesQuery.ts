import { useQuery } from 'react-query';
import { ProjectIssuesResponse } from './GitLabApi';

const issues = (token: string, projectId: string | null) => {
  return useQuery<Array<ProjectIssuesResponse>>(
    `projects/${projectId}/issues`,
    async () => {
      const response = await fetch(`${import.meta.env.VITE_GITLAB_URL}projects/${projectId}/issues?state=opened&order_by=updated_at`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.json();
    },
    {
      enabled: !!projectId,
    }
  );
};

export default issues;
