import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature')!;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event: Stripe.Event;

    try {
        const payload = await req.text();
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log(`❌ Error message: ${err}`);
        return NextResponse.json({ message: `Webhook Error: ${err}` }, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;

            const paymentIntentId = session.payment_intent as string;
            //pegar as informações do pagamento
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            console.log('PaymentIntent:', paymentIntent);

            const donorName = paymentIntent.metadata.donorName;
            const donorMessage = paymentIntent.metadata.donorMessage;
            const donateId = paymentIntent.metadata.donateId;

            try {
                const updatedDonation = await prisma.donation.update({
                    where: { id: donateId },
                    data: {
                        status: "PAID",
                        donorName: donorName ?? "Anônimo",
                        donorMessage: donorMessage ?? "Sem mensagem",
                    }
                });
                console.log('Doação atualizada:', updatedDonation);

            } catch (error) {
                console.error('Error updating donation:', error);
                return NextResponse.json({ message: 'Error updating donation' }, { status: 500 });
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);

    }

    return NextResponse.json({ received: true });
}