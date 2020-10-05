export interface Todo {
    id: number;
    title: string;
    state: 'DONE' | 'UNDONE';
    description?: string;
    creationDate?: Date;
    dueDate?: Date;
    doneDate?: Date;
}

export function compareTodo(a: Todo, b: Todo) {
    if (a.state === b.state) {
        if (a.state === 'UNDONE') {
            // The UNDONE Todos are sorted chronologically according the creation date, most recent first
            return new Date(b.creationDate ? b.creationDate : 0).getTime() - new Date(a.creationDate ? a.creationDate : 0).getTime();
        } else {
            // The DONE Todos are sorted chronologically according the done date, most recent last
            return new Date(a.doneDate ? a.doneDate : 0).getTime() - new Date(b.doneDate ? b.doneDate : 0).getTime();
        }
    } else if (a.state === 'DONE') {
        return 1;
    } else {
        return -1;
    }
}

export function cloneTodo(todo: Todo): Todo {
    return {
        id: todo.id,
        title: todo.title,
        state: todo.state,
        description: todo.description,
        creationDate: todo.creationDate,
        dueDate: todo.dueDate,
        doneDate: todo.doneDate
    };
}
