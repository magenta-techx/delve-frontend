
import { useRouter } from "next/navigation";
import CollaborationForm from "@/components/collaboration/CollaborationForm";

export default function NewCollaborationPage() {
	const router = useRouter();
	return (
		<div className="max-w-2xl mx-auto py-8">
			<h1 className="text-2xl font-bold mb-4">Create a New Collaboration</h1>
			<CollaborationForm
				onCreated={data => {
					router.push(`/businesses/saved/collaboration/${data.id}`);
				}}
			/>
		</div>
	);
}
