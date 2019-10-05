import { factory } from 'factory-girl';
import faker from 'faker';

import Stand from '../src/app/models/Stand';
import Modality from '../src/app/models/Modality';
import Coordinator from '../src/app/models/Coordinator';

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
  password_hash: faker.internet.password(),
});

export default factory;
