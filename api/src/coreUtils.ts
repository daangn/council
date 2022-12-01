import { type CouncilEvent } from '@prisma/client';
import * as Session from 'core/src/Entity/Council_Entity_Session.gen';
import * as SessionId from 'core/src/Entity/Council_Entity_Session_Id.gen';

import { type Decoded } from '@redwoodjs/api';

export { Session, SessionId };

export const sessionIdFromToken = (decoded: Decoded): SessionId.t => {
  const subject = decoded['sub'];
  const issuedAt = decoded['iat'];
  return SessionId.fromString(`s-${subject}-${issuedAt}`);
};

export const databaseToSessionEvent = (event: CouncilEvent): Session.event => {
  return event.data as unknown as Session.event;
};
