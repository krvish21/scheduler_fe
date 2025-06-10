import { format, parseISO } from 'date-fns';

interface TaskResponse {
  id: string;
  body: string;
  from: string;
  scheduled_for: string;
  status: string;
  subject: string;
  to: string;
}

interface TaskCardProps {
  task: TaskResponse;
}

const formatDateTime = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-100 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-semibold text-gray-900 truncate">{task.subject}</h4>
            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              task.status === 'Pending' 
                ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' 
                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            }`}>
              {task.status}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {formatDateTime(task.scheduled_for)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">From</p>
            <p className="text-sm text-blue-600 truncate">{task.from}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="shrink-0 w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center">
            <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">To</p>
            <p className="text-sm text-purple-600 truncate">{task.to}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="shrink-0 w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">Message</p>
            <p className="text-sm text-gray-600 line-clamp-2">{task.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 