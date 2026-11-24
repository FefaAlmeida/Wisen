import Image from "next/image";

export function AdminZuzuPortrait({ className }) {
  return (
    <Image src="/zuzu-admin.png" alt="" width={48} height={48} className={className} unoptimized />
  );
}
