import { type CouncilEvent } from '@prisma/client';

import { type Decoded } from '@redwoodjs/api';

import * as Session from 'src/core/Entity/Council_Entity_Session.gen';
import * as SessionId from 'src/core/Entity/Council_Entity_Session_Id.gen';
import * as UserId from 'src/core/Entity/Council_Entity_User_Id.gen';

export { Session, SessionId, UserId };

export const sessionIdFromToken = (decoded: Decoded): SessionId.t => {
  const subject = (decoded['sub'] as string).replace('|', '-');
  const issuedAt = decoded['iat'];
  return SessionId.fromString(`session-${subject}-${issuedAt}`);
};

export const databaseToSessionEvent = (event: CouncilEvent): Session.event => {
  return event.data as unknown as Session.event;
};
