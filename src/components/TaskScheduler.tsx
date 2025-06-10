import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskForm from './task-scheduler/TaskForm';
import TaskList from './task-scheduler/TaskList';

// Use relative URL for API calls to work with the proxy
const API_BASE = 'https://scheduler-whmr.onrender.com/api/v1';
const POLLING_INTERVAL = 30000; // 30 seconds

interface TaskResponse {
  id: string;
  body: string;
  from: string;
  scheduled_for: string;
  status: string;
  subject: string;
  to: string;
  timezone: string;
}

export default function TaskScheduler() {
  const [pendingTasks, setPendingTasks] = useState<TaskResponse[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const [pendingResponse, completedResponse] = await Promise.all([
        axios.get(`${API_BASE}/task/fetch/pending`),
        axios.get(`${API_BASE}/task/fetch/completed`)
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Task Scheduler</h1>
          <p className="text-gray-600">Schedule and manage your email tasks efficiently</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Schedule New Task</h2>
              <TaskForm onTaskCreated={fetchTasks} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Task List</h2>
              <TaskList 
                pendingTasks={pendingTasks} 
                completedTasks={completedTasks} 
                onTaskUpdated={fetchTasks}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 