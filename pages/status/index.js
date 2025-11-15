import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <p>Última atualização: {updatedAtText}</p>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    const {
      dependencies: { database },
    } = data;

    databaseStatusInformation = (
      <>
        <div>Versão: {database.version}</div>
        <div>Conexões abertas: {database.odivened_connections}</div>
        <div>Conexões máximas: {database.max_connections}</div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      {databaseStatusInformation}
    </>
  );
}
