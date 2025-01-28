'use client'

import React from 'react';
import InvestmentPlans, {InvestmentPlan} from './InvestmentPlan';

const App: React.FC = () => {
    // Replace with your actual API call logic
    const fetchPlans = async (page: number, pageSize: number): Promise<InvestmentPlan[]> => {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Dummy data for demonstration
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const allPlans: InvestmentPlan[] = [
            { id: '1', principal: 1000, interestRate: 5, earnings: 50, status: 'active', startDate: new Date(2023, 5, 1), endDate: new Date(2024, 5, 1) },
            { id: '2', principal: 5000, interestRate: 8, earnings: 400, status: 'active', startDate: new Date(2023, 6, 15), endDate: new Date(2024, 6, 15) },
            { id: '3', principal: 2000, interestRate: 6, earnings: 120, status: 'stale', startDate: new Date(2022, 1, 10), endDate: new Date(2023, 1, 10) },
            // Add more dummy plans as needed...
        ];

        return allPlans.slice(startIndex, endIndex);
    };

    const createPlan = async (newPlan: Omit<InvestmentPlan, 'id'>): Promise<InvestmentPlan> => {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const createdPlan: InvestmentPlan = {
            ...newPlan,
            id: Math.random().toString(36).substring(2, 9), // Generate a random ID
        };
        return createdPlan;
    };

    return (
        <div>
            <InvestmentPlans fetchPlans={fetchPlans} createPlan={createPlan} />
        </div>
    );
};

export default App;
