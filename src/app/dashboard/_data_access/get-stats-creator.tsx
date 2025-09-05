"use server";
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { error } from 'console';


export async function getStats(userId: string, stripeAccountId: string) {
    if (!userId) {
        return {
            error: "Usuario não autenticado"
        }
    }
    try {
        const totalDonations = await prisma.donation.count({
            where: {
                userdId: userId,
                status: "PAID"
            }
        });
        const totalAmountDonated = await prisma.donation.aggregate({
            where: {
                userdId: userId,
                status: "PAID"
            },
            _sum: {
                amount: true
            }
        });

        const balance = await stripe.balance.retrieve({
            stripeAccount: stripeAccountId
        });

        return {
            totalDonations: totalDonations,
            totalAmountResult: totalAmountDonated._sum.amount ?? 0,
            balance: balance?.pending[0]?.amount ?? 0,
        }

    } catch (err) {
        console.log(err);
        return {
            error: "Erro ao buscar dados"
        }
    }
}

