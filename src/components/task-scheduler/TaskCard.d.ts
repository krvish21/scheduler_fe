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
export default function TaskCard({ task }: TaskCardProps): import("react/jsx-runtime").JSX.Element;
export {};
