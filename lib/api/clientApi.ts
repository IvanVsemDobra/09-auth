import { User } from "@/types/user";
import type { Note, NoteFormData } from "../../types/note";
import { nextServer } from "./api";

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
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      search: query,
      page: page,
      perPage: PER_PAGE,
      tag: category,
    },
  });
  return data;
}

export async function createNote(newNote: NoteFormData): Promise<Note> {
  const { data } = await nextServer.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
}

export const fetchNoteById = async (id: string) => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

interface CheckSessionRequest {
  success: boolean;
}

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};
export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};
export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export type UpdateRequest = {
  username: string;
};
export const updateMe = async (data: UpdateRequest) => {
  const res = await nextServer.patch<User>("/users/me", data);
  return res.data;
};