// Importa o Express para ser utilizado
const express = require('express');
// Importa o router para administrar melhor as rotas
const router = express.Router();
// Importa o fs para trabalhar a leitura de arquivos
const fs = require('fs').promises;
const { readFileContent } = require('../helper/fs');

// Importa as middlewares de validação para as rotas
const { validateToken } = require('../middlewares/authorization');
const { validateName, validateAge } = require('../middlewares/validateParams');
const { validateTalk, validateSubTalk } = require('../middlewares/validateParams2');

router.get( // Rota de busca
  '/search',
  validateToken,
  async (req, res) => {
    const { q } = req.query; // Descontrói a query digitada q
    const people = await readFileContent();

    if (!q) return res.status(200).json(people);

    // Faz um filtro buscando as pessoas que tem esse "q" incluso
    const search = people.filter((value) => value.name.includes(q));
    return res.status(200).json(search);
  },
);

router.get('/', async (_req, res) => {
  const people = await readFileContent();

  return res.status(200).json(people);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params; // Desconstrói o id do params

  const people = await readFileContent();
  const filter = people.find((value) => value.id === Number(id));

  if (!filter) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(filter);
});

router.post(
  '/', // Rota raíz
  validateToken, // Primeiro middleware
  validateName, // Segundo middleware
  validateAge, // Terceiro middleware
  validateTalk, // Quarto middleware
  validateSubTalk, // Quinto middleware
  async (req, res) => { // Sexto middleware
    const { name, age, talk } = req.body; // Desconstrói o name, age e talk do body

    const people = await readFileContent();
    const id = people[people.length - 1].id + 1;
    people.push({ id, name, age, talk });

    await fs.writeFile('./talker.json', JSON.stringify(people, null, 2));
    return res.status(201).json({ id, name, age, talk });
  },
);

router.put(
  '/:id', // Rota lendo o id
  validateToken, // Primeiro middleware
  validateName, // Segundo middleware
  validateAge, // Terceiro middleware
  validateTalk, // Quarto middleware
  validateSubTalk, // Quinto middleware
  async (req, res) => { // Sexto middleware
    const { name, age, talk } = req.body; // Desconstrói o name, age e talk do body
    const { id } = req.params;

    const people = await readFileContent();
    const indexPeople = people.findIndex((p) => p.id === Number(id));

    if (!indexPeople) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    people[indexPeople] = { ...people[indexPeople], name, age, talk };

    await fs.writeFile('./talker.json', JSON.stringify(people, null, 2));
    return res.status(200).json({ id: Number(id), name, age, talk });
  },
);

router.delete(
  '/:id',
  validateToken,
  async (req, res) => {
    const { id } = req.params; // Desconstrói o id do params

    const people = await readFileContent();
    const indexPeople = people.findIndex((p) => p.id === Number(id));
    if (!indexPeople) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    const newFileContent = people.filter((value) => value.id !== Number(id));

    await fs.writeFile('./talker.json', JSON.stringify(newFileContent, null, 2));
    return res.status(204).json({ message: 'Pessoa palestrante deletada com sucesso' });
  },
);

module.exports = router;