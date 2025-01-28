'use client'

import InvestmentPlans, {InvestmentPlan} from "./Plans";
import {useState} from "react";

export default function () {
    const plans: InvestmentPlan[] = [
        {id: "1", principal: 300, interest: 30, earnings: 300, status: "active", createdAt: ""},
        {id: "2", principal: 300, interest: 30, earnings: 300, status: "active", createdAt: ""},
        {id: "3", principal: 300, interest: 30, earnings: 300, status: "active", createdAt: ""},
    ];
    const [isLoading, setIsLoading] = useState(true);

    return (
        <InvestmentPlans
            plans={plans}
            isLoading={isLoading}
            onCreatePlan={() => {
                // TODO: Open your create plan form/modal here
                console.log("Open your create plan form/modal here")
            }}
        />
    );
}
