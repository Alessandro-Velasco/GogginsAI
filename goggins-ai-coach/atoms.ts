import { atom } from "jotai";
import { UserThread } from "@prisma/client";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const userThreadAtom = atom<UserThread | null>(null);