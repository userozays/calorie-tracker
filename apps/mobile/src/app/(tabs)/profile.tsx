import Screen from "@/components/ui/Screen";
import StateMessage from "@/components/ui/StateMessage";

/** Account and sign-out (US1, T030). */
export default function Profile() {
  return (
    <Screen title="Profil" lead="Hesabın ve ayarların.">
      <StateMessage kind="empty" title="Hesap ayarları hazırlanıyor" body="Giriş yöntemlerin ve çıkış burada olacak." />
    </Screen>
  );
}
