import { Grid } from "@mui/material";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import InputMaskCEP from "../atoms/InputAddress";

export const estadosBrasil = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];


export default function AreasAddressInputs({ state, onChange }: any) {
  const handleCepBlur = async () => {
    const cleanCep = state.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      onChange("logradouro", data.logradouro);
      onChange("bairro", data.bairro);
      onChange("cidade", data.localidade);
      onChange("estado", data.uf);
    }
  };

  return (
    <>
      {/* CEP */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <InputMaskCEP
          label="CEP"
          value={state.cep}
          onChange={(v: string) => onChange("cep", v)}
          onBlur={handleCepBlur}
        />
      </Grid>

      {/* Estado */}
      <Grid size={{ xs: 12, sm: 2 }}>
        <Select
          label="UF"
          value={state.estado}
          onChange={(v) => onChange("estado", v)}
          options={estadosBrasil}
        />
      </Grid>

      {/* Cidade */}
      <Grid size={{ xs: 12, sm: 3 }}>
        <Input
          label="Cidade"
          value={state.cidade}
          onChange={(v) => onChange("cidade", v)}
        />
      </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
        <Input
          label="Bairro"
          value={state.bairro}
          onChange={(v) => onChange("bairro", v)}
        />
      </Grid>

      {/* Logradouro */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input
          label="Endereço"
          value={state.logradouro}
          onChange={(v) => onChange("logradouro", v)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 2 }}>
        <Input
          label="Número"
          value={state.numero}
          onChange={(v) => onChange("numero", v)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Input
          label="Complemento"
          value={state.complemento}
          onChange={(v) => onChange("complemento", v)}
        />
      </Grid>
    </>
  );
}

