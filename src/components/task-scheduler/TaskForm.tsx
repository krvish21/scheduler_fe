import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Use relative URL for API calls to work with the proxy
const API_BASE = 'https://scheduler-whmr.onrender.com/api/v1';

interface TaskFormProps {
    onTaskCreated: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [scheduledFor, setScheduledFor] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setSubject('');
        setEmail('');
        setMessage('');
        setScheduledFor('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Convert local time to UTC
            const localDate = new Date(scheduledFor);
            console.log('Local time:', localDate.toLocaleString());
            
            // Create UTC date by adding the timezone offset
            const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
            console.log('UTC time:', utcDate.toISOString());
            
            const response = await axios.post(`${API_BASE}/task/create`, {
                subject,
                email,
                message,
                scheduledFor: utcDate.toISOString(),
                status: 'Pending'
            });

            if (response.status === 201) {
                toast.success('Task created successfully!', {
                    duration: 4000,
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    },
                });
                resetForm();
                onTaskCreated();
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task. Please try again.', {
                duration: 4000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-200 h-full">
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={isLoading}
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter task subject"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter recipient email"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={isLoading}
                        rows={3}
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your message"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700">Schedule For</label>
                    <input
                        type="datetime-local"
                        id="scheduledFor"
                        value={scheduledFor}
                        onChange={(e) => setScheduledFor(e.target.value)}
                        required
                        disabled={isLoading}
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Time will be converted to UTC when saved
                    </p>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Task'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm; 