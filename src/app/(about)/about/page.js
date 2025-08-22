import AboutCoverSection from "@/src/components/About/AboutCoverSection";
import AboutBodyClient from "./AboutBodyClient";

export const metadata = {
  title: "About W3Cay",
  description:
    "W3Cay 是一个收集与分享有趣网站、工具、游戏与 AI 体验的“兴趣小岛”，致力于为你带来灵感与快乐。",
};

export const runtime = 'edge';

export default function About() {
  return (
    <>
      <AboutCoverSection />
      <AboutBodyClient />
    </>
  );
}
