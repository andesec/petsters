'use client';

import { useState, useEffect, useMemo } from 'react';
import ApiService from '@/services/ApiService';
import UXService from '@/services/UXService';

interface ProfileData {
    fn: string;
    ln: string;
    e: string;
    u: string;
    b: string;
    rh: string | null;
    dh: string | null;
    th: string | null;
    ms: number;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData>({
        fn: "",
        ln: "",
        e: "",
        u: "",
        b: "",
        rh: null,
        dh: null,
        th: null,
        ms: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await ApiService.makeRequest('/profile', 'GET');
                setProfile(response);
            } catch (error) {
                UXService.error("an error occurred while fetching profile", error);
            }
        }
        fetchProfile();
    }, []);

    const memberSinceHumanReadable = useMemo(() => {
        if (!profile.ms || profile.ms <= 0) return "N/A";

        const memberSince = new Date(profile.ms * 1000);
        const now = new Date();

        let years = now.getFullYear() - memberSince.getFullYear();
        let months = now.getMonth() - memberSince.getMonth();
        let days = now.getDate() - memberSince.getDate();

        if (days < 0) {
            months -= 1;
            const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += daysInPrevMonth;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        if (years === 0 && months === 0 && days === 0) {
            return "0 days";
        }

        let combinedString = "";
        if (years > 0) combinedString += `${years} years, `;
        if (months > 0) combinedString += `${months} months, `;
        combinedString += `${days} days`;

        return combinedString.trim().replace(/,$/, "");
    }, [profile.ms]);

    const validateProfile = () => {
        const newErrors: Record<string, string> = {};

        if (!profile.fn?.trim()) newErrors.fn = "First Name is required.";
        if (!profile.ln?.trim()) newErrors.ln = "Last Name is required.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!profile.e?.trim()) {
            newErrors.e = "Email is required.";
        } else if (!emailRegex.test(profile.e)) {
            newErrors.e = "Invalid email format.";
        }

        if (profile.rh && !/^u\/[a-zA-Z0-9_-]+$/.test(profile.rh)) {
            newErrors.rh = "Reddit handle must start with 'u/' and contain valid characters.";
        }

        if (profile.dh && !/^[a-zA-Z0-9_-]{2,32}#[0-9]{4}$/.test(profile.dh)) {
            newErrors.dh = "Discord handle must be in the format 'username#1234'.";
        }

        if (profile.th && !/^@[a-zA-Z0-9_-]+$/.test(profile.th)) {
            newErrors.th = "X (Twitter) handle must start with '@' and contain valid characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateProfile()) {
            alert("Please fix the validation errors before saving.");
            return;
        }

        const processedProfile = { ...profile };
        (Object.keys(processedProfile) as Array<keyof ProfileData>).forEach((key) => {
            if (processedProfile[key] === "" || processedProfile[key] === undefined) {
                (processedProfile as any)[key] = null;
            }
        });

        try {
            await ApiService.makeRequest("/profile", "POST", processedProfile);
            UXService.notify("Profile saved successfully!");
        } catch (error) {
            UXService.error("an error occurred while saving profile", error);
        }
    };

    const handleChange = (field: keyof ProfileData, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">Profile</h2>
            <form onSubmit={saveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-[30px_40px]">

                    {/* First Name */}
                    <div className="mb-2 md:mb-[15px]">
                        <label htmlFor="first-name" className="block mb-1 md:mb-[5px] text-sm md:text-base font-bold text-foreground">First Name:</label>
                        <input
                            id="first-name"
                            value={profile.fn}
                            onChange={(e) => handleChange('fn', e.target.value)}
                            className={`text-sm md:text-base border rounded-lg w-[95%] p-2 md:p-2.5 transition-colors duration-200 bg-background text-foreground ${errors.fn ? 'border-destructive bg-destructive/10' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                        />
                        {errors.fn && <small className="text-red-500 text-xs md:text-[0.85rem] mt-1 md:mt-[4px] block">{errors.fn}</small>}
                    </div>

                    {/* Last Name */}
                    <div className="mb-2 md:mb-[15px]">
                        <label htmlFor="last-name" className="block mb-1 md:mb-[5px] text-sm md:text-base font-bold text-foreground">Last Name:</label>
                        <input
                            id="last-name"
                            value={profile.ln}
                            onChange={(e) => handleChange('ln', e.target.value)}
                            className={`text-sm md:text-base border rounded-lg w-[95%] p-2 md:p-2.5 transition-colors duration-200 bg-background text-foreground ${errors.ln ? 'border-destructive bg-destructive/10' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                        />
                        {errors.ln && <small className="text-red-500 text-xs md:text-[0.85rem] mt-1 md:mt-[4px] block">{errors.ln}</small>}
                    </div>

                    {/* Email */}
                    <div className="mb-2 md:mb-[15px]">
                        <label htmlFor="email" className="block mb-1 md:mb-[5px] text-sm md:text-base font-bold text-foreground">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={profile.e}
                            onChange={(e) => handleChange('e', e.target.value)}
                            className={`text-sm md:text-base border rounded-lg w-[95%] p-2 md:p-2.5 transition-colors duration-200 bg-background text-foreground ${errors.e ? 'border-destructive bg-destructive/10' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                        />
                        {errors.e && <small className="text-red-500 text-xs md:text-[0.85rem] mt-1 md:mt-[4px] block">{errors.e}</small>}
                    </div>

                    {/* Username */}
                    <div className="mb-[15px]">
                        <label htmlFor="username" className="block mb-[5px] font-bold text-foreground">Username:</label>
                        <input
                            id="username"
                            value={profile.u}
                            disabled
                            readOnly
                            className="text-base border border-input rounded-lg w-[95%] p-2.5 bg-muted text-muted-foreground cursor-not-allowed"
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-[15px] md:col-span-2">
                        <label htmlFor="bio" className="block mb-[5px] font-bold text-foreground">Bio:</label>
                        <textarea
                            id="bio"
                            value={profile.b || ''}
                            onChange={(e) => handleChange('b', e.target.value)}
                            className={`text-base border rounded-lg w-[98%] p-2.5 transition-colors duration-200 resize-y bg-background text-foreground ${errors.b ? 'border-destructive bg-destructive/10' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                        />
                        {errors.b && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.b}</small>}
                    </div>

                    {/* Reddit Handle */}
                    <div className="mb-[15px]">
                        <label htmlFor="reddit" className="block mb-[5px] font-bold text-foreground">Reddit Handle:</label>
                        <div className="flex items-center">
                            <i className="fab fa-reddit text-[#ef2c0a] text-[20px] mr-[10px]"></i>
                            <input
                                id="reddit"
                                value={profile.rh || ''}
                                onChange={(e) => handleChange('rh', e.target.value)}
                                placeholder="u/************************"
                                className={`text-base border rounded-lg w-[95%] p-2.5 transition-colors duration-200 bg-background text-foreground ${errors.rh ? 'border-destructive bg-destructive/10' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                            />
                        </div>
                        {errors.rh && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.rh}</small>}
                    </div>

                    {/* Discord Handle */}
                    <div className="mb-[15px]">
                        <label htmlFor="discord" className="block mb-[5px] font-bold text-foreground">Discord Handle:</label>
                        <div className="flex items-center">
                            <i className="fab fa-discord text-[#5865F2] text-[20px] mr-[10px]"></i>
                            <input
                                id="discord"
                                value={profile.dh || ''}
                                onChange={(e) => handleChange('dh', e.target.value)}
                                placeholder="************************#0000"
                                className={`text-base border rounded-lg w-[95%] p-2.5 transition-colors duration-200 bg-background text-foreground ${errors.dh ? 'border-destructive bg-destructive/10' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                            />
                        </div>
                        {errors.dh && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.dh}</small>}
                    </div>

                    {/* X Handle */}
                    <div className="mb-[15px]">
                        <label htmlFor="twitter" className="block mb-[5px] font-bold text-foreground">X Handle:</label>
                        <div className="flex items-center">
                            <i className="fa-brands fa-x-twitter text-foreground text-[20px] mr-[10px]"></i>
                            <input
                                id="twitter"
                                value={profile.th || ''}
                                onChange={(e) => handleChange('th', e.target.value)}
                                placeholder="@***************"
                                className={`text-base border rounded-lg w-[95%] p-2.5 transition-colors duration-200 bg-background text-foreground ${errors.th ? 'border-destructive bg-destructive/10' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                            />
                        </div>
                        {errors.th && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.th}</small>}
                    </div>

                    {/* Member Since */}
                    <div className="mb-[15px]">
                        <label htmlFor="since" className="block mb-[5px] font-bold text-foreground">Member Since:</label>
                        <input
                            id="since"
                            type="text"
                            value={memberSinceHumanReadable}
                            disabled
                            className="text-base border border-input rounded-lg w-[95%] p-2.5 bg-muted text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-3 md:mt-[20px] bg-primary text-primary-foreground border-none px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-lg cursor-pointer hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                    Save Profile
                </button>
            </form>
        </div>
    );
}
