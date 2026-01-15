'use server'
import { UserList, UserListItem } from '@/lib/interfaces/user-lists';
import { cookies } from 'next/headers'
import { SirAxios } from '@/lib/api/axios';

export const fetchUserLists = async () => {
    const baseUrl = process.env.NEXT_SERVER_API_URL;

    const cookie = (await cookies());

    const response = await SirAxios.get(`${baseUrl}/user/lists`, {
        headers: {
            cookie: cookie.toString(),
        },
    });

    return response.data;
}