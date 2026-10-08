import StateMessage from "@/components/ui/StateMessage";
import Screen from "@/components/ui/Screen";

/** First-time setup; the steps arrive with US2 (T036). Reachable only while setup is incomplete. */
export default function SetupStep() {
  return (
    <Screen title="İlk kurulum" lead="Seni biraz tanıyalım, günlük hedeflerini hesaplayalım.">
      <StateMessage kind="empty" title="Kurulum adımları hazırlanıyor" body="Boy, kilo, hedef ve beslenme tarzı soruları burada olacak." />
    </Screen>
  );
}
