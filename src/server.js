import sio from 'socket.io';
import jwt from 'jsonwebtoken';

import app from './app';
import auth from './config/auth';

import Judge from './app/models/Judge';
import Stand from './app/models/Stand';
import Athlete from './app/models/Athlete';
import Vote from './app/models/Vote';
import Modality from './app/models/Modality';

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
              model: Judge,
              as: 'judges',
              attributes: ['name', 'id'],
            },
            {
              model: Athlete,
              as: 'athletes',
              attributes: ['id', 'name', 'gender', 'date_born'],
              through: { attributes: [] },
            },
            {
              model: Modality,
              as: 'modality',
              attributes: ['type', 'url_image'],
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

      const findJudgesWhoNeedToVote = stand => {
        const allJudges = stand.judges.map(standJudge => ({
          id: standJudge.id,
          name: standJudge.name,
        }));
        const judgesWhoVoted = new Set(
          Object.keys(votings[stand.id].judgeVotes)
        );

        const missingJudges = allJudges
          .filter(standJudge => !judgesWhoVoted.has(standJudge.id.toString()))
          .map(standJudge => standJudge.name);

        return missingJudges;
      };

      socket.on('getVoteData', callback => {
        judge.stands.forEach(stand => {
          if (typeof votings[stand.id] !== 'undefined') {
            callback({
              stand: stand.id,
              modality: stand.modality.type,
              modality_url: stand.modality.url_image,
              voteType: judge.judge_type,
              athlete: {
                id: votings[stand.id].id,
                name: votings[stand.id].name,
                sex: stand.athletes.find(
                  athlete => athlete.id === votings[stand.id].id
                ).gender,
              },
            });
          }
        });
      });

      socket.on('getJudgesWhoNeedToVote', callback => {
        judge.stands.forEach(stand => {
          if (typeof votings[stand.id] !== 'undefined') {
            callback(findJudgesWhoNeedToVote(stand));
          }
        });
      });

      socket.on('voteStart', voteSocket => {
        // Judge not registered on the stand
        const votedStand = judge.stands.find(
          stand => stand.dataValues.id === voteSocket.stand
        );

        if (!votedStand) {
          return;
          // eslint-disable-next-line no-else-return
        }

        // Voting already happening
        if (typeof votings[voteSocket.stand] !== 'undefined') {
          return;
        }

        votings[voteSocket.stand] = {
          id: voteSocket.athlete,
          name: voteSocket.athleteName,
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
          if (typeof votings[voteSocket.stand] === 'undefined') {
            clearInterval(votingCountdown);
            return;
          }

          secondsRemaining -= 1;
          emitSecondsRemaining();

          if (secondsRemaining <= 0) {
            votings[voteSocket.stand] = undefined;
            io.to(voteSocket.stand).emit('voteCancel', voteSocket);
            votings[voteSocket.stand] = undefined;
            clearInterval(votingCountdown);
          }
        }, 1000);
      });

      socket.on('registerVote', async voteRegisterSocket => {
        // Judge not registered on the stand
        const votedStand = judge.stands.find(
          stand => stand.dataValues.id === voteRegisterSocket.stand
        );

        if (!votedStand) {
          return;
          // eslint-disable-next-line no-else-return
        }

        // Voting needs to be happening
        if (typeof votings[voteRegisterSocket.stand] === 'undefined') {
          return;
        }

        votings[voteRegisterSocket.stand].judgeVotes[decoded.id] = {
          name: judge.name,
          votes: {},
        };

        function insertVote(voteType) {
          // Checks if type of vote is specified and if the judge can do this type of vote
          if (
            typeof voteRegisterSocket[voteType] !== 'undefined' &&
            (judge.judge_type === voteType ||
              judge.judge_type === 'Execution and Difficulty')
          ) {
            votings[voteRegisterSocket.stand].judgeVotes[decoded.id].votes[
              voteType
            ] = voteRegisterSocket[voteType];
          }
        }

        async function createVote(voteType) {
          Object.entries(votings[voteRegisterSocket.stand].judgeVotes).forEach(
            async idAndJudgeVote => {
              const [judgeVoteId, judgeVote] = idAndJudgeVote;
              const vote = judgeVote.votes[voteType];

              if (typeof vote !== 'undefined') {
                await Vote.create({
                  punctuation: vote,
                  type_punctuation: voteType,
                  fk_stand_id: voteRegisterSocket.stand,
                  fk_judge_id: judgeVoteId,
                  fk_athlete_id: voteRegisterSocket.athlete,
                });
              }
            }
          );
        }

        insertVote('Execution');
        insertVote('Difficulty');

        io.to(voteRegisterSocket.stand).emit('newJudgeVote', {
          judgesWhoNeedToVote: findJudgesWhoNeedToVote(
            judge.stands.find(stand => stand.id === voteRegisterSocket.stand)
          ),
        });

        // Wait until all judges voted
        if (
          votedStand.qtd_judge ===
          Object.keys(votings[voteRegisterSocket.stand].judgeVotes).length
        ) {
          await createVote('Execution');
          await createVote('Difficulty');

          io.to(votedStand.id).emit('voteEnd', {
            judgesData: Object.values(votings[votedStand.id].judgeVotes),
          });

          votings[voteRegisterSocket.stand] = undefined;
        }
      });
    }
  } catch (err) {
    socket.disconnect(true);
  }
});
