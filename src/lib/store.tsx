"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Doctor, Department } from "@/types";

interface HospitalContextType {
    doctors: Doctor[];
    departments: Department[];
    isLoading: boolean;
    refresh: () => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

// API fetch 函數
async function fetchDepartments(): Promise<Department[]> {
    const res = await fetch("/api/public/departments");
    if (!res.ok) throw new Error("Failed to fetch departments");
    const data = await res.json();
    return data.departments ?? [];
}

async function fetchDoctors(): Promise<Doctor[]> {
    const res = await fetch("/api/public/doctors");
    if (!res.ok) throw new Error("Failed to fetch doctors");
    const data = await res.json();
    return (data.doctors ?? []).map((d: any) => ({
        id: String(d.id),
        name: String(d.name ?? ""),
        department: String(d.department ?? d.departmentId ?? ""),
        title: String(d.title ?? ""),
        specialties: Array.isArray(d.specialties) ? d.specialties : [],
        imageUrl: String(d.imageUrl ?? ""),
        introduction: String(d.introduction ?? ""),
        isAvailable: typeof d.isAvailable === "boolean" ? d.isAvailable : undefined,
    })) as Doctor[];
}

export function HospitalProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const { data: departments = [], isLoading: deptLoading } = useQuery({
        queryKey: ["departments"],
        queryFn: fetchDepartments,
        staleTime: 1000 * 60 * 60, // 1 小時
    });

    const { data: doctors = [], isLoading: docLoading } = useQuery({
        queryKey: ["doctors"],
        queryFn: fetchDoctors,
        staleTime: 1000 * 60 * 60, // 1 小時
    });

    const refresh = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ["departments"] });
        await queryClient.invalidateQueries({ queryKey: ["doctors"] });
    }, [queryClient]);

    const isLoading = deptLoading || docLoading;

    return (
        <HospitalContext.Provider
            value={{
                doctors,
                departments,
                isLoading,
                refresh,
            }}
        >
            {children}
        </HospitalContext.Provider>
    );
}

export function useHospital() {
    const context = useContext(HospitalContext);
    if (context === undefined) {
        throw new Error("useHospital must be used within a HospitalProvider");
    }
    return context;
}
