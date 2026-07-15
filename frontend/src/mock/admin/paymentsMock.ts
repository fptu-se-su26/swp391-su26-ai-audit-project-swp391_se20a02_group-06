import { subDays, subMonths, format } from 'date-fns';

const today = new Date();

export const paymentsMock = {
    grossRevenue: 842910.42,
    netRevenue: 750200.00,
    returns: 12450.50,
    pendingPayout: 12450.00,
    monthlyGrowth: 13.4,
    recentTransactions: [
        { id: 'TRX-101', user: 'Erik Kjeldsen', plan: 'Pro', amount: 499.00, date: format(today, 'MMM dd, yyyy'), status: 'Completed' },
        { id: 'TRX-102', user: 'Sarah Miller', plan: 'Elite', amount: 128.00, date: format(subDays(today, 1), 'MMM dd, yyyy'), status: 'Pending' },
        { id: 'TRX-103', user: 'John Doe', plan: 'Basic', amount: 49.00, date: format(subDays(today, 2), 'MMM dd, yyyy'), status: 'Completed' },
        { id: 'TRX-104', user: 'Lisa Montero', plan: 'Custom', amount: 85.50, date: format(subDays(today, 3), 'MMM dd, yyyy'), status: 'Failed' },
        { id: 'TRX-105', user: 'Mike Ross', plan: 'Pro', amount: 499.00, date: format(subDays(today, 5), 'MMM dd, yyyy'), status: 'Completed' },
        { id: 'TRX-106', user: 'Rachel Zane', plan: 'Basic', amount: 49.00, date: format(subDays(today, 7), 'MMM dd, yyyy'), status: 'Refunded' },
        { id: 'TRX-107', user: 'Harvey Specter', plan: 'Elite', amount: 128.00, date: format(subDays(today, 10), 'MMM dd, yyyy'), status: 'Completed' },
        { id: 'TRX-108', user: 'Louis Litt', plan: 'Custom', amount: 150.00, date: format(subMonths(today, 1), 'MMM dd, yyyy'), status: 'Completed' },
        { id: 'TRX-109', user: 'Donna Paulsen', plan: 'Pro', amount: 499.00, date: format(subMonths(today, 1), 'MMM dd, yyyy'), status: 'Pending' },
        { id: 'TRX-110', user: 'Katrina Bennett', plan: 'Basic', amount: 49.00, date: format(subMonths(today, 2), 'MMM dd, yyyy'), status: 'Failed' },
    ]
}