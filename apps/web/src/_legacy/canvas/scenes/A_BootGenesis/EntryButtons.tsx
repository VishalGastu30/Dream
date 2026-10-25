import { useView } from "@/contexts/ViewContext";
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useSceneStore } from "../../store/scene.store";

export function EntryButtons() {
  const { dotProgress } = useSceneStore();
  const { setView } = useView();
  const router = useRouter();

  // If we've scrolled past the intro, hide the buttons
  if (dotProgress > 0.2) return null;

  return (
    <Html
      position={[0, -3, 0]}
      center
      transform
      wrapperClass="transition-opacity duration-1000"
      style={{ opacity: dotProgress < 0.1 ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-6 pointer-events-auto">
        <p className="text-text-2 font-mono text-sm tracking-widest text-center">
          SYSTEM ONLINE. AWAITING INPUT.
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-signal text-signal hover:bg-signal/10 transition-colors uppercase tracking-widest text-xs"
            onClick={() => {
              // User decides to scroll manually, or we can jump them to next section
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }}
          >
            Enter Cinematic
          </button>
          <button
            type="button"
            className="px-6 py-2 border border-border text-text-1 hover:text-text-0 hover:border-text-2 transition-colors uppercase tracking-widest text-xs"
            onClick={() => {
              setView("professional");
              router.push("/");
            }}
          >
            Skip to Professional
          </button>
        </div>
      </div>
    </Html>
  );
}
