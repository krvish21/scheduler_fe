import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskForm from './task-scheduler/TaskForm';
import TaskList from './task-scheduler/TaskList';

const api = import.meta.env.VITE_API_ENDPOINT;
const POLLING_INTERVAL = 30000; // 30 seconds

interface TaskResponse {
  id: string;
  body: string;
  from: string;
  scheduled_for: string;
  status: string;
  subject: string;
  to: string;
}

export default function TaskScheduler() {
  const [pendingTasks, setPendingTasks] = useState<TaskResponse[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const [pendingResponse, completedResponse] = await Promise.all([
        axios.get(`${api}/task/fetch/pending`),
        axios.get(`${api}/task/fetch/completed`)
      ]);

      setPendingTasks(pendingResponse.data);
      setCompletedTasks(completedResponse.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchTasks();

    // Set up polling
    const intervalId = setInterval(fetchTasks, POLLING_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchTasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Scheduler</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your scheduled tasks and track their status
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TaskList
              tasks={pendingTasks}
              title="Pending Tasks"
              emptyMessage="No pending tasks. Create a new task to get started!"
            />
            
            <TaskList
              tasks={completedTasks}
              title="Completed Tasks"
              emptyMessage="No completed tasks yet."
            />
          </div>

          <div className="lg:col-span-1">
            <TaskForm onTaskCreated={fetchTasks} />
          </div>
        </div>
      </main>
    </div>
  );
} 