export interface ProjectResponse {
  id: string;
  description: any;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
  default_branch: string;
  tag_list: Array<string>;
  topics: Array<string>;
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  avatar_url: string;
  star_count: number;
  last_activity_at: string;
  namespace: {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
    parent_id: any;
    avatar_url: any;
    web_url: string;
  };
}

export interface ProjectIssuesResponse {
  project_id: number;
  milestone: {
    due_date: any;
    project_id: number;
    state: string;
    description: string;
    iid: number;
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
  };
  author: {
    state: string;
    web_url: string;
    avatar_url: any;
    username: string;
    id: number;
    name: string;
  };
  description: string;
  state: string;
  iid: number;
  assignees: Array<{
    avatar_url: any;
    web_url: string;
    state: string;
    username: string;
    id: number;
    name: string;
  }>;
  assignee: {
    avatar_url: any;
    web_url: string;
    state: string;
    username: string;
    id: number;
    name: string;
  };
  type: string;
  labels: Array<string>;
  upvotes: number;
  downvotes: number;
  merge_requests_count: number;
  id: number;
  title: string;
  updated_at: string;
  created_at: string;
  closed_at: string;
  closed_by: {
    state: string;
    web_url: string;
    avatar_url: any;
    username: string;
    id: number;
    name: string;
  };
  user_notes_count: number;
  due_date: string;
  web_url: string;
  references: {
    short: string;
    relative: string;
    full: string;
  };
  time_stats: {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate: any;
    human_total_time_spent: any;
  };
  has_tasks: boolean;
  task_status: string;
  confidential: boolean;
  discussion_locked: boolean;
  issue_type: string;
  severity: string;
  _links: {
    self: string;
    notes: string;
    award_emoji: string;
    project: string;
    closed_as_duplicate_of: string;
  };
  task_completion_status: {
    count: number;
    completed_count: number;
  };
}
