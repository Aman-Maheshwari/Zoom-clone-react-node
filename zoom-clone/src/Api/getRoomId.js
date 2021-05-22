export const getRoomId = async () => {
  const res = await fetch("http://localhost:3000/join", { method: "GET" });
  const json = await res.json();
  console.log(json);
};
