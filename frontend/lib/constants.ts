export const siteURL = getSiteURL();
export const siteName = "Mtaani FX";

function getSiteURL(): string {
    if(process.env.NEXT_PUBLIC_VERCEL_URL){
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    } else if(process.env.NEXT_PUBLIC_URL){
        return `https://${process.env.NEXT_PUBLIC_URL}`;
    }
    return "http://localhost:3000";
}
