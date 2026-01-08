'use server'
import { UserList, UserListItem } from '@/lib/interfaces/user-lists';

export const fetchUserLists = async (userId: string): Promise<UserList[]> => {
    const response = await fetch(`/api/user/${userId}/lists`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user lists');
    }

    const data = await response.json();

    return data.lists as UserList[];
}