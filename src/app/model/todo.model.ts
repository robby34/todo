export interface Todo {
    id: number;
    title: string;
    state: 'DONE' | 'UNDONE';
    description?: string;
    creationDate?: Date;
    dueDate?: Date;
}

export function compareTodo(a: Todo, b: Todo) {
    if (a.state === b.state) {
        return new Date(b.creationDate ? b.creationDate : 0).getTime() - new Date(a.creationDate ? a.creationDate : 0).getTime();
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
        dueDate: todo.dueDate
    };
}
