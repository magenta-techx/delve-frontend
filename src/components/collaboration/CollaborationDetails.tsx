import { useEffect, useState } from "react";

export default function CollaborationDetails({ collabId }: { collabId: number }) {
 
  return (
    <div className="space-y-4">
        PEPPER
      {/* <div>
        {editMode ? (
          <>
            <input className="border rounded px-2 py-1" value={name} onChange={e => setName(e.target.value)} />
            <textarea className="border rounded px-2 py-1 w-full mt-2" value={description} onChange={e => setDescription(e.target.value)} />
            <button className="bg-green-600 text-white px-3 py-1 rounded mt-2" onClick={handleUpdate}>Save</button>
            <button className="ml-2 px-3 py-1" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{collab.name}</div>
            <div className="text-gray-600 mb-2">{collab.description}</div>
            <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setEditMode(true)}>Edit</button>
          </>
        )}
      </div>
      <div>
        <div className="font-semibold mb-1">Members</div>
        <ul>
          {collab.members.map((m: any, i: number) => (
            <li key={i} className="flex items-center gap-2 mb-1">
              <span>{m.member ? `${m.member.first_name} ${m.member.last_name}` : m.unregistered_user_email}</span>
              <span className="text-xs bg-gray-200 rounded px-2 py-0.5">{m.priviledge}</span>
              <span className="text-xs text-gray-400">{m.status}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-1">Businesses</div>
        <ul>
          {collab.businesses.map((b: any) => (
            <li key={b.id} className="flex items-center gap-2 mb-1">
              <span>{b.name}</span>
              <span className="text-xs text-gray-400">{b.address}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
