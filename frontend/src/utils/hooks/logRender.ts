import debug from "constants/debug";

interface ClassItself {
  name: string;
}

export default function logComponentRender(classItself: ClassItself): void {
  if (debug) {
    console.log(`Rendered ${classItself.name} component`);
  }
}
