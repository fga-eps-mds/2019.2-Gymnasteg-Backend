import { factory } from 'factory-girl';
import faker from 'faker';

import Banca from '../src/app/models/Banca';
import Modalidade from '../src/app/models/Modalidade';

factory.define('Banca', Banca, {
  num_banca: faker.random.number({
    options: {
      min: 1,
    },
  }),
  qtd_arbitro: faker.random.number({
    options: {
      min: 1,
    },
  }),
  sexo: faker.lorem.word(),
  data_evento: faker.date.future(2),
  horario: '12:00:00',
});

factory.define('Modalidade', Modalidade, {
  tipo: faker.lorem.word(),
});

export default factory;
