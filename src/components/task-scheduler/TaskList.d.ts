interface TaskResponse {
    id: string;
    body: string;
    from: string;
    scheduled_for: string;
    status: string;
    subject: string;
    to: string;
}
interface TaskListProps {
    pendingTasks: TaskResponse[];
    completedTasks: TaskResponse[];
    onTaskUpdated: () => void;
}
export default function TaskList({ pendingTasks, completedTasks, onTaskUpdated }: TaskListProps): import("react/jsx-runtime").JSX.Element;
export {};
