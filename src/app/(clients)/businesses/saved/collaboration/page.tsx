
import CollaborationList from "@/components/collaboration/CollaborationList";

export default function CollaborationsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Collaborations</h1>
      <CollaborationList />
    </div>
  );
}
