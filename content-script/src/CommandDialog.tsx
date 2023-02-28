import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { ProjectResponse } from '../../src/GitLabApi';
import useGroupsQuery from '../../src/useGroupsQuery';
import useIssuesQuery from '../../src/useIssuesQuery';
import useProjectsQuery from '../../src/useProjectsQuery';
import { WithBadge } from './WithBadge';

const openUrl = (url: string) => {
  window.location.href = url;
};

const goToPage = (page: string) => {
  const currentUrl = new URL(document.URL);
  const pathSegments = currentUrl.pathname.split('/');
  if (pathSegments.length < 2) return;

  const group = pathSegments[1];
  const project = pathSegments[2];

  const newUrl = `${currentUrl.origin}/${group}/${project}/-/${page}`;
  window.location.href = newUrl;
};

const goToProjectPage = (project: ProjectResponse, page: string) => {
  const newUrl = `${project.web_url}/-/${page}`;
  window.location.href = newUrl;
};

interface Props {
  token: string;
}

enum Pages {
  start,
  options,
  issues,
}

const CommandDialog = (props: Props) => {
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(Pages.start);
  const [selectedProject, setselectedProject] =
    useState<ProjectResponse | null>(null);

  const [projectIssuesId, setprojectIssuesId] = useState<null | string>(null);

  const [search, setSearch] = useState('');

  const openProjectOptions = (project: ProjectResponse) => {
    setSearch('');
    setPage(Pages.options);
    setselectedProject(project);
  };

  const openIssues = () => {
    setSearch('');
    setPage(Pages.issues);
    setprojectIssuesId(selectedProject?.id || null);
  };

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey || e.altKey)) {
        setOpen((open) => !open);
        setPage(Pages.start);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const groups = useGroupsQuery(props.token);
  const projects = useProjectsQuery(props.token);
  const issues = useIssuesQuery(props.token, projectIssuesId);

  const clearStorage = () => {
    window.localStorage.removeItem('gitlabTimestamp');
    window.localStorage.removeItem('gitlabGroups');
    window.localStorage.removeItem('gitlabProjects');

    window.location.reload(); 
  };

  return (
    <Command.Dialog
      loop
      open={open}
      onOpenChange={setOpen}
      label="GitLab Spotlight"
    >
      <Command.Input value={search} onValueChange={setSearch} />
      <Command.List>
        {page == Pages.issues && selectedProject && (
          <>
            {issues.isLoading && (
              <Command.Loading>Bitte warten…</Command.Loading>
            )}
            {issues.data && (
              <Command.Group heading="Issues">
                <Command.Item
                  onSelect={() => goToProjectPage(selectedProject, 'issues')}
                >
                  Alle Issues
                </Command.Item>

                {issues.data.map((issue) => (
                  <Command.Item
                    onSelect={() => {
                      window.location.href = issue.web_url;
                    }}
                  >
                    <WithBadge
                      badgeTitle={
                        issue.assignee ? `@${issue.assignee.name}` : ''
                      }
                    >
                      #{issue.iid} {issue.title}
                    </WithBadge>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </>
        )}

        {selectedProject && page == Pages.options && (
          <>
            <Command.Group heading={selectedProject.name}>
              <Command.Item
                onSelect={() =>
                  (window.location.href = selectedProject.web_url)
                }
              >
                Zum Projekt
              </Command.Item>
              <Command.Item onSelect={openIssues}>Issues</Command.Item>
              <Command.Item
                onSelect={() => goToProjectPage(selectedProject, 'boards')}
              >
                Boards
              </Command.Item>
              <Command.Item
                onSelect={() => goToProjectPage(selectedProject, 'pipelines')}
              >
                Pipelines
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  goToProjectPage(selectedProject, 'merge_requests')
                }
              >
                Merge Requests
              </Command.Item>
            </Command.Group>
          </>
        )}

        {page == Pages.start && (
          <>
            <Command.Group heading="Springe zu">
              <Command.Item onSelect={() => goToPage('issues')}>
                Issues
              </Command.Item>
              <Command.Item onSelect={() => goToPage('boards')}>
                Boards
              </Command.Item>
              <Command.Item onSelect={() => goToPage('pipelines')}>
                Pipelines
              </Command.Item>
              <Command.Item onSelect={() => goToPage('merge_requests')}>
                Merge Requests
              </Command.Item>
            </Command.Group>

            {Object.keys(projects).length == 0 ? (
              <Command.Loading>Hang on…</Command.Loading>
            ) : (
              <Command.Group heading="Projekte">
                {projects.map((project: ProjectResponse) => (
                  <Command.Item onSelect={() => openProjectOptions(project)}>
                    <WithBadge badgeTitle="Projekt">{project.name}</WithBadge>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            {Object.keys(groups).length == 0 ? (
              <Command.Loading>Hang on…</Command.Loading>
            ) : (
              <Command.Group heading="Gruppen">
                {groups.map((group: any) => (
                  <Command.Item onSelect={() => openUrl(group.web_url)}>
                    <WithBadge badgeTitle="Gruppe">{group.name}</WithBadge>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            <Command.Item onSelect={clearStorage}>Cache leeren</Command.Item>
          </>
        )}
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandDialog;
