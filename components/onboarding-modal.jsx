"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Progress } from "./ui/progress"
import { Heart, MapPin } from "lucide-react"

export function OnboardingModal({ isOpen, onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const progress = (step / 2) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="mb-4 mt-6">
                        <Progress value={progress} className="h-1" />
                    </div>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        {step === 1 ? (
                            <>
                                <Heart className="w-6 h-6 text-orange-500" />
                                What interests you?
                            </>
                        ) : (
                            <>
                                <MapPin className="w-6 h-6 text-orange-500" />
                                Where are you located?
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Select at least 3 categories to personalize your experience"
                            : "We'll show you events happening near you"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">Content</div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
