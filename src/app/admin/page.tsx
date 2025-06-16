export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h2>
      <p className="text-foreground/80">
        Welcome to the admin panel. Select a section from the sidebar to manage
        content.
      </p>
      <div className="mt-8 p-4 border border-green-500/50 rounded-md bg-green-500/10">
        <h3 className="text-lg font-semibold text-green-700">
          Autenticação Ativada
        </h3>
        <p className="text-green-700/80">
          O painel está protegido por autenticação via JWT. Você está logado
          como administrador.
        </p>
      </div>
    </div>
  );
}
