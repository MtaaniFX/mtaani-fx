export const paths = {
    home: '/',
    auth: {
        signIn: '/sign-in',
        signUp: '/sign-up',
        resetPassword: '/reset-password',
        updatePassword: '/u/0/update-password'
    },
    dashboard: {
        overview: '/dashboard',
        account: '/dashboard/account',
        customers: '/dashboard/customers',
        integrations: '/dashboard/integrations',
        settings: '/dashboard/settings',
    },
} as const;
