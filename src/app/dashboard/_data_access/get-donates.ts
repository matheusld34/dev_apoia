"use serve"

import { prisma } from "@/lib/prisma"


export async function getAllDonates(userId: string) {

    if (!userId) {
        return {
            data: []
        }
    }
    try {

        const donates = await prisma.donation.findMany({
            where: {
                userdId: userId,
                status: 'PAID'
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {

                id: true,
                donorName: true,
                donorMessage: true,
                amount: true,
                createdAt: true
            },
        })
        return {
            data: donates
        }

    } catch (err) {
        return {
            data: []
        }
    }
}
