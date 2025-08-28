"use server"

import { prisma } from "@/lib/prisma"
import { error } from "console";
import { z } from "zod"
import { da } from "zod/v4/locales";

const createUserNameSchema = z.object({
    slug: z.string().min(1, "O slug é obrigatório"),
    name: z.string().min(1, "O nome precisa ter no mínimo 1 caractere"),
    message: z.string().min(5, "A mensagem precisar ter no mínimo 5 caracteres"),
    price: z.number().min(15, "O valor mínimo é 15"),
    creatorId: z.string(),
})

type CreatePaumentSchema = z.infer<typeof createUserNameSchema>;

export async function createPayment(data: CreatePaumentSchema) {
    const schema = createUserNameSchema.safeParse(data);

    if (!schema.success) {
        return {
            data: null,
            error: schema.error.issues[0].message
        }
    }

    try {
        console.log(data);
    }

    catch (err) {
        return {
            data: null,
            error: "Erro ao criar pagamento"
        }
    }

}