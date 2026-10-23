import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  Target,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  Flag,
  ArrowRight
} from 'lucide-react';

export default function GoalsTasksPage() {
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'today' | 'upcoming' | 'overdue'

  // Modals
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Form states
  const [goalForm, setGoalForm] = useState({ title: '', description: '', targetDate: '', category: 'CAREER' });
  const [taskForm, setTaskForm] = useState({ title: '', goalId: '', priority: 'MEDIUM', dueDate: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (taskFilter !== 'all') params.filter = taskFilter;

      const [goalsRes, tasksRes] = await Promise.all([
        api.getGoals(),
        api.getTasks(params)
      ]);
      setGoals(goalsRes || []);
      setTasks(tasksRes || []);
      if (goalsRes?.length > 0 && !taskForm.goalId) {
        setTaskForm(prev => ({ ...prev, goalId: goalsRes[0].id }));
      }
    } catch (err) {
      console.error('Failed to load goals & tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [taskFilter]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;

    try {
      await api.createGoal(goalForm);
      setGoalModalOpen(false);
      setGoalForm({ title: '', description: '', targetDate: '', category: 'CAREER' });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create goal.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    try {
      await api.createTask(taskForm);
      setTaskModalOpen(false);
      setTaskForm({ title: '', goalId: goals[0]?.id || '', priority: 'MEDIUM', dueDate: '' });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create task.');
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      await api.updateTask(taskId, { status: nextStatus });
      loadData();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Delete this goal and its associated tasks?')) return;
    try {
      await api.deleteGoal(goalId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete goal.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
        <div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">Goals & Tasks</h1>
          <p className="text-xs text-textMuted-light dark:text-textMuted-dark mt-1">
            Break long-term career aspirations into structured, high-impact milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setGoalModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5 text-primary" />
            <span>New Goal</span>
          </button>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 1. Goals Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" /> Active Goals ({goals.length})
        </h3>

        {goals.length === 0 ? (
          <div className="glass-card p-6 rounded-2xl text-center space-y-2">
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">No goals defined yet.</p>
            <button onClick={() => setGoalModalOpen(true)} className="text-xs font-bold text-primary">
              + Define your first goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.map(g => (
              <div key={g.id} className="glass-card p-5 rounded-2xl border border-borderBase-light dark:border-borderBase-dark flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase">{g.category}</span>
                    <button onClick={() => handleDeleteGoal(g.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">{g.title}</h4>
                  {g.description && <p className="text-xs text-textMuted-light dark:text-textMuted-dark line-clamp-2">{g.description}</p>}

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>Tasks Done</span>
                      <span>{g.completedTasks}/{g.totalTasks} ({g.progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${g.progressPercent}%` }} />
                    </div>
                  </div>
                </div>

                {g.targetDate && (
                  <div className="pt-2 border-t border-borderBase-light dark:border-borderBase-dark text-[11px] text-textMuted-light dark:text-textMuted-dark flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Target: {new Date(g.targetDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Tasks Module with Quick Filter Tabs */}
      <div className="space-y-4 pt-4 border-t border-borderBase-light dark:border-borderBase-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-textMuted-light dark:text-textMuted-dark flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tasks Checklist
          </h3>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'today', label: "Today's" },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'overdue', label: 'Overdue' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTaskFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  taskFilter === tab.id
                    ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                    : 'text-textMuted-light dark:text-textMuted-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="glass-card p-10 rounded-3xl text-center space-y-2">
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">No tasks in this view.</p>
            <button onClick={() => setTaskModalOpen(true)} className="text-xs font-bold text-primary">
              + Create a new task
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl divide-y divide-borderBase-light dark:divide-borderBase-dark overflow-hidden border">
            {tasks.map(task => (
              <div
                key={task.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                    }`}
                  >
                    {task.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <div>
                    <h5 className={`text-xs font-medium ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-textMain-light dark:text-textMain-dark'}`}>
                      {task.title}
                    </h5>
                    <div className="flex items-center gap-3 text-[10px] text-textMuted-light dark:text-textMuted-dark mt-0.5">
                      {task.goal && <span>Goal: {task.goal.title}</span>}
                      {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                    task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full space-y-4 shadow-soft-lg border">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Create Career Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Goal Title</label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="e.g. Master React and deploy 2 apps"
                  required
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Description</label>
                <textarea
                  rows={2}
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  placeholder="Key deliverables and milestones..."
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Target Date</label>
                <input
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setGoalModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full space-y-4 shadow-soft-lg border">
            <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">Create Learning Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Task Description</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Complete Flexbox Froggy challenge"
                  required
                  className="w-full p-2.5 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                />
              </div>

              {goals.length > 0 && (
                <div>
                  <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Link to Goal (Optional)</label>
                  <select
                    value={taskForm.goalId}
                    onChange={(e) => setTaskForm({ ...taskForm, goalId: e.target.value })}
                    className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                  >
                    <option value="">None</option>
                    {goals.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-textMuted-light dark:text-textMuted-dark mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-borderBase-light dark:border-borderBase-dark bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setTaskModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
