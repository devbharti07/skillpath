const BASE_URL = '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('skillpath_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('skillpath_token', token);
    } else {
      localStorage.removeItem('skillpath_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include' // Sends HttpOnly cookie
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.error || 'An unexpected request error occurred.');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  // Auth endpoints
  login(credentials) {
    return this.request('/auth/login', { method: 'POST', body: credentials });
  }

  register(userData) {
    return this.request('/auth/register', { method: 'POST', body: userData });
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  getMe() {
    return this.request('/auth/me');
  }

  updateProfile(profileData) {
    return this.request('/auth/profile', { method: 'PUT', body: profileData });
  }

  changePassword(passwords) {
    return this.request('/auth/change-password', { method: 'PUT', body: passwords });
  }

  forgotPassword(email) {
    return this.request('/auth/forgot-password', { method: 'POST', body: { email } });
  }

  exportData() {
    return this.request('/auth/export-data');
  }

  // Onboarding
  getOnboarding() {
    return this.request('/onboarding');
  }

  saveOnboarding(data) {
    return this.request('/onboarding', { method: 'POST', body: data });
  }

  // Dashboard
  getDashboardOverview() {
    return this.request('/dashboard/overview');
  }

  // Skills
  getSkills(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/skills${query ? `?${query}` : ''}`);
  }

  getMySkills() {
    return this.request('/skills/my-skills');
  }

  addOrUpdateUserSkill(data) {
    return this.request('/skills/my-skills', { method: 'POST', body: data });
  }

  deleteUserSkill(skillId) {
    return this.request(`/skills/my-skills/${skillId}`, { method: 'DELETE' });
  }

  // Careers
  getCareers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/careers${query ? `?${query}` : ''}`);
  }

  getCareer(slug) {
    return this.request(`/careers/${slug}`);
  }

  compareCareers(ids) {
    return this.request('/careers/compare', { method: 'POST', body: { ids } });
  }

  // Roadmaps
  getRoadmaps(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/roadmaps${query ? `?${query}` : ''}`);
  }

  getRoadmap(slug) {
    return this.request(`/roadmaps/${slug}`);
  }

  getMyRoadmaps() {
    return this.request('/roadmaps/my-roadmaps');
  }

  enrollRoadmap(data) {
    return this.request('/roadmaps/enroll', { method: 'POST', body: data });
  }

  updateRoadmapProgress(data) {
    return this.request('/roadmaps/progress', { method: 'POST', body: data });
  }

  updateRoadmapSettings(id, data) {
    return this.request(`/roadmaps/settings/${id}`, { method: 'PUT', body: data });
  }

  // Assessments
  getAssessments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/assessments${query ? `?${query}` : ''}`);
  }

  getAssessment(slug) {
    return this.request(`/assessments/${slug}`);
  }

  submitAssessment(data) {
    return this.request('/assessments/submit', { method: 'POST', body: data });
  }

  getAssessmentHistory() {
    return this.request('/assessments/history');
  }

  getAssessmentAttempt(id) {
    return this.request(`/assessments/attempt/${id}`);
  }

  // Resources & Bookmarks
  getResources(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/resources${query ? `?${query}` : ''}`);
  }

  toggleBookmark(itemType, itemId) {
    return this.request('/resources/bookmark', { method: 'POST', body: { itemType, itemId } });
  }

  getUserBookmarks() {
    return this.request('/resources/bookmarks');
  }

  // Projects
  getProjectTemplates() {
    return this.request('/projects/templates');
  }

  getMyProjects() {
    return this.request('/projects/my-projects');
  }

  createProject(data) {
    return this.request('/projects', { method: 'POST', body: data });
  }

  updateProject(id, data) {
    return this.request(`/projects/${id}`, { method: 'PUT', body: data });
  }

  deleteProject(id) {
    return this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  getPublicPortfolio(userId) {
    return this.request(`/projects/portfolio/${userId}`);
  }

  // Goals & Tasks
  getGoals() {
    return this.request('/goals');
  }

  createGoal(data) {
    return this.request('/goals', { method: 'POST', body: data });
  }

  updateGoal(id, data) {
    return this.request(`/goals/${id}`, { method: 'PUT', body: data });
  }

  deleteGoal(id) {
    return this.request(`/goals/${id}`, { method: 'DELETE' });
  }

  getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/tasks${query ? `?${query}` : ''}`);
  }

  createTask(data) {
    return this.request('/tasks', { method: 'POST', body: data });
  }

  updateTask(id, data) {
    return this.request(`/tasks/${id}`, { method: 'PUT', body: data });
  }

  deleteTask(id) {
    return this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  // AI Assistant
  getAssistantHistory() {
    return this.request('/assistant/history');
  }

  clearAssistantHistory() {
    return this.request('/assistant/history', { method: 'DELETE' });
  }

  chatWithAssistant(message) {
    return this.request('/assistant/chat', { method: 'POST', body: { message } });
  }

  // Admin
  getAdminOverview() {
    return this.request('/admin/overview');
  }

  getAdminUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  createAdminCareer(data) {
    return this.request('/admin/careers', { method: 'POST', body: data });
  }

  createAdminSkill(data) {
    return this.request('/admin/skills', { method: 'POST', body: data });
  }

  createAdminResource(data) {
    return this.request('/admin/resources', { method: 'POST', body: data });
  }
}

export const api = new ApiClient();
export default api;
