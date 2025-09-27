import { useState, useMemo } from "react";
import {
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,

} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    id: "q1",
    question:
      "O Smart Pulver é compatível com todos os drones de pulverização?",
    answer:
      "Sim. O Smart Pulver é uma plataforma flexível focada na gestão administrativa e operacional. Ele pode ser usado para gerenciar qualquer drone de pulverização — e até aeronaves tripuladas — independentemente da marca ou modelo. Não dependemos da integração direta com sistemas de voo embarcados para oferecer controle administrativo, relatórios e gestão de operações.",
  },
  {
    id: "q2",
    question: "O Smart Pulver também realiza a gestão de aviões agrícolas?",
    answer:
      "Sim. Além de drones, o Smart Pulver pode ser usado para registrar e gerir operações de aviões agrícolas tripulados. A plataforma foi desenhada para ser agnóstica ao tipo de aeronave, oferecendo módulos de planejamento, registro de voo, relatórios e conformidade.",
  },
  {
    id: "q3",
    question: "Posso fazer upgrade do meu plano a qualquer momento?",
    answer:
      "Sim — você pode alterar seu plano a qualquer momento através do painel de cobrança. O upgrade é aplicado imediatamente e a cobrança é proporcional ao período restante do ciclo atual, dependendo da regra do plano. Para dúvidas específicas sobre faturamento, entre em contato com nosso suporte.",
  },
  {
    id: "q4",
    question:
      "O sistema atende às exigências da ANAC, DECEA e MAPA para registro e relatórios de voos?",
    answer:
      "Nossa plataforma foi desenvolvida considerando as principais exigências regulatórias e oferece módulos para registro de voos, logs e relatórios que ajudam na conformidade com ANAC, DECEA e MAPA. Recomendamos validar requisitos específicos do seu caso (por exemplo: relatórios técnicos ou formatos específicos) e, se necessário, podemos customizar exportações.",
  },
  {
    id: "q5",
    question: "Como funciona o suporte técnico?",
    answer:
      "Oferecemos suporte via chat, e-mail e chamados. Os SLAs variam conforme o plano contratado (ex.: plano empresarial com SLA prioritário). O suporte cobre dúvidas de uso, resolução de incidentes e orientações de configuração; para suporte em campo ou integrações profundas podemos oferecer serviços profissionais sob demanda.",
  },
  {
    id: "q6",
    question: "Posso explorar o Smart Pulver antes de contratar?",
    answer:
      "Sim — disponibilizamos demonstração e período de trial em muitos casos. Você pode solicitar uma demonstração guiada com um especialista ou ativar um trial dentro do site para testar as funcionalidades principais antes de contratar.",
  },
  {
    id: "q7",
    question: "Como meus dados são protegidos no Smart Pulver?",
    answer:
      "Levamos segurança a sério: os dados são armazenados em servidores com criptografia em trânsito e em repouso, usamos controle de acesso por função (RBAC), logs de auditoria e backups regulares. Se precisar, podemos fornecer detalhes técnicos e acordos como NDA/DPAs para clientes institucionais.",
  },
  {
    id: "q8",
    question:
      "Consigo acessar o Smart Pulver pelo meu celular ou em áreas com pouca internet?",
    answer:
      "Sim — a interface é responsiva e funciona em dispositivos móveis. Em áreas com conexão intermitente, o sistema foi desenhado para sincronizar dados assim que a conectividade for restabelecida; entretanto, algumas funcionalidades em tempo real (telemetria ao vivo) dependem de boa cobertura de rede.",
  },
  {
    id: "q9",
    question:
      "Como faço para começar a usar o Smart Pulver? O treinamento está incluso?",
    answer:
      "Para começar, crie uma conta, configure sua organização e cadastre suas aeronaves e operadores. Oferecemos materiais de onboarding, vídeos e documentação. Treinamentos presenciais ou personalizados podem estar inclusos em alguns planos ou contratados à parte — verifique o que seu plano cobre.",
  },
];

export default function Faq({ items = DEFAULT_FAQ }: { items?: FaqItem[] }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (i) =>
        i.question.toLowerCase().includes(term) ||
        i.answer.toLowerCase().includes(term)
    );
  }, [search, items]);

  function handleToggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <Container sx={{ py: 8 }}>
      <Box className="flex flex-col gap-4">
        <header className="flex flex-col items-center gap-4 text-center">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              FAQ
            </Typography>
            <Typography variant="body2" color="text.primary">
              Perguntas frequentes sobre compatibilidade, suporte, segurança e
              como começar.
            </Typography>
          </div>
        </header>
        <main>
         
            {filtered.map((item) => (
              <Accordion
                key={item.id}
                expanded={allOpen ? true : expanded === item.id}
                onChange={() => handleToggle(item.id)}
                className="mb-3"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${item.id}-content`}
                  id={`${item.id}-header`}
                >
                  <Typography className="font-medium">
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.answer}</Typography>
                </AccordionDetails>
              </Accordion>

            ))}
        </main>

        <footer className="pt-4">
          <Typography variant="caption" color="text.primary">
            Precisa de ajuda extra? Entre em contato com nosso suporte pelo chat
            ou pelo e-mail de atendimento.
          </Typography>
        </footer>
      </Box>
    </Container>
  );
}
