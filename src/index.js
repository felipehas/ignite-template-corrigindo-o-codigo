const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {
  // Complete aqui
  const { id } = request.params;

  if (!repositories) {
    return response
      .status(204)
      .json({ error: "Empty repositories not found!" });
  }

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found!" });
  }

  request.repository = repository; // todos conseguem utilizar o user a partir dessa atribuição
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsRepository, (request, response) => {
  const { repository } = request;
  const updatedRepository = request.body;

  repository.title = updatedRepository.title;
  repository.url = updatedRepository.url;
  repository.techs = updatedRepository.techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {
  const { repository } = request;
  console.log("start", repositories);

  repositories.splice(repository, 1);
  return response.status(204).send(repositories);
});

app.post(
  "/repositories/:id/like",
  checksExistsRepository,
  (request, response) => {
    const { repository } = request;
    repository.likes += 1;
    const likes = repository.likes;
    return response.json({ likes: likes });
  }
);

module.exports = app;
