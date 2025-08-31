"use client";


import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CreateAccountButton() {
    const [loading, setLoading] = useState(false);

    async function handleCreateStripeAccount() {
        setLoading(true);
        //localhost:3000/api/stripe/create-account
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/stripe/create-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                setLoading(false);
                alert("Falha ao criar conta de pagamento");
            }
        } catch (err) {
            setLoading(false);
            alert("Falha ao criar conta de pagamento");
        }
    }
    return (
        <div className="mb-5">
            <Button className="cursor-pointer"
                onClick={handleCreateStripeAccount}
                disabled={loading}
            >
                {loading ? "Carregando..." : "Ativar conta de pagamentos"}
            </Button>
        </div>
    );
}