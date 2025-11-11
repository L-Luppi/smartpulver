export const maskCNPJ = (value: string) => {
  // Remove qualquer coisa que não seja número
  let digits = value.replace(/\D/g, "");

  // Limita a 14 dígitos
  digits = digits.substring(0, 14);

  // Aplica a máscara: 00.000.000/0000-00
  digits = digits.replace(/^(\d{2})(\d)/, "$1.$2");
  digits = digits.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  digits = digits.replace(/\.(\d{3})(\d)/, ".$1/$2");
  digits = digits.replace(/(\d{4})(\d)/, "$1-$2");

  return digits;
};
