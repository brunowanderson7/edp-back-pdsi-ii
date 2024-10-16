import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
const app = fastify();

app.register(cors, {
  origin: true,
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "Garagaragaragaragaragaranhão...",
});

app.listen(
  {
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  },
  (err, address) => {
    if (err) {
      console.error(`Error starting the server: ${err}`);
      process.exit(1);
    }

    console.log(
      `HTTP server running on http://localhost:${address.split(":")[2]}`
    );
  }
);
