import Screen from "@/components/ui/Screen";
import StateMessage from "@/components/ui/StateMessage";

/** Past days: month calendar with on-target marks (US5, T056). */
export default function History() {
  return (
    <Screen title="Geçmiş" lead="Hangi gün hedefindeydin?">
      <StateMessage kind="empty" title="Takvim hazırlanıyor" body="Öğün kaydettiğin günler burada işaretlenecek." />
    </Screen>
  );
}
