export default async function fileEncoder(file: File | null): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(''); // 👈 prevent hang
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file); // converts to Base64 (data:image/...;base64,xxxx)
      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = (error): void => reject(error);
    }
  });
}
