export async function getUserCredentials() {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}

export async function search({ query }: { query: string }) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=album%2Cplaylist%2Ctrack%2Cartist&limit=20&offset=0`,
    {
      headers: {
        Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}

export const userService = {
  userCredentials: { key: "user-credentials", fn: getUserCredentials },
  search: { key: "search-", fn: search },
};
