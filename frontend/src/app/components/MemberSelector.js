"use client";

export default function MemberSelector({
  members,
  memberId,
  setMemberId,
  loading = false,
}) {
  const hasMembers = members && members.length > 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      <label htmlFor="member-select">Select Member: </label>

      <select
        id="member-select"
        value={memberId}
        disabled={loading || !hasMembers}
        onChange={(e) => setMemberId(Number(e.target.value))}
      >
        {!hasMembers ? (
          <option value="">No members available</option>
        ) : (
          members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}