"use client"

import * as React from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createPayment } from "../actions/create-payment"
import { toast } from "sonner"
import { getStripeJs } from "@/lib/stripe-js"


const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    message: z.string().min(1, "A mensagem é obrigatória"),
    price: z.enum(["15", "25", "35"]).refine(val => !!val, {
        message: "O valor é obrigatório",
    })
})

type FormData = z.infer<typeof formSchema>;

interface FormDonateProps {
    slug: string;
    creatorId: string;
}



export function FormDonate({ slug, creatorId }: FormDonateProps) {

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            message: "",
            price: "15",
        },
    })

    async function onSubmit(data: FormData) {

        const priceInCents = Number(data.price) * 100;

        const checkout = await createPayment({
            name: data.name,
            message: data.message,
            creatorId: creatorId,
            price: priceInCents,
            slug: slug
        })

    }

    async function handlePaymentResponse(checkout: { sessionId?: string, error?: string }) {
        if (checkout.error) {
            toast.error(checkout.error)
            return;
        }
        if (!checkout.sessionId) {
            toast.error("Erro ao processar pagamento, tente novamente mais tarde")
            return;
        }
        const stripe = await getStripeJs()
        await stripe?.redirectToCheckout({ sessionId: checkout.sessionId })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu nome" {...field}
                                    className="bg-white"
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite sua mendagem" {...field}
                                    className="bg-white"
                                />
                            </FormControl>
                            <Textarea placeholder="Digite sua mendagem" {...field}
                                className="bg-white h-32 resize-none" />

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor da doação</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center gap-3"
                                >
                                    {["15", "25", "35"].map((value) => (
                                        <div key={value} className="flex items-center space-x-2 gap-2">
                                            <RadioGroupItem value={value} id={value} />
                                            <Label className="text-lg" htmlFor={value}>R$ {value}</Label>
                                        </div>
                                    ))}

                                </RadioGroup>
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "carregando" : "Doar"}</Button>
            </form>
        </Form >
    )
}


