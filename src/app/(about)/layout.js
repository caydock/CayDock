import InsightRoll from "@/src/components/About/InsightRoll";


const insights = [
  "保持好奇，热爱分享，探索有趣的网络世界",
];

export default function AboutLayout({ children }) {
  return (
    <main className="w-full flex flex-col items-center justify-between">
      {children}
    </main>
  );
}
