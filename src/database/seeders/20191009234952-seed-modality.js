module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'modalities',
      [
        {
          id: 1,
          type: 'Cavalo com alça',
          url_image:
            'http://www.olimpiadatododia.com.br/wp-content/uploads/2018/10/Diogo-Soares-cavalo-com-al%C3%A7as-Jogos-Ol%C3%ADmpicos-da-Juventude.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          id: 2,
          type: 'Argolas',
          url_image:
            'http://midia.gruposinos.com.br/_midias/jpg/2016/08/05/09esp46_0608-1632130.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          id: 3,
          type: 'Salto sobre cavalo',
          url_image:
            'https://infograficos.estadao.com.br/uploads/galerias/3863/39539.JPG',
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          id: 4,
          type: 'Barras paralelas',
          url_image:
            'https://ogimg.infoglobo.com.br/in/19933124-c58-275/FT1500A/690/x201608161434479708_RTS.jpg.pagespeed.ic.G9AhW3HJat.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          id: 5,
          type: 'Barra fixa',
          url_image:
            'http://2.bp.blogspot.com/-ra84jhr85yw/Tk8VI_wlWsI/AAAAAAAABNk/JcBTG4M3x9A/s400/dane.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          id: 6,
          type: 'Trave de equilíbrio',
          url_image:
            'https://sportsregras.com/wp-content/uploads/2016/06/ginastica-trave-equilibrio-e1465838239516.webp',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('modalities', null, {});
  },
};
