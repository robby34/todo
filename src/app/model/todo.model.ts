export interface Todo {
    id: number,
    title: string,
    description: string,
    creationDate: Date,
    dueDate?: Date,
    state: 'DONE' | 'UNDONE'
}
