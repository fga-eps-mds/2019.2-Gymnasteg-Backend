import sio from 'socket.io';
import jwt from 'jsonwebtoken';

import app from './app';
import auth from './config/auth';

import Judge from './app/models/Judge';
import Stand from './app/models/Stand';
import Athlete from './app/models/Athlete';

const server = require('http').createServer(app);

const io = sio.listen(server);

server.listen(3333);

const connectedJudges = {};
const votings = {};

io.on('connection', async socket => {
  const { token } = socket.handshake.query;
  try {
    const decoded = jwt.verify(token, auth.secret);
    if (decoded.coord) {
      return;
    }

    const judge = await Judge.findByPk(decoded.id, {
      include: [
        {
          order: ['date_event', 'DESC'],
          model: Stand,
          as: 'stands',
          attributes: [
            'id',
            'num_stand',
            'qtd_judge',
            'sex_modality',
            'category_age',
            'date_event',
            'horary',
          ],
          include: [
            {
              model: Athlete,
              as: 'athletes',
              attributes: ['name', 'gender', 'date_born'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
    if (judge) {
      connectedJudges[decoded.id] = socket.id;
      judge.stands.forEach(stand => {
        socket.join(`${stand.id}`);
      });

      socket.on('disconnect', () => {
        connectedJudges[decoded.id] = undefined;
      });

      socket.on('voteStart', voteSocket => {
        // Judge not registered on the stand
        if (
          !judge.stands.find(stand => stand.dataValues.id === voteSocket.stand)
        ) {
          return;
        }

        // Voting already happening
        if (typeof votings[voteSocket.stand] !== 'undefined') {
          return;
        }

        votings[voteSocket.stand] = {
          id: voteSocket.athlete,
          judgeVotes: {},
        };

        let secondsRemaining = 60;
        function emitSecondsRemaining() {
          io.to(voteSocket.stand).emit('voteTimer', {
            ...voteSocket,
            timeRemaining: secondsRemaining,
          });
        }
        emitSecondsRemaining();

        const votingCountdown = setInterval(() => {
          secondsRemaining -= 1;
          emitSecondsRemaining();

          if (secondsRemaining <= 0) {
            votings[voteSocket.stand] = undefined;
            io.to(voteSocket.stand).emit('voteCancel', voteSocket);
            // Inserir votos no banco de dados caso todos tenham votado
            votings[voteSocket.stand] = undefined;
            clearInterval(votingCountdown);
          }
        }, 1000);
      });
    }
  } catch (err) {
    socket.disconnect(true);
  }
});
