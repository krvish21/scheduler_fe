import React, { useState } from 'react';

interface TaskTemplateProps {
    taskType: string;
    onTemplateChange: (template: string) => void;
}

const TaskTemplate: React.FC<TaskTemplateProps> = ({ taskType, onTemplateChange }) => {
    const [otp, setOtp] = useState('');

    const generateOtpTemplate = (otp: string) => {
        return `Access Code: ${otp}`;
    };

    const generateLetterTemplate = () => {
        return `Dear [Name],

[Your letter content here]

Best regards,
[Your name]`;
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOtp = e.target.value;
        setOtp(newOtp);
        onTemplateChange(generateOtpTemplate(newOtp));
    };

    const handleLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onTemplateChange(e.target.value);
    };

    if (taskType === 'otp') {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Access Code</label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter access code"
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                        {generateOtpTemplate(otp).split('\n').map((line, index) => {
                            if (line.startsWith('Access Code:')) {
                                const [label, code] = line.split(': ');
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-gray-600">{label}:</span>
                                        <div 
                                            className="bg-white px-3 py-1.5 rounded border border-gray-200 cursor-pointer select-all hover:bg-gray-50 transition-colors duration-200 font-mono text-gray-900"
                                            onClick={() => navigator.clipboard.writeText(code)}
                                        >
                                            {code}
                                        </div>
                                    </div>
                                );
                            }
                            return <div key={index}>{line}</div>;
                        })}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label htmlFor="letter" className="block text-sm font-medium text-gray-700">Letter Content</label>
                <textarea
                    id="letter"
                    onChange={handleLetterChange}
                    defaultValue={generateLetterTemplate()}
                    rows={6}
                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
            </div>
        </div>
    );
};

export default TaskTemplate; 