export interface Todo {
    id: number;
    title: string;
    state: 'DONE' | 'UNDONE';
    description?: string;
    creationDate?: Date;
    dueDate?: Date;
}
