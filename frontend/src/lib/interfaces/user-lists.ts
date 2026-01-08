interface UserList {
    id: number;
    name: string;
    items: UserListItem[];
}

interface UserListItem {
    id: number;
    name: string;
    isCompleted: boolean;
}

export type { UserList, UserListItem };