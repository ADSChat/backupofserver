import { Request, Response, Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { rateLimit } from '../../middleware/rateLimit';
import { serverMemberVerification } from '../../middleware/serverMemberVerification';
import { getServerWelcomeQuestions } from '../../services/Server';

export function serverWelcomeQuestionGet(Router: Router) {
  Router.get(
    '/servers/:serverId/welcome/questions',
    authenticate(),
    serverMemberVerification(),
    rateLimit({
      name: 'server_welcome_question_get',
      expireMS: 10000,
      requestCount: 10,
    }),
    route
  );
}

async function route(req: Request, res: Response) {
  const [questions, error] = await getServerWelcomeQuestions(req.serverCache.id, req.serverMemberCache.id);

  if (error) {
    return res.status(400).json(error);
  }
  res.json(questions);
}
