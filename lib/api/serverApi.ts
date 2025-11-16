import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};
export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
const PER_PAGE = 12;

export async function fetchNotes(
  query: string,
  page: number,
  category?: string
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      search: query,
      page: page,
      perPage: PER_PAGE,
      tag: category,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}
export const fetchNoteById = async (id: string) => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};