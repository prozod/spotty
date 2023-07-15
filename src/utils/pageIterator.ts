export async function* pageIterator<T>(endpoint: string, accessToken: string) {
  async function* requestData(_endpoint: string): AsyncGenerator<T> {
    const response = await fetch(_endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    yield data;

    if (data.next) {
      yield* requestData(data.next);
    }
  }

  yield* requestData(endpoint);
}
