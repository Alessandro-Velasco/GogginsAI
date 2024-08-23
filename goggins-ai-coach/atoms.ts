import { atom } from "jotai";
import { Assistant, UserThread } from "@prisma/client";


export const userThreadAtom = atom<UserThread | null>(null);
export const assistantAtom = atom<Assistant | null>(null);