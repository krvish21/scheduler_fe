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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
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
                // Reset form
                setSubject('');
                setEmail('');
                setMessage('');
                setScheduledFor('');
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
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        rows={3}
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
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
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Time will be converted to UTC when saved
                    </p>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm; 