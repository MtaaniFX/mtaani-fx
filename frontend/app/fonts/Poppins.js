import {Poppins} from 'next/font/google'

export const PoppinsFont = Poppins(
    {
        weight: ['300','400', '500', '700'],
        style: ['normal', 'italic'],
        subsets: ['latin'],
        display: 'swap',
    }
)
