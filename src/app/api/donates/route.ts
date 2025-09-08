
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const Get = auth(async function Get(request) {

    if (!request.auth) {
        return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
    }

    try {
        const donates = await prisma.donation.findMany({
            where: {
                userdId: request.auth.user?.id,
                status: 'PAID'
            },
            orderBy: {
                createdAt: 'desc'
            },
        })

        return NextResponse.json({ data: donates })

    } catch (err) {
        return NextResponse.json({ error: "Falha ao buscar doantes" }, { status: 400 })
    }

})