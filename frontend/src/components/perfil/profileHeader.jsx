export function ProfileHeader() {
  return (
    <div>
      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Configurações
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-[#2B333F] mt-1">
        Meu <span className="text-[#E8E191]">perfil</span>
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Gerencie suas informações, preferências e configurações da conta.
      </p>
    </div>
  );
}
