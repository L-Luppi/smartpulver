import { Grid } from "@mui/material";
import Input from "../atoms/Input";
import InputMaskCEP from "../atoms/InputAddress";

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
        <Input
          label="UF"
          value={state.estado}
          disable
          onChange={(v) => onChange("estado", v)}
        />
      </Grid>

      {/* Cidade */}
      <Grid size={{ xs: 12, sm: 3 }}>
        <Input
          label="Cidade"
          value={state.cidade}
          disable
          onChange={(v) => onChange("cidade", v)}
        />
      </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
        <Input
          label="Bairro"
          value={state.bairro}
          disable
          onChange={(v) => onChange("bairro", v)}
        />
      </Grid>

      {/* Logradouro */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Input
          label="Endereço"
          value={state.logradouro}
          disable
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

