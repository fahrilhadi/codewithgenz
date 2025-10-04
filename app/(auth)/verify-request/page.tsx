"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Code, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequest() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [emailPending, startEmailTransition] = useTransition();
    const params = useSearchParams();
    const email = params.get('email') as string;
    const isOtpCompleted = otp.length === 6;

    function verifyOtp() {
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email verified, you will be redirected...");
                        router.push("/");
                    },
                    onError: () => {
                        toast.error("Error verifying Email/OTP")
                    },
                },
            });
        });
    }
    return (
        <div className="flex flex-col gap-6">
            <form>
                <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                    >
                    <div className="flex size-8 items-center justify-center rounded-md">
                        <Code className="size-8" />
                    </div>
                    <span className="sr-only">Codewithgenz</span>
                    </a>
                    <h1 className="text-xl font-bold">Enter verification code</h1>
                    <FieldDescription>
                    We sent a 6-digit code to your email address
                    </FieldDescription>
                </div>
                <Field>
                    <FieldLabel htmlFor="otp" className="sr-only">
                    Verification code
                    </FieldLabel>
                    <InputOTP
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    maxLength={6}
                    required
                    containerClassName="gap-4"
                    >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                    </InputOTP>
                    <FieldDescription className="text-center">
                    Didn&apos;t receive the code? <a href="#">Resend</a>
                    </FieldDescription>
                </Field>
                <Field>
                    <Button onClick={verifyOtp} disabled={emailPending || !isOtpCompleted} className="cursor-pointer">
                        {emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            "Verify"
                        )}
                    </Button>
                </Field>
                </FieldGroup>
            </form>
            <FieldDescription className="px-6 text-center">
                By signing in, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}