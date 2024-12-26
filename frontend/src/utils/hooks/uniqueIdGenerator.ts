export default function uniqueIdGenerator(length: number) {
  const chars: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
  let uniqueID: string = "";

  for (let i = 0; i < length; ++i) {
    const randomIndex: number = Math.floor(Math.random() * chars.length);
    const randomChar: string = chars[randomIndex];
    uniqueID += randomChar;
  }

  return uniqueID;
}
