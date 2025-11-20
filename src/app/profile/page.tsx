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
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <form onSubmit={saveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px_40px]">

                    {/* First Name */}
                    <div className="mb-[15px]">
                        <label htmlFor="first-name" className="block mb-[5px] font-bold">First Name:</label>
                        <input
                            id="first-name"
                            value={profile.fn}
                            onChange={(e) => handleChange('fn', e.target.value)}
                            className={`text-base border rounded-[5px] w-[95%] p-[5px] transition-colors duration-200 ${errors.fn ? 'border-red-500 bg-[#ffe6e6]' : 'border-[#ccc] focus:border-[#3f51b5]'}`}
                        />
                        {errors.fn && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.fn}</small>}
                    </div>

                    {/* Last Name */}
                    <div className="mb-[15px]">
                        <label htmlFor="last-name" className="block mb-[5px] font-bold">Last Name:</label>
                        <input
                            id="last-name"
                            value={profile.ln}
                            onChange={(e) => handleChange('ln', e.target.value)}
                            className={`text-base border rounded-[5px] w-[95%] p-[5px] transition-colors duration-200 ${errors.ln ? 'border-red-500 bg-[#ffe6e6]' : 'border-[#ccc] focus:border-[#3f51b5]'}`}
                        />
                        {errors.ln && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.ln}</small>}
                    </div>

                    {/* Email */}
                    <div className="mb-[15px]">
                        <label htmlFor="email" className="block mb-[5px] font-bold">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={profile.e}
                            onChange={(e) => handleChange('e', e.target.value)}
                            className={`text-base border rounded-[5px] w-[95%] p-[5px] transition-colors duration-200 ${errors.e ? 'border-red-500 bg-[#ffe6e6]' : 'border-[#ccc] focus:border-[#3f51b5]'}`}
                        />
                        {errors.e && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.e}</small>}
                    </div>

                    {/* Username */}
                    <div className="mb-[15px]">
                        <label htmlFor="username" className="block mb-[5px] font-bold">Username:</label>
                        <input
                            id="username"
                            value={profile.u}
                            disabled
                            readOnly
                            className="text-base border border-[#ccc] rounded-[5px] w-[95%] p-[5px] bg-gray-100"
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-[15px] md:col-span-2">
                        <label htmlFor="bio" className="block mb-[5px] font-bold">Bio:</label>
                        <textarea
                            id="bio"
                            value={profile.b || ''}
                            onChange={(e) => handleChange('b', e.target.value)}
                            className={`text-base border rounded-[5px] w-[98%] p-[5px] transition-colors duration-200 resize-y ${errors.b ? 'border-red-500 bg-[#ffe6e6]' : 'border-[#ccc] focus:border-[#3f51b5]'}`}
                        />
                        {errors.b && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.b}</small>}
                    </div>

                    {/* Reddit Handle */}
                    <div className="mb-[15px]">
                        <label htmlFor="reddit" className="block mb-[5px] font-bold">Reddit Handle:</label>
                        <div className="flex items-center">
                            <i className="fab fa-reddit text-[#ef2c0a] text-[20px] mr-[10px]"></i>
                            <input
                                id="reddit"
                                value={profile.rh || ''}
                                onChange={(e) => handleChange('rh', e.target.value)}
                                placeholder="u/************************"
                                className={`text-base border rounded-[5px] w-[95%] p-[5px] transition-colors duration-200 ${errors.rh ? 'border-red-500 bg-[#ffe6e6]' : 'border-[#ccc] focus:border-[#3f51b5]'}`}
                            />
                        </div>
                        {errors.rh && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.rh}</small>}
                    </div>

                    {/* Discord Handle */}
                    <div className="mb-[15px]">
                        <label htmlFor="discord" className="block mb-[5px] font-bold">Discord Handle:</label>
                        <div className="flex items-center">
                            <i className="fab fa-discord text-[#5865F2] text-[20px] mr-[10px]"></i>
                            <input
                                id="discord"
                                value={profile.dh || ''}
                                onChange={(e) => handleChange('dh', e.target.value)}
                                placeholder="************************#0000"
                                className={`text-base border rounded-[5px] w-[95%] p-[5px] transition-colors duration-200 ${errors.dh ? 'border-red-500 bg-[#ffe6e6]' : 'border-[#ccc] focus:border-[#3f51b5]'}`}
                            />
                        </div>
                        {errors.dh && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.dh}</small>}
                    </div>

                    {/* X Handle */}
                    <div className="mb-[15px]">
                        <label htmlFor="twitter" className="block mb-[5px] font-bold">X Handle:</label>
                        <div className="flex items-center">
                            <i className="fa-brands fa-x-twitter text-black text-[20px] mr-[10px]"></i>
                            <input
                                id="twitter"
                                value={profile.th || ''}
                                onChange={(e) => handleChange('th', e.target.value)}
                                placeholder="@***************"
                                className={`text-base border rounded-[5px] w-[95%] p-[5px] transition-colors duration-200 ${errors.th ? 'border-red-500 bg-[#ffe6e6]' : 'border-[#ccc] focus:border-[#3f51b5]'}`}
                            />
                        </div>
                        {errors.th && <small className="text-red-500 text-[0.85rem] mt-[4px] block">{errors.th}</small>}
                    </div>

                    {/* Member Since */}
                    <div className="mb-[15px]">
                        <label htmlFor="since" className="block mb-[5px] font-bold">Member Since:</label>
                        <input
                            id="since"
                            type="text"
                            value={memberSinceHumanReadable}
                            disabled
                            className="text-base border border-[#ccc] rounded-[5px] w-[95%] p-[5px] bg-gray-100"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-[20px] bg-[#3f51b5] text-white border-none px-[20px] py-[10px] rounded-[10px] cursor-pointer hover:bg-[#303f9f]"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
