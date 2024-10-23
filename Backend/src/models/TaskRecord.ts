// models/TaskRecord.ts

export interface TaskRecord {
    xata_id: string;          // Unique identifier for the task
    assignedTo: string;       // ID of the user assigned to the task (link to Users)
    description: string;      // Description of the task
    due_date: Date;          // Due date for the task
    project_id: string;       // ID of the project this task belongs to (link to Projects)
    status: string;           // Current status of the task (e.g., "pending", "completed")
    xata_createdat: Date;     // Timestamp when the task was created
    xata_updatedat: Date;     // Timestamp when the task was last updated
    xata_version: number;     // Version number for optimistic locking (if applicable)
}
