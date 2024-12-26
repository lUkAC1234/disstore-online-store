export default function updateLoggerSnapshot(message: string, props: unknown, state: unknown): void {
  console.log("\n");
  console.group(message, new Date());
  console.log({ props, state });
  console.groupEnd();
  console.log("\n");
}
