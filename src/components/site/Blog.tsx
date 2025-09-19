import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

// Tipagem de cada post
interface Post {
  id: string;
  title: string;
  summary: string;
  image: string;
  url: string;
}

const POSTS: Post[] = [
  {
    id: "p1",
    title: "Relatório Anual DJI Agriculture: drones agrícolas em alta",
    summary:
      "Mais de 400 mil drones agrícolas estão em operação no mundo, trazendo economia de água e redução de carbono.",
    image:
      "https://www-cdn.djiits.com/cms/uploads/0e464f18843c6bd3f91d942c395d21d0.jpg",
    url: "https://www.dji.com/br/mobile/newsroom/news/dji-agricultural-annual-report-2025",
  },
  {
    id: "p2",
    title: "Brasil lidera regulamentação de drones agrícolas",
    summary:
      "ANAC e MAPA reforçam a segurança jurídica, tornando o Brasil referência em agricultura de precisão.",
    image:
      "https://portal.agrosummit.com.br/public/images/2025/02/05/drones-agricolas-avancam-no-mercado-e-devem-movimentar-r-23-bilhoes-ate-2029-2jpg.jpeg",
    url: "https://folhaagricola.com.br/2025/05/05/brasil-lidera-regulamentacao-de-drones-agricolas",
  },
  {
    id: "p3",
    title: "Mercado de drones agrícolas deve movimentar R$ 23 bi até 2029",
    summary:
      "Tecnologias integradas e pulverização de precisão aceleram a adoção de drones no agronegócio. Este texto é propositalmente maior para mostrar como o corte com reticências funciona e mantém todos os cards alinhados.",
    image:
      "https://folhaagricola.com.br/wp-content/uploads/2025/05/PHOTO-2025-04-30-10-36-09-1024x576.jpg",
    url: "https://portal.agrosummit.com.br/public/drones-agricolas-avancam-no-mercado-e-devem-movimentar-r-23-bi-ate-2029",
  },
];

export default function BlogSection({ posts = POSTS }: { posts?: Post[] }) {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Últimos Posts
      </Typography>
      <Typography variant="body2" color="text.primary" paragraph>
        Tendências, regulamentações e inovações que estão transformando o uso de drones na agricultura.
      </Typography>

      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post.summary}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ler mais
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
