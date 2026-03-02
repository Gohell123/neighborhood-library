export default function MemberSelector({ members, memberId, setMemberId }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label>Select Member: </label>
      <select
        value={memberId}
        onChange={(e) => setMemberId(Number(e.target.value))}
      >
        {members.map(member => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
}