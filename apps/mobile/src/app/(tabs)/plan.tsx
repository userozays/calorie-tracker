import Screen from "@/components/ui/Screen";
import StateMessage from "@/components/ui/StateMessage";

/** The active plan and the plan wizard entry (US4, T054). */
export default function Plan() {
  return (
    <Screen title="Planım" lead="Kalori ve makro hedeflerin.">
      <StateMessage kind="empty" title="Plan özeti hazırlanıyor" body="Aktif planın ve plan sihirbazı burada olacak." />
    </Screen>
  );
}
