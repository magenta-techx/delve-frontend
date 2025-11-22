import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAwareFetch } from "@/utils/authAwareFetch";

// Create Collaboration
export function useCreateCollaboration() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ name, description }: { name: string; description: string }) => {
            const res = await authAwareFetch("/api/collaborations", {
                method: "POST",
                body: JSON.stringify({ name, description }),
                headers: { "Content-Type": "application/json" },
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collaborations"] });
        },
    });
}

// Update Collaboration
export function useUpdateCollaboration() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ collabId, data }: { collabId: number; data: { name?: string; description?: string } }) => {
            const res = await authAwareFetch(`/api/collaborations/${collabId}`, {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            return res.json();
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collaboration", variables.collabId] });
        },
    });
}

// Get Collaboration
export function useCollaboration(collabId: number, options = {}) {
    return useQuery({
        queryKey: ["collaboration", collabId],
        queryFn: async () => {
            const res = await authAwareFetch(`/api/collaborations/${collabId}`);
            return res.json();
        },
        ...options,
        enabled: !!collabId,
    });
}

// Add or Replace Businesses
export function useAddOrReplaceBusinesses() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ collabId, business_ids }: { collabId: number; business_ids: number[] }) => {
            const res = await authAwareFetch(`/api/collaborations/${collabId}/businesses`, {
                method: "PUT",
                body: JSON.stringify({ business_ids }),
                headers: { "Content-Type": "application/json" },
            });
            return res.json();
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collaboration", variables.collabId] });
        },
    });
}

// Remove Business
export function useRemoveBusiness() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ collabId, business_id }: { collabId: number; business_id: number }) => {
            const res = await authAwareFetch(`/api/collaborations/${collabId}/businesses/remove`, {
                method: "POST",
                body: JSON.stringify({ business_id }),
                headers: { "Content-Type": "application/json" },
            });
            return res.json();
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collaboration", variables.collabId] });
        },
    });
}
