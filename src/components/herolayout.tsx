import type React from "react";

interface HeroProps{
    children: React.ReactNode;
}

export default function HeroLayout({children}: HeroProps){
    return (
        <div className="hero">
            <div className="stars"></div>
            <div className="twinkling"></div>
            <div className="clouds"></div>
            <div className="hero-content">
                {children}
            </div>
        </div>
    );
}