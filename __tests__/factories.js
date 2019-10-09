import { factory } from 'factory-girl';
import faker from 'faker';

import Stand from '../src/app/models/Stand';
import Modality from '../src/app/models/Modality';
import Coordinator from '../src/app/models/Coordinator';
import Judge from '../src/app/models/Judge';

factory.define('Stand', Stand, {
  num_stand: faker.random.number({
    options: {
      min: 1,
    },
  }),
  qtd_judge: faker.random.number({
    options: {
      min: 1,
    },
  }),
  sex_modality: faker.lorem.word(),
  category_age: faker.lorem.word(),
  date_event: faker.date.future(2),
  horary: '12:00:00',
  judges: [],
  athletes: [],
});

factory.define('Modality', Modality, {
  type: faker.lorem.word(),
  url_image: faker.image.imageUrl(),
});

factory.define('Coordinator', Coordinator, {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
});

factory.define('Judge', Judge, {
  email: () => faker.internet.email(),
  name: () => faker.name.findName(),
  judge_type: () =>
    faker.random.arrayElement([
      'Execution',
      'Difficulty',
      'Execution and Difficulty',
    ]),
});

factory.define('JudgeWithPassword', Judge, {
  email: () => faker.internet.email(),
  name: () => faker.name.findName(),
  judge_type: () =>
    faker.random.arrayElement([
      'Execution',
      'Difficulty',
      'Execution and Difficulty',
    ]),
  password: () => faker.internet.password(),
});

export default factory;
