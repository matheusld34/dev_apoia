"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { stripe } from "@/lib/stripe"

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
            error: schema.error.issues[0].message
        }
    }

    if (!data.creatorId) {
        return {
            error: "Creator não encontrado"
        }
    }

    try {
        const creator = await prisma.user.findFirst({
            where: {
                connectedStripeAccountId: data.creatorId
            },
        })
        if (!creator) {
            return {
                error: "Falha ao criar pagamento, tente novamente mais tarde"
            }
        }
        //Calcular taxa do serviço

        const applicationFeeAmount = Math.floor(data.price * 0.10)

        const donate = await prisma.donation.create({
            data: {
                donorName: data.name,
                donorMessage: data.message,
                userdId: creator.id,
                status: "PENDING",
                amount: (data.price - applicationFeeAmount)
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.HOST_URL}/creator/${data.slug}`,
            cancel_url: `${process.env.HOST_URL}/creator/${data.slug}`,
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: `Apoio para ${creator.name}`,
                        },
                        unit_amount: data.price * 100,
                    },
                    quantity: 1,
                },
            ],
            payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
                transfer_data: {
                    destination: creator.connectedStripeAccountId as string,
                },
                metadata: {
                    donateName: data.name,
                    donateMessage: data.message,
                    donateId: donate.id
                }
            },
        })

        return {
            sessionId: session.id,
        }

    } catch (err) {
        return {
            error: "Erro ao criar pagamento"
        }
    }

}