import Screen from "@/components/ui/Screen";
import StateMessage from "@/components/ui/StateMessage";

/** Today: calorie ring, macros and meals by slot (US2–US3, T038 and T049). */
export default function Today() {
  return (
    <Screen title="Bugün" lead="Günlük hedeflerin ve öğünlerin.">
      <StateMessage kind="empty" title="Henüz öğün yok" body="Kalori halkan, makroların ve öğünlerin burada görünecek." />
    </Screen>
  );
}
