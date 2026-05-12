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
import { useMemo, useState } from "react"
import { Progress } from "./ui/progress"
import { ArrowLeft, ArrowRight, Heart, Loader2, MapPin } from "lucide-react"
import { CATEGORIES } from "@/lib/data"
import { Badge } from "./ui/badge"
import { useConvexMutation } from "@/hooks/use-convex-query"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { districts_en, divisions_en } from "bangladesh-location-data"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"

export function OnboardingModal({ isOpen, onClose, onComplete }) {
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [location, setLocation] = useState({
        state: "",
        city: "",
        country: "Bangladesh",
    });

    const { mutate: completeOnboarding, isLoading } = useConvexMutation(
        api.users.completeOnboarding
    );

    const bdDivisions = divisions_en;
    const districts = districts_en;

    const bdDistricts = useMemo(() => {
        if (!location.state) return [];
        const selectedStateId = bdDivisions.find((s) => {
            if (s.title === location.state) return s.value
        });

        if (!selectedStateId) return [];
        return districts[selectedStateId.value] || []
    }, [location.state, bdDivisions, districts])


    const progress = (step / 2) * 100;

    const toggleInterest = (categoryId) => {
        setSelectedInterests((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const handleComplete = async () => {
        try {
            await completeOnboarding({
                location: {
                    city: location.city,
                    state: location.state,
                    country: location.country,
                },
                interests: selectedInterests,
            })

            toast.success("Welcome to Kivent!")
            onComplete();
        } catch (error) {
            toast.error("Failed to complete onboarding");
            console.error(error);
        }
    };

    const handleNext = () => {
        if (step === 1 && selectedInterests.length < 3) {
            toast.error("Please select at least 3 interests");
            return;
        }

        if (step === 2 && (!location.city || !location.state)) {
            toast.error("Please select both division and district");
            return;
        }

        if (step < 2) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    }

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
                <div className="py-4">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => toggleInterest(category.id)}
                                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${selectedInterests.includes(category.id)
                                            ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20"
                                            : "border-border hover:border-orange-300"
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{category.icon}</div>
                                        <div className="text-sm font-medium">{category.label}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        selectedInterests.length >= 3 ? "default" : "secondary"
                                    }
                                >
                                    {selectedInterests.length} selected
                                </Badge>
                                {selectedInterests.length >= 3 && (
                                    <span className="text-sm text-green-500">
                                        ✓ Ready to continue
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state">Division</Label>

                                    <Select
                                        value={location.state}
                                        onValueChange={(value) => {
                                            setLocation({ ...location, state: value, city: "" });
                                        }}
                                    >
                                        <SelectTrigger id="state" className="w-full h-11">
                                            <SelectValue placeholder="Select division" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bdDivisions.map((state) => (
                                                <SelectItem key={state.value} value={state.title}>
                                                    {state.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">District</Label>

                                    <Select
                                        value={location.city}
                                        onValueChange={(value) => {
                                            setLocation({ ...location, city: value });
                                        }}
                                        disabled={!location.state}
                                    >
                                        <SelectTrigger id="city" className="w-full h-11">
                                            <SelectValue placeholder={
                                                location.state ? "Select district" : "Division first"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bdDistricts.length > 0 ? (
                                                bdDistricts.map((district) => {
                                                    return <SelectItem key={district.title} value={district.title}>
                                                        {district.title}
                                                    </SelectItem>
                                                })
                                            ) : (
                                                <SelectItem value="no-districts" disabled>
                                                    No districts available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {location.city && location.state && (
                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Your location</p>
                                            <p className="text-sm text-muted-foreground">
                                                {location.city}, {location.state}, {location.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter className={'flex gap-3'}>
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={() => setStep(step - 1)}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    )}
                    <Button
                        className="flex-1 gap-2"
                        disabled={isLoading}
                        onClick={() => handleNext()}
                    >
                        {isLoading ? "Completing..." : (step === 2 ? "Complete Setup" : "Continue")}

                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
