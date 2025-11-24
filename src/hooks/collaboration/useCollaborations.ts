import { useQuery } from "@tanstack/react-query";
import { authAwareFetch } from "@/utils/authAwareFetch";

async function fetchCollaborations() {
    const res = await authAwareFetch("/api/collaborations");
    const data = await res.json();
    return data.data || [];
}

export function useCollaborations() {
    return useQuery({
        queryKey: ["collaborations"],
        queryFn: fetchCollaborations,
    });

}
