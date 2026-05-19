"use client"

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const EventDashboard = () => {
    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId;

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showQRScanner, setShowQRScanner] = useState(false);

    const { data: dashboardData, isLoading } = useConvexQuery(
        api.dashboard.getEventDashboard,
        { eventId }
    );

    return (
        <div>EventDashboard</div>
    )
}

export default EventDashboard