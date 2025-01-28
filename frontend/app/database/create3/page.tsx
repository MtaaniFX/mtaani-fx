'use client'

import InvestmentPlanContainer from "./InvestmentPlanContainer";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function () {
    return (
        <QueryClientProvider client={queryClient}>
            <InvestmentPlanContainer />
        </QueryClientProvider>
    )
}
