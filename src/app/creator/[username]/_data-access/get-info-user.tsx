"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
const createUserNameSchema = z.object({
    username: z.string({ message: "O username é obrigatório" }).min(4, "O username precisa ter no mínimo 4 caracteres")
})

type CreateUserNameSchema = z.infer<typeof createUserNameSchema>;

export async function getInfoUser(data: CreateUserNameSchema) {
    const schema = createUserNameSchema.safeParse(data);

    if (!schema.success) {
        return null
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: data.username
            },
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                image: true,

            }
        })

        if (!user) {
            return {
                data: null,
                error: "Usuário não encontrado"
            }
        }

        return {
            data: user,
            error: null
        }

    } catch (err) {
        console.log(err);
        return {
            data: null,
            error: "Erro ao buscar o usuário"
        }
    }
}