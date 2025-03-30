export function extractDigits(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    return digits.startsWith("998") ? digits.slice(3) : digits;
}
export function formatPhoneDigits(digits: string): string {
    if (!digits) return "";
    const cleanDigits = digits.slice(0, 9);
    const parts = ["+998 "];
    const operatorCode = cleanDigits.slice(0, 2);
    const part2 = cleanDigits.slice(2, 5);
    const part3 = cleanDigits.slice(5, 7);
    const part4 = cleanDigits.slice(7, 9);
    if (cleanDigits.length >= 2) { parts.push(`(${operatorCode}) `); } 
    else { parts.push(operatorCode); }
    if (part2) { parts.push(part2); if (part3 || part4) parts.push(" "); }
    if (part3) { parts.push(part3); if (part4) parts.push(" "); }
    if (part4) { parts.push(part4); }
    return parts.join("");
}
